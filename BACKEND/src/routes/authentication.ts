import { Router } from "express";
import { check } from "express-validator";

import {
  getUserInfo,
  loginUser,
  signUpUser,
} from "../controllers/authentication";

const router = Router();

router.get("/", getUserInfo);

router.post(
  "/signup",
  [
    check("name").not().isEmpty().withMessage("Name cannot be left blank"),
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password should have atleast 6 characters"),
  ],
  signUpUser
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password cannot be left empty"),
  ],
  loginUser
);

export default router;
