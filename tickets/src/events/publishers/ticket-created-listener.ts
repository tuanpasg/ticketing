import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@aaron-sg-org/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data:TicketCreatedEvent['data'], msg: Message){
        console.log('Event number:',msg.getSequence());
        console.log('Event data:',data);
        console.log(data.id,data.title,data.price);
        msg.ack()
    };
}