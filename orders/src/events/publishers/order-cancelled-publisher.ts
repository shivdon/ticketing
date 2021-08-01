import {
  Subjects,
  Publisher,
  OrderCancelled,
} from "@reshu-tickets/micro-ticket";

export class OrderCancelledPublisher extends Publisher<OrderCancelled> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
