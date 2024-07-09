import { requireAuth } from '@aaron-sg-org/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const createdOrders = await Order.find({userId:req.currentUser!.id}).populate('ticket');
  console.log(createdOrders);
  res.status(200).send(createdOrders);
});

export { router as indexOrderRouter };
