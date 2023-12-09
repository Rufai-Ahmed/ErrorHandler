import { Document, Schema, Types, model } from "mongoose";
import { iUserData } from "../utils/interfaces";

const userModel = new Schema<iUserData>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    token: { type: String },
    status: { type: String, default: "school" },
    schoolCode: { type: String, unique: true },
    verify: { type: Boolean, default: false },
    allPasswords: [{ type: Types.ObjectId, ref: "passwords" }],
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);
