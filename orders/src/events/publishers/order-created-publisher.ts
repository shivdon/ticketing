import { Publisher, OrderCreated, Subjects } from "@reshu-tickets/micro-ticket";

export class OrderCreatedPublisher extends Publisher<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
