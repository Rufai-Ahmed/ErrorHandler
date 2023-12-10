import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
dotenv.config();

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_ID!,
  process.env.GOOGLE_SECRET!,
  process.env.GOOGLE_REDIRECT!
);

auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH });

export const mailSender = async (user: any) => {
  try {
    const accessToken: any = (await auth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abbeyrufai234@gmail.com",
        type: "OAuth2",
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH,
        accessToken,
      },
    });

    const data = {
      token: user.token,
      email: user.email,
      url: `http://localhost:5173/verify/${user._id}`,
    };

    const getPath = path.join(__dirname, "../views/index.ejs");

    const html = await ejs.renderFile(getPath, { data });

    const mailerOption = {
      from: "abbeyrufai234@gmail.com",
      to: user.email,
      subject: "Account Verification",
      html,
    };

    await transport.sendMail(mailerOption);
  } catch (error) {
    console.log(error);
  }
};
