import { Schema, Model, Document, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
});

UserSchema.plugin(uniqueValidator);

const UserModal: Model<IUser> = model("User", UserSchema);

export default UserModal;
