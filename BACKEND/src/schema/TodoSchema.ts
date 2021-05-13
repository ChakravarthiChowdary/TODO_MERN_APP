import { Schema, Model, Document, model, Types } from "mongoose";

interface ITodo extends Document {
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
}

const TodoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, required: true },
});

const TodoModel: Model<ITodo> = model("Todo", TodoSchema);

export default TodoModel;
