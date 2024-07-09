import { Listener, OrderCancelledEvent, Subjects } from "@aaron-sg-org/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../model/tickes";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data:OrderCancelledEvent['data'],msg:Message):Promise<void>{
        const ticket = await Ticket.findById(data.ticket.id)

        if(!ticket){
            throw new Error("Ticket not found!");
        }

        ticket.orderId = undefined;

        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack();
    }
}