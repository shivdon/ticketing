import { Publisher, Subjects, TicketEvent } from "@reshu-tickets/micro-ticket";

export class TicketCreatedPublisher extends Publisher<TicketEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
