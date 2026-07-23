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
      errors.push('Request details are missing');
      return { isValid: false, errors };
    }

    if (!details.destLocationId) {
      errors.push('Destination location ID is required');
    }

    if (!details.createdById) {
      errors.push('Creator user ID is required');
    }

    if (!details.items || !Array.isArray(details.items) || details.items.length === 0) {
      errors.push('At least one item must be included in the request');
    } else {
      details.items.forEach((item: any, idx: number) => {
        if (!item.productId) {
          errors.push(`Item #${idx + 1}: Product ID is required`);
        }
        if (!item.quantity || Number(item.quantity) <= 0) {
          errors.push(`Item #${idx + 1}: Quantity must be greater than 0`);
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
   * 2. 2: checkStockAvailability(productIds)
   * 3. 2.1.1: create(productIds, quantities)
   */
  static async createRequest(req: Request, res: Response): Promise<void> {
    const details = req.body;

    // 1.1.1: validateRequest(details)
    const validation = InventoryRequestController.validateRequest(details);
    if (!validation.isValid) {
      // 1.1.1.1: validationErrors
      res.status(400).json({
        message: 'Validation failed',
        validationErrors: validation.errors,
      });
      return;
    }

    try {
      // 2: checkStockAvailability(productIds) if source location is specified
      if (details.sourceLocationId) {
        const productIds = details.items.map((i: any) => Number(i.productId));
        await InventoryEntity.checkStockAvailability(
          Number(details.sourceLocationId),
          productIds
        );
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
        message: 'System error occurred',
        error: error.message || 'System error occurred',
      });
    }
  }
}
