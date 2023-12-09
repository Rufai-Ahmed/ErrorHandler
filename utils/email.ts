import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_ID = "";
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT;
const GOOGLE_REFRESH = process.env.GOOGLE_REFRESH;

const oAuth = new google.auth.OAuth2(
  GOOGLE_ID,
  GOOGLE_SECRET,
  GOOGLE_REDIRECT_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

export const sendMail = async () => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "abbeyrufai234@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    const getFile = path.join(__dirname, "../view/index.ejs");

    const html = await ejs.renderFile(getFile);

    const mailerOption = {
      from: "Welcome back <abbeyrufai234@gmail.com>",
      to: "abbeyrufai234@gmail.com",
      subject: "Account Verification",
      html,
    };

    await transport.sendMail(mailerOption);
  } catch (error) {
    return error;
  }
};
