import { Listener, OrderCreated, Subjects } from "@reshu-tickets/micro-ticket";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queues";

export class OrderCreatedListener extends Listener<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreated["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("waiting", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: 10000,
      }
    );

    msg.ack();
  }
}
