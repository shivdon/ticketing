import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketEvent } from "@reshu-tickets/micro-ticket";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
