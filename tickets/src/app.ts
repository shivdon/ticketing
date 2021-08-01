import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";

import cookieSession from "cookie-session";

import { errorHandler, currentUser } from "@reshu-tickets/micro-ticket";
import { createTicket } from "./routes/new";
import { showTicket } from "./routes/show";
import { showAllTickets } from "./routes/showAll";
import { updateTicket } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUser);

app.use(createTicket);
app.use(showTicket);
app.use(showAllTickets);
app.use(updateTicket);

app.all("*", (req, res) => {
  throw new Error("Not Found!!");
});

app.use(errorHandler);

export { app };
