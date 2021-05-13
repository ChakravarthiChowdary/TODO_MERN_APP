"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signUpUser = exports.getUserInfo = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = __importDefault(require("../models/HttpError"));
const UserSchema_1 = __importDefault(require("../schema/UserSchema"));
const getUserInfo = (req, res, next) => {
    res.status(200).json({ message: "Get user info succeded" });
};
exports.getUserInfo = getUserInfo;
const signUpUser = async (req, res, next) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return new HttpError_1.default("Invalid Input. Please check API docs for validation");
        }
        const oldUser = await UserSchema_1.default.find({ email: req.body.email }).exec();
        if (oldUser.length > 0) {
            return next(new HttpError_1.default("User already exists. Try logging in !"));
        }
        const password = await bcryptjs_1.default.hash(req.body.password, 12);
        const newUser = new UserSchema_1.default({
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
    }
    catch (error) {
        next(error);
    }
};
exports.signUpUser = signUpUser;
const loginUser = async (req, res, next) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const foundUser = await UserSchema_1.default.findOne({ email: req.body.email }).exec();
        if (foundUser) {
            const isValidPassword = await bcryptjs_1.default.compare(req.body.password, foundUser.password);
            if (!isValidPassword)
                return next(new HttpError_1.default("Invalid credentials ! Please check your credentials.", 401));
        }
        else {
            return next(new HttpError_1.default("Invalid credentials ! Please check your credentials.", 401));
        }
        const token = jsonwebtoken_1.default.sign({ email: foundUser.email, name: foundUser.name, userId: foundUser.id }, "A_REALLY_SUPER_SECRET_KEY", { expiresIn: "1h" });
        res.status(200).json({
            userInfo: {
                email: foundUser.toObject().email,
                name: foundUser.toObject().name,
                id: foundUser.toObject({ getters: true }).id,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
