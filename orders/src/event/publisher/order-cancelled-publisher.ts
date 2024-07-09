import { Publisher, OrderCancelledEvent, Subjects } from "@aaron-sg-org/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}