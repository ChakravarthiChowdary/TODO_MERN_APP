"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = __importDefault(require("../models/HttpError"));
const checkAuth = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }
        else
            throw new Error("Authentication failed!");
        if (!token) {
            throw new Error("Authentication failed!");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, "A_REALLY_SUPER_SECRET_KEY");
        if (typeof decodedToken === "object")
            req.body.userId = decodedToken.userId;
        next();
    }
    catch (err) {
        const error = new HttpError_1.default("Authentication failed!", 403);
        return next(error);
    }
};
exports.default = checkAuth;
