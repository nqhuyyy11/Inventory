import type { Request, Response } from 'express';
import { InventoryEntity } from '../services/inventoryEntity.js';
import { InventoryRequestEntity } from '../services/inventoryRequestEntity.js';

export class InventoryRequestController {
  /**
   * Sequence Diagram Helper: validateRequest(details)
   * Validates request parameters and input data.
   */
  static validateRequest(details: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!details) {
      errors.push('Thông tin yêu cầu không được để trống');
      return { isValid: false, errors };
    }

    if (!details.destLocationId) {
      errors.push('Chưa chọn Cửa hàng nhận');
    }

    if (!details.createdById) {
      errors.push('Thiếu thông tin người tạo yêu cầu');
    }

    if (!details.items || !Array.isArray(details.items) || details.items.length === 0) {
      errors.push('Vui lòng chọn ít nhất một sản phẩm');
    } else {
      details.items.forEach((item: any, idx: number) => {
        if (!item.productId) {
          errors.push(`Dòng #${idx + 1}: Chưa chọn sản phẩm`);
        }
        if (!item.quantity || Number(item.quantity) <= 0) {
          errors.push(`Dòng #${idx + 1}: Số lượng yêu cầu phải lớn hơn 0`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sequence Diagram Function: createRequest(details)
   * Handles creation of an Inventory Request:
   * 1. 1.1.1: validateRequest(details)
   * 2. 2: checkStockAvailability(productIds) -> checks stock sufficiency
   * 3. 2.1.1: create(productIds, quantities)
   */
  static async createRequest(req: Request, res: Response): Promise<void> {
    const details = req.body;

    // 1.1.1: validateRequest(details)
    const validation = InventoryRequestController.validateRequest(details);
    if (!validation.isValid) {
      // 1.1.1.1: validationErrors
      res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        validationErrors: validation.errors,
      });
      return;
    }

    try {
      // 2: checkStockAvailability(productIds) if source location is specified
      if (details.sourceLocationId) {
        const productIds = details.items.map((i: any) => Number(i.productId));
        const stockLevels = await InventoryEntity.checkStockAvailability(
          Number(details.sourceLocationId),
          productIds
        );

        const outOfStockErrors: string[] = [];
        for (const item of details.items) {
          const available = stockLevels[Number(item.productId)] || 0;
          if (available < Number(item.quantity)) {
            outOfStockErrors.push(
              `Sản phẩm ID #${item.productId} không đủ hàng (Yêu cầu: ${item.quantity}, Hiện có: ${available})`
            );
          }
        }

        if (outOfStockErrors.length > 0) {
          res.status(400).json({
            message: 'Thiếu hàng trong kho xuất',
            validationErrors: outOfStockErrors,
          });
          return;
        }
      }

      // 2.1.1: create(productIds, quantities)
      const newRequestObject = await InventoryRequestEntity.create({
        sourceLocationId: details.sourceLocationId,
        destLocationId: details.destLocationId,
        createdById: details.createdById,
        notes: details.notes,
        items: details.items,
      });

      // 4 & 4.1: Request ID & success message with ID
      res.status(201).json({
        message: 'Request Submitted Successfully',
        requestId: newRequestObject.id,
        request: newRequestObject,
      });
    } catch (error: any) {
      console.error('Create Request Error:', error);
      // 3.1: system error message
      res.status(500).json({
        message: 'Thiếu hàng trong kho xuất',
        error: error.message || 'Thiếu hàng trong kho xuất',
      });
    }
  }
}
