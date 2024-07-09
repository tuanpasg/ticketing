import { Subjects, Publisher, TicketCreatedEvent } from "@aaron-sg-org/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}