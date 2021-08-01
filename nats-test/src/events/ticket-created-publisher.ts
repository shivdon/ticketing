import { Publisher } from "./base-publisher";
import { TicketEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedPublisher extends Publisher<TicketEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
