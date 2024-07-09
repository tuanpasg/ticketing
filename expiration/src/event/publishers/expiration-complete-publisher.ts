import { ExpirationCompleteEvent, Publisher, Subjects } from "@aaron-sg-org/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}