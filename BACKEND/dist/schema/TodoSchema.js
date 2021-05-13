"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TodoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose_1.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, required: true },
});
const TodoModel = mongoose_1.model("Todo", TodoSchema);
exports.default = TodoModel;
