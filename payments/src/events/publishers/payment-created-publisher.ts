import { Subjects, Publisher, PaymentCreatedEvent } from '@aaron-sg-org/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
