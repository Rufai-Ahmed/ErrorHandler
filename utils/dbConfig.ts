import { connect } from "mongoose";
import env from "dotenv";
env.config();

export const dbConfig = async () => {
  try {
    await connect(process.env.DATABASE_URL!).then(() => {
      console.log("DB connected");
    });
  } catch (error) {
    console.log(error);
  }
};
