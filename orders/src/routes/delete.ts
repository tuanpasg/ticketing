import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@aaron-sg-org/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../event/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  
  if(!order){
    throw new NotFoundError();
  }

  if(order.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  }
  
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id:order.id,
    ticket:{
      id:order.ticket.id
    },
    version:order.version
  })
  
  res.send(order);
  
});

export { router as deleteOrderRouter };
