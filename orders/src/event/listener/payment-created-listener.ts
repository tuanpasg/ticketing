import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@aaron-sg-org/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: { id: string; orderId: string; stripeId: string; }, msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId);

        if(!order){
            throw new Error("Order not found!");
        }

        order.status = OrderStatus.Complete;
        await order.save();

        msg.ack();
    }
}