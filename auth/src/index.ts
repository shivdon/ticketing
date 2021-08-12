import mongoose from "mongoose";
import { DatabaseConnectionError } from "@reshu-tickets/micro-ticket";
import { app } from "./app";

const start = async () => {
  console.log("Starting Up.....");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is undefined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is undefined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log("database connected...hurray.....");
    app.listen(4000, () => {
      console.log("listening on port 4000!!!");
    });
  } catch (err) {
    console.log(err + "\n\n");
    throw new DatabaseConnectionError();
  }
};

start();
