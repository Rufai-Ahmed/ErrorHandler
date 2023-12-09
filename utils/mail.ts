import { google } from 'googleapis'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import ejs from 'ejs'
dotenv.config()

const auth = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT,
)

auth.setCredentials({refresh_token: process.env.GOOGLE_REFRESH})

export const mailSender = async (user: any) => {
    try {

        const accessToken: any = (await auth.getAccessToken()).token
        
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "abbeyrufai234@gmail.com",
                type: "OAuth2",
                clientId: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH,
                accessToken,
            }
        })

        const html = await ejs.renderFile("../view/index.ejs")

        const mailerOption = {
            from : "abbeyrufai234@gmail.com",
            to: user.email,
            subject: "Account Verification",
            html
        }

        await transport.sendMail(mailerOption)

    } catch (error) {
        console.log(error);
        
    }
}