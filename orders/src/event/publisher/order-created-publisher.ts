import { Publisher, OrderCreatedEvent, Subjects } from "@aaron-sg-org/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}