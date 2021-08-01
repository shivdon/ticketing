import { requireAuth, validateRequest } from "@reshu-tickets/micro-ticket";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "./events/publishers/ticket-created-publisher";
const router = express.Router();
import { natsWrapper } from "../nats-wrapper";

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Valid Title Required"),
    body("price")
      .not()
      .isEmpty()
      .isFloat({ gt: 0 })
      .withMessage("Price Must be Greater Than Zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    }).save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicket };
