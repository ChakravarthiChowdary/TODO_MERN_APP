import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import Todo from "../schema/TodoSchema";
import HttpError from "../models/HttpError";
import User from "../schema/UserSchema";

export const getAllTodos: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.body.userId)
      return next(new HttpError("You are not authorized to get TODOS", 401));
    const userTodos = await Todo.find({ userId: userId }).exec();
    res.status(200).json({
      todos: userTodos.map((todo) => todo.toObject({ getters: true })),
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo: RequestHandler = async (req, res, next) => {
  try {
    const todoId = req.params.todoId;
    const toBeDeletedTodo = await Todo.findById(todoId);

    if (toBeDeletedTodo) {
      if (toBeDeletedTodo.userId.toString() === req.body.userId) {
        const deletedTodo = await Todo.findByIdAndDelete(todoId);
        return res
          .status(200)
          .json({ todo: toBeDeletedTodo, status: "Success" });
      } else
        return next(
          new HttpError("You are not authorized to delete the TODO", 401)
        );
    }
    next(new HttpError("Cannot find TODO with the provided ID", 404));
  } catch (error) {
    next(error);
  }
};

export const updateTodo: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const oldTodo = await Todo.findById(req.params.todoId).exec();

    if (oldTodo) {
      if (oldTodo.userId.toString() !== req.body.userId)
        return next(
          new HttpError("You are not authorized to update the TODO", 401)
        );
      if (
        oldTodo.title === req.body.title &&
        oldTodo.description === req.body.description
      ) {
        return next(
          new HttpError(
            "cannot update with same values ! Try with different values"
          )
        );
      }
    } else {
      return next(new HttpError("Cannot find TODO with the provided ID.", 404));
    }

    const foundTodo = await Todo.findByIdAndUpdate(req.params.todoId, {
      title: req.body.title,
      description: req.body.description,
      createdAt: new Date(),
    });
    res.status(200).json({
      todo: {
        ...foundTodo?.toObject(),
        title: req.body.title,
        description: req.body.description,
      },
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const createTodo: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(req.body.creatorId).exec();
    if (!user) {
      return next(
        new HttpError(
          "User Id provided doesnot exists. Please check user Id.",
          404
        )
      );
    }
    if (user.id !== req.body.userId)
      return next(new HttpError("You are not authorized to post TODO", 401));
    const createdTodo = new Todo({
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId,
      createdAt: new Date(),
    });
    const result = await createdTodo.save();
    res.status(200).json(result.toObject({ getters: true }));
  } catch (error) {
    next(error);
  }
};
