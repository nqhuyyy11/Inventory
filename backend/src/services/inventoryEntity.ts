import prisma from '../config/prisma.js';

export class InventoryEntity {
  /**
   * Sequence Diagram Function: checkStockAvailability(productIds)
   * Queries stock availability for given product IDs at a specified location.
   */
  static async checkStockAvailability(locationId: number, productIds: number[]): Promise<Record<number, number>> {
    const stockLevels: Record<number, number> = {};

    for (const productId of productIds) {
      const result = await prisma.inventory.aggregate({
        where: {
          locationId: Number(locationId),
          productId: Number(productId),
        },
        _sum: {
          quantity: true,
        },
      });
      stockLevels[productId] = result._sum.quantity || 0;
    }

    return stockLevels;
  }
}
