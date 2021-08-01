import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@reshu-tickets/micro-ticket";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
