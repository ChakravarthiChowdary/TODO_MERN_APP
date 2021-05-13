import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "../controllers/todo";
import { check } from "express-validator";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth);

router.get("/:userId", getAllTodos);

router.delete("/:todoId", deleteTodo);

router.patch(
  "/:todoId",
  [
    check("title")
      .not()
      .isEmpty()
      .withMessage("title of the todo cannot be empty"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Description should have min length of 5"),
  ],
  updateTodo
);

router.post(
  "/",
  [
    check("title")
      .not()
      .isEmpty()
      .withMessage("title of the todo cannot be empty"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Description should have min length of 5"),
    check("userId").not().isEmpty().withMessage("user id cannot be empty"),
  ],
  createTodo
);

export default router;
