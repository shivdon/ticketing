import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketEvent["data"], msg: Message) {
    console.log("Event data!", data);

    msg.ack();
  }
}
