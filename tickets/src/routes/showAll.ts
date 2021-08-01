import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  if (!tickets) {
    throw new Error("Ticket Not Found");
  }

  res.send(tickets);
});

export { router as showAllTickets };
