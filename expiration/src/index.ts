import { DatabaseConnectionError } from "@reshu-tickets/micro-ticket";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is undefined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is undefined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL is undefined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS CONNECTION CLOSED!!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err + "\n\n");
    throw new DatabaseConnectionError();
  }
};

start();
