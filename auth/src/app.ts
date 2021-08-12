import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";

import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "@reshu-tickets/micro-ticket";

const app = express();
app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(errorHandler);

export { app };
