import { Subjects, Publisher, TicketCreatedEvent, TicketUpdatedEvent } from "@aaron-sg-org/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject= Subjects.TicketUpdated;
}