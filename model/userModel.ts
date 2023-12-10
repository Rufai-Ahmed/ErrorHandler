import { Document, Schema, Types, model } from "mongoose";
import { iUserData } from "../utils/interfaces";
import { SCHOOL } from "../utils/enums";

const userModel = new Schema<iUserData>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    token: { type: String },
    status: { type: String, default: SCHOOL.ADMIN },
    schoolCode: { type: String, unique: true },
    schoolName: { type: String },
    verify: { type: Boolean, default: false },
    allPasswords: [{ type: Types.ObjectId, ref: "passwords" }],
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);
