import { requireAuth, validateRequest } from "@reshu-tickets/micro-ticket";
import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new Error("Ticket Not Found");
  }

  res.send(ticket);
});

export { router as showTicket };
