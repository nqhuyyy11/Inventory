import prisma from '../config/prisma.js';

export interface CreateRequestParams {
  sourceLocationId?: number;
  destLocationId: number;
  createdById: number;
  notes?: string;
  items: Array<{ productId: number; quantity: number }>;
}

export class InventoryRequestEntity {
  /**
   * Sequence Diagram Function: create(productIds, quantities)
   * Creates a new Inventory Request object in the database.
   */
  static async create(details: CreateRequestParams) {
    const newRequest = await prisma.$transaction(async (tx) => {
      const request = await tx.inventoryRequest.create({
        data: {
          sourceLocationId: details.sourceLocationId ? Number(details.sourceLocationId) : null,
          destLocationId: Number(details.destLocationId),
          createdById: Number(details.createdById),
          notes: details.notes || '',
          status: 'PENDING',
          items: {
            create: details.items.map((item) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          sourceLocation: true,
          destLocation: true,
          createdBy: true,
        },
      });
      return request;
    });

    return newRequest;
  }
}
