"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authentication_1 = require("../controllers/authentication");
const router = express_1.Router();
router.get("/", authentication_1.getUserInfo);
router.post("/signup", [
    express_validator_1.check("name").not().isEmpty().withMessage("Name cannot be left blank"),
    express_validator_1.check("email").isEmail().withMessage("Please enter a valid email"),
    express_validator_1.check("password")
        .isLength({ min: 6 })
        .withMessage("Password should have atleast 6 characters"),
], authentication_1.signUpUser);
router.post("/login", [
    express_validator_1.check("email").isEmail().withMessage("Please enter a valid email"),
    express_validator_1.check("password")
        .not()
        .isEmpty()
        .withMessage("Password cannot be left empty"),
], authentication_1.loginUser);
exports.default = router;
