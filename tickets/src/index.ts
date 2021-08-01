import mongoose from "mongoose";
import { DatabaseConnectionError } from "@reshu-tickets/micro-ticket";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./routes/events/listeners/order-created-listener";
import { OrderCancelledListener } from "./routes/events/listeners/order-cancelled-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is undefined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is undefined");
  }

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
      console.log("NATS CONNECTION CLOSED");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log("database connected...");
    app.listen(4000, () => {
      console.log("listening on port 4000");
    });
  } catch (err) {
    console.log(err + "\n\n");
    throw new DatabaseConnectionError();
  }
};

start();
