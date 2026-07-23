import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware.js";
import prisma from "../../config/prisma.js";

// [Store Manager] Xin cấp hàng (Request Item Dispatch)
export const createDispatchRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destLocationId, items, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!destLocationId || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Thiếu thông tin destLocationId hoặc danh sách items." });
      return;
    }

    // Tạo InventoryRequest với trạng thái mặc định là PENDING
    const request = await prisma.inventoryRequest.create({
      data: {
        destLocationId,
        createdById: userId,
        notes,
        status: "PENDING",
        items: {
          create: items.map((item: { productId: string; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({ message: "Tạo yêu cầu thành công", data: request });
  } catch (error) {
    console.error("Error creating dispatch request:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// [Inventory Manager] Xử lý đơn (Process Dispatch Request)
export const processDispatchRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { sourceLocationId, action } = req.body; // action: 'APPROVE' | 'REJECT'
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!sourceLocationId || !action || !["APPROVE", "REJECT"].includes(action)) {
      res.status(400).json({ message: "Thiếu sourceLocationId hoặc action (APPROVE/REJECT) không hợp lệ." });
      return;
    }

    const inventoryRequest = await prisma.inventoryRequest.findUnique({
      where: { id: String(id) },
      include: { items: true },
    });

    if (!inventoryRequest) {
      res.status(404).json({ message: "Không tìm thấy yêu cầu" });
      return;
    }

    if (inventoryRequest.status !== "PENDING") {
      res.status(400).json({ message: "Yêu cầu này đã được xử lý" });
      return;
    }

    if (action === "REJECT") {
      const updatedReq = await prisma.inventoryRequest.update({
        where: { id: String(id) },
        data: { status: "REJECTED", sourceLocationId: String(sourceLocationId) },
      });
      res.json({ message: "Đã từ chối yêu cầu", data: updatedReq });
      return;
    }

    // Nếu APPROVE: Kiểm tra tồn kho bằng Transaction
    try {
      const requestItems = (inventoryRequest as any).items;
      
      const result = await prisma.$transaction(async (tx) => {
        const outOfStockItems = [];

        // Kiểm tra tồn kho tại Kho xuất (sourceLocation)
        for (const reqItem of requestItems) {
          const inventory = await tx.inventory.findFirst({
            where: {
              locationId: String(sourceLocationId),
              productId: reqItem.productId,
            },
          });

          if (!inventory || inventory.quantity < reqItem.quantity) {
            outOfStockItems.push({
              productId: reqItem.productId,
              requested: reqItem.quantity,
              available: inventory?.quantity || 0,
            });
          }
        }

        // Nếu thiếu hàng -> ROLLBACK (Bắn ra lỗi)
        if (outOfStockItems.length > 0) {
          throw { name: "OutOfStockError", outOfStockItems };
        }

        // Nếu đủ hàng -> Trừ kho, Cộng kho, Lưu lịch sử
        for (const reqItem of requestItems) {
          // Trừ Kho Xuất
          const sourceInv = await tx.inventory.findFirst({
            where: { locationId: String(sourceLocationId), productId: reqItem.productId },
          });
          
          await tx.inventory.update({
            where: { id: sourceInv!.id },
            data: { quantity: { decrement: reqItem.quantity } },
          });

          // Cộng Kho/Cửa hàng Nhận
          const destInv = await tx.inventory.findFirst({
            where: { locationId: inventoryRequest.destLocationId, productId: reqItem.productId },
          });

          if (destInv) {
            await tx.inventory.update({
              where: { id: destInv.id },
              data: { quantity: { increment: reqItem.quantity } },
            });
          } else {
            await tx.inventory.create({
              data: {
                locationId: inventoryRequest.destLocationId,
                productId: reqItem.productId,
                quantity: reqItem.quantity,
              },
            });
          }
        }

        // Lưu Transaction (EXPORT từ Kho Xuất)
        const exportTx = await tx.transaction.create({
          data: {
            locationId: String(sourceLocationId),
            type: "EXPORT",
            createdById: userId,
            notes: `Xuất kho cho yêu cầu ${id}`,
            items: {
              create: requestItems.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: 0, // Điều chuyển nội bộ tạm thời giá = 0
              }))
            }
          }
        });

        // Cập nhật trạng thái Request
        const updatedReq = await tx.inventoryRequest.update({
          where: { id: String(id) },
          data: { status: "APPROVED", sourceLocationId: String(sourceLocationId) },
        });

        return updatedReq;
      });

      res.json({ message: "Duyệt yêu cầu và điều chuyển thành công", data: result });
      return;
    } catch (err: any) {
      if (err.name === "OutOfStockError") {
        res.status(400).json({
          message: "Hàng trong kho không đủ để xuất",
          details: err.outOfStockItems,
        });
        return;
      }
      throw err; // Bắn ra ngoài catch chung
    }

  } catch (error) {
    console.error("Error processing dispatch request:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// [General] Lấy danh sách Request
export const getRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const destLocationId = typeof req.query.destLocationId === 'string' ? req.query.destLocationId : undefined;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (destLocationId) filter.destLocationId = destLocationId;

    const requests = await prisma.inventoryRequest.findMany({
      where: filter,
      include: {
        items: {
          include: { product: true }
        },
        createdBy: { select: { fullName: true, username: true } },
        destLocation: { select: { name: true } },
        sourceLocation: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};
