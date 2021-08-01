import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  OrderStatus,
  NotAuthorizedError,
} from "@reshu-tickets/micro-ticket";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order Not Found!");
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // if (order.status === OrderStatus.Cancelled) {
    //   throw new BadRequestError("Cannot pay for an cancelled order");
    // }

    const charge = await stripe.charges.create({
      currency: "inr",
      amount: order.price * 100,
      source: token,
      description: "purchase ticket",
    });

    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    }).save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      orderId: payment.orderId,
      stripeId: payment.stripeId,
      id: payment.id,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
