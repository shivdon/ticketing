import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  RequestValidationError,
  validateRequest,
  BadRequestError,
} from "@reshu-tickets/micro-ticket";

import { User } from "../models/user";

import { PasswordHasher } from "../services/passwordHasher";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email Must be Valid"),
    body("password").trim().notEmpty().withMessage("Password Required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Please Provide a valid email");
    }

    const matchPassword = await PasswordHasher.compare(
      existingUser.password,
      password
    );

    if (!matchPassword) {
      throw new BadRequestError("Invalid Password");
    }

    const jwtUser = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // store it on session object

    req.session = {
      jwt: jwtUser,
    };

    res.status(200).send({});
  }
);

export { router as signinRouter };
