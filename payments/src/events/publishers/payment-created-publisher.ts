import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@reshu-tickets/micro-ticket";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
