import { Schema, model } from "mongoose";
import { iPasswordData } from "../utils/interfaces";

const passwordModel = new Schema<iPasswordData>(
  {
    password: { type: String },
  },
  { timestamps: true }
);

export default model<iPasswordData>("passwords", passwordModel);
