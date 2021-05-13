"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = exports.updateTodo = exports.deleteTodo = exports.getAllTodos = void 0;
const express_validator_1 = require("express-validator");
const TodoSchema_1 = __importDefault(require("../schema/TodoSchema"));
const HttpError_1 = __importDefault(require("../models/HttpError"));
const UserSchema_1 = __importDefault(require("../schema/UserSchema"));
const getAllTodos = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (userId !== req.body.userId)
            return next(new HttpError_1.default("You are not authorized to get TODOS", 401));
        const userTodos = await TodoSchema_1.default.find({ userId: userId }).exec();
        res.status(200).json({
            todos: userTodos.map((todo) => todo.toObject({ getters: true })),
            status: "Success",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTodos = getAllTodos;
const deleteTodo = async (req, res, next) => {
    try {
        const todoId = req.params.todoId;
        const toBeDeletedTodo = await TodoSchema_1.default.findById(todoId);
        if (toBeDeletedTodo) {
            if (toBeDeletedTodo.userId.toString() === req.body.userId) {
                const deletedTodo = await TodoSchema_1.default.findByIdAndDelete(todoId);
                return res
                    .status(200)
                    .json({ todo: toBeDeletedTodo, status: "Success" });
            }
            else
                return next(new HttpError_1.default("You are not authorized to delete the TODO", 401));
        }
        next(new HttpError_1.default("Cannot find TODO with the provided ID", 404));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTodo = deleteTodo;
const updateTodo = async (req, res, next) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const oldTodo = await TodoSchema_1.default.findById(req.params.todoId).exec();
        if (oldTodo) {
            if (oldTodo.userId.toString() !== req.body.userId)
                return next(new HttpError_1.default("You are not authorized to update the TODO", 401));
            if (oldTodo.title === req.body.title &&
                oldTodo.description === req.body.description) {
                return next(new HttpError_1.default("cannot update with same values ! Try with different values"));
            }
        }
        else {
            return next(new HttpError_1.default("Cannot find TODO with the provided ID.", 404));
        }
        const foundTodo = await TodoSchema_1.default.findByIdAndUpdate(req.params.todoId, {
            title: req.body.title,
            description: req.body.description,
            createdAt: new Date(),
        });
        res.status(200).json({
            todo: {
                ...foundTodo === null || foundTodo === void 0 ? void 0 : foundTodo.toObject(),
                title: req.body.title,
                description: req.body.description,
            },
            status: "success",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTodo = updateTodo;
const createTodo = async (req, res, next) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await UserSchema_1.default.findById(req.body.creatorId).exec();
        if (!user) {
            return next(new HttpError_1.default("User Id provided doesnot exists. Please check user Id.", 404));
        }
        if (user.id !== req.body.userId)
            return next(new HttpError_1.default("You are not authorized to post TODO", 401));
        const createdTodo = new TodoSchema_1.default({
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId,
            createdAt: new Date(),
        });
        const result = await createdTodo.save();
        res.status(200).json(result.toObject({ getters: true }));
    }
    catch (error) {
        next(error);
    }
};
exports.createTodo = createTodo;
