import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@aaron-sg-org/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { Message } from "node-nats-streaming";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: { orderId: String; }, msg: Message): Promise<void> {
        // Get the expired order
        const order = await Order.findById(data.orderId).populate("ticket");

        if(!order){
            throw new Error("Order not found!");
        }

        //Check order status
        if(order.status === OrderStatus.AwaitingPayment || order.status === OrderStatus.Created){
            order.status = OrderStatus.Cancelled;
            await order.save();
            await new OrderCancelledPublisher(this.client).publish({
                id:order.id,
                ticket:{
                    id:order.ticket.id
                },
                version:order.version
            });
        };

        msg.ack();
    }
}