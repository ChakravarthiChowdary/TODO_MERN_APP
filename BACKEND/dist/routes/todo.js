"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = require("../controllers/todo");
const express_validator_1 = require("express-validator");
const checkAuth_1 = __importDefault(require("../middlewares/checkAuth"));
const router = express_1.Router();
router.use(checkAuth_1.default);
router.get("/:userId", todo_1.getAllTodos);
router.delete("/:todoId", todo_1.deleteTodo);
router.patch("/:todoId", [
    express_validator_1.check("title")
        .not()
        .isEmpty()
        .withMessage("title of the todo cannot be empty"),
    express_validator_1.check("description")
        .isLength({ min: 5 })
        .withMessage("Description should have min length of 5"),
], todo_1.updateTodo);
router.post("/", [
    express_validator_1.check("title")
        .not()
        .isEmpty()
        .withMessage("title of the todo cannot be empty"),
    express_validator_1.check("description")
        .isLength({ min: 5 })
        .withMessage("Description should have min length of 5"),
    express_validator_1.check("userId").not().isEmpty().withMessage("user id cannot be empty"),
], todo_1.createTodo);
exports.default = router;
