import { Router, type Request, type Response } from 'express';
import prisma from '../config/prisma.js';

const router = Router();

router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/locations', async (req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(locations);
  } catch (error) {
    console.error('Fetch locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
