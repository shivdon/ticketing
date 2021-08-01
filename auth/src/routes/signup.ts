import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import jwt from "jsonwebtoken";
import {
  RequestValidationError,
  validateRequest,
  BadRequestError,
} from "@reshu-tickets/micro-ticket";
import { body, validationResult } from "express-validator";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email Must Be Valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("email and password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in Use");
    }

    const user = await User.build({ email, password }).save();

    // generate json web token

    const jwtUser = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // store it on session object

    req.session = {
      jwt: jwtUser,
    };

    res.status(201).send(user);

    res.send({});
  }
);

export { router as signupRouter };
