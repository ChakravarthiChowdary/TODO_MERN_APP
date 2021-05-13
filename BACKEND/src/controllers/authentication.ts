import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";

import HttpError from "../models/HttpError";
import User from "../schema/UserSchema";

export const getUserInfo: RequestHandler = (req, res, next) => {
  res.status(200).json({ message: "Get user info succeded" });
};

export const signUpUser: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new HttpError(
        "Invalid Input. Please check API docs for validation"
      );
    }

    const oldUser = await User.find({ email: req.body.email }).exec();

    if (oldUser.length > 0) {
      return next(new HttpError("User already exists. Try logging in !"));
    }
    const password = await bcryptjs.hash(req.body.password, 12);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password,
    });
    const result = await newUser.save();
    const resultObj = result.toObject({ getters: true });
    res.status(200).json({
      userInfo: {
        name: resultObj.name,
        id: resultObj.id,
        email: resultObj.email,
      },
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const foundUser = await User.findOne({ email: req.body.email }).exec();
    if (foundUser) {
      const isValidPassword = await bcryptjs.compare(
        req.body.password,
        foundUser.password
      );
      if (!isValidPassword)
        return next(
          new HttpError(
            "Invalid credentials ! Please check your credentials.",
            401
          )
        );
    } else {
      return next(
        new HttpError(
          "Invalid credentials ! Please check your credentials.",
          401
        )
      );
    }
    const token = JWT.sign(
      { email: foundUser.email, name: foundUser.name, userId: foundUser.id },
      "A_REALLY_SUPER_SECRET_KEY",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      userInfo: {
        email: foundUser.toObject().email,
        name: foundUser.toObject().name,
        id: foundUser.toObject({ getters: true }).id,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
