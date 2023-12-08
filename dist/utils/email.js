"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const GOOGLE_ID = "670614509975-g9564jii6lu7jp2j3huuuhlfq75e7qv8.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESH = "1//04ERZBzRtN229CgYIARAAGAQSNwF-L9IrBl-Rni2Hmse4-pa6v0kQF0KT5vgLtTjdcT9EJwaf8UoJTjOpbZStkV1Ls4C-OmH8nVk";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });
const sendMail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transport = nodemailer_1.default.createTransport({
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
        const getFile = path_1.default.join(__dirname, "../views/index.ejs");
        const html = yield ejs_1.default.renderFile(getFile);
        const mailerOption = {
            from: "Welcome back <abbeyrufai234@gmail.com>",
            to: "abbeyrufai234@gmail.com",
            subject: "Account Verification",
            html,
        };
        yield transport.sendMail(mailerOption);
    }
    catch (error) {
        return error;
    }
});
exports.sendMail = sendMail;
