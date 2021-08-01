import {
  Subjects,
  ExpirationCompletedEvent,
  Publisher,
} from "@reshu-tickets/micro-ticket";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
