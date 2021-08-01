import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  BadRequestError,
} from "@reshu-tickets/micro-ticket";
import { TicketUpdatedPublisher } from "./events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
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
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new Error("Ticket Not Found");
    }

    if (ticket.orderId) {
      throw new BadRequestError("ticket is already reserved");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await ticket.set({ title: req.body.title, price: req.body.price }).save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicket };
