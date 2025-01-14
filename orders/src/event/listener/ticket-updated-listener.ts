import { Listener, Subjects, TicketUpdatedEvent } from "@aaron-sg-org/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message):Promise<void> {
        const {id, title, price, version} = data;

        const ticket = await Ticket.findByEvent(data);

        if(!ticket){
            throw new Error('Ticket not found!');
        }

        ticket.price= price;
        ticket.title= title;

        await ticket.save();

        msg.ack();
    }
}