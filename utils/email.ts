import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const GOOGLE_ID =
  "670614509975-g9564jii6lu7jp2j3huuuhlfq75e7qv8.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESH =
  "1//04ERZBzRtN229CgYIARAAGAQSNwF-L9IrBl-Rni2Hmse4-pa6v0kQF0KT5vgLtTjdcT9EJwaf8UoJTjOpbZStkV1Ls4C-OmH8nVk";

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

    const getFile = path.join(__dirname, "../views/index.ejs");

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
