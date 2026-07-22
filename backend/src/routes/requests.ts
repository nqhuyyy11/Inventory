import { Router, type Request, type Response } from 'express';
import prisma from '../config/prisma.js';

const router = Router();

// Store Manager creates a dispatch request
router.post('/dispatch', async (req: Request, res: Response): Promise<void> => {
  const { sourceLocationId, destLocationId, createdById, notes, items } = req.body;

  if (!sourceLocationId || !destLocationId || !createdById || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: 'Missing required dispatch fields' });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create the main inventory request
      const request = await tx.inventoryRequest.create({
        data: {
          sourceLocationId: Number(sourceLocationId),
          destLocationId: Number(destLocationId),
          createdById: Number(createdById),
          notes: notes || '',
          status: 'PENDING',
          items: {
            create: items.map((item: any) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
            })),
          },
        },
        include: {
          items: true,
        },
      });
      return request;
    });

    res.status(201).json({ message: 'Dispatch request created successfully', request: result });
  } catch (error: any) {
    console.error('Create dispatch request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all dispatch requests
router.get('/', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.inventoryRequest.findMany({
      include: {
        sourceLocation: true,
        destLocation: true,
        createdBy: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Fetch requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Inventory Manager processes the request
router.post('/:id/process', async (req: Request, res: Response): Promise<void> => {
  const requestId = Number(req.params.id);
  const { userId } = req.body; // Inventory Manager user ID processing this

  if (!userId) {
    res.status(400).json({ message: 'Processor User ID is required' });
    return;
  }

  const outOfStockErrors: string[] = [];

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch request with items
      const request = await tx.inventoryRequest.findUnique({
        where: { id: requestId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!request) {
        throw new Error('Request not found');
      }

      if (request.status !== 'PENDING') {
        throw new Error('Request has already been processed');
      }

      const sourceLocId = request.sourceLocationId;
      if (!sourceLocId) {
        throw new Error('Source location is not defined for this request');
      }

      // 2. Validate stock for each item
      for (const item of request.items) {
        const totalStock = await tx.inventory.aggregate({
          where: {
            locationId: sourceLocId,
            productId: item.productId,
          },
          _sum: {
            quantity: true,
          },
        });

        const currentQty = totalStock._sum.quantity || 0;
        if (currentQty < item.quantity) {
          outOfStockErrors.push(
            `Product "${item.product.name}" is out of stock. Required: ${item.quantity}, Available: ${currentQty}`
          );
        }
      }

      if (outOfStockErrors.length > 0) {
        throw new Error('OUT_OF_STOCK');
      }

      // 3. Process stock transfer and record transactions
      let totalValue = 0;
      const exportTxItemsData: any[] = [];
      const importTxItemsData: any[] = [];

      for (const item of request.items) {
        let remainingToDeduct = item.quantity;

        // Fetch all inventory batches at source sorted by expiration date (oldest/soonest to expire first)
        const inventoryBatches = await tx.inventory.findMany({
          where: {
            locationId: sourceLocId,
            productId: item.productId,
          },
          orderBy: [
            { expirationDate: 'asc' }, // soonest to expire
            { id: 'asc' },
          ],
        });

        for (const batch of inventoryBatches) {
          if (remainingToDeduct <= 0) break;

          const deductQty = Math.min(batch.quantity, remainingToDeduct);
          remainingToDeduct -= deductQty;

          // Deduct from source batch
          if (batch.quantity === deductQty) {
            await tx.inventory.delete({
              where: { id: batch.id },
            });
          } else {
            await tx.inventory.update({
              where: { id: batch.id },
              data: { quantity: { decrement: deductQty } },
            });
          }

          // Add to destination store batch (matching the expiration date to keep batch details)
          const destBatch = await tx.inventory.findFirst({
            where: {
              locationId: request.destLocationId,
              productId: item.productId,
              expirationDate: batch.expirationDate,
            },
          });

          if (destBatch) {
            await tx.inventory.update({
              where: { id: destBatch.id },
              data: { quantity: { increment: deductQty } },
            });
          } else {
            await tx.inventory.create({
              data: {
                locationId: request.destLocationId,
                productId: item.productId,
                quantity: deductQty,
                costPrice: batch.costPrice,
                sellingPrice: batch.sellingPrice,
                expirationDate: batch.expirationDate,
              },
            });
          }

          totalValue += deductQty * batch.costPrice;
          exportTxItemsData.push({
            productId: item.productId,
            quantity: deductQty,
            price: batch.costPrice,
          });
          importTxItemsData.push({
            productId: item.productId,
            quantity: deductQty,
            price: batch.costPrice,
          });
        }
      }

      // Create EXPORT transaction for Warehouse
      const exportTx = await tx.transaction.create({
        data: {
          locationId: sourceLocId,
          type: 'EXPORT',
          createdById: userId,
          totalValue,
          notes: `Exported dispatch items for Request #${requestId}`,
          items: {
            create: exportTxItemsData,
          },
        },
      });

      // Create IMPORT transaction for Store
      const importTx = await tx.transaction.create({
        data: {
          locationId: request.destLocationId,
          type: 'IMPORT',
          createdById: userId,
          totalValue,
          notes: `Imported dispatch items from Warehouse (Request #${requestId})`,
          items: {
            create: importTxItemsData,
          },
        },
      });

      // 4. Update request status to APPROVED
      const updatedRequest = await tx.inventoryRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' },
      });

      return { updatedRequest, exportTx, importTx };
    });

    res.status(200).json({
      message: 'Dispatch request processed and approved successfully',
      result,
    });
  } catch (error: any) {
    if (error.message === 'OUT_OF_STOCK') {
      res.status(400).json({
        message: 'Out-of-Stock Error',
        errors: outOfStockErrors,
      });
      return;
    }
    console.error('Process request error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
