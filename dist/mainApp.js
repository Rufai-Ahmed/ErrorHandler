"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const mainError_1 = require("./error/mainError");
const errHandler_1 = require("./error/errHandler");
const enums_1 = require("./utils/enums");
const userRouter_1 = __importDefault(require("./router/userRouter"));
const mainApp = (app) => {
    try {
        app.use("/api/v1/", userRouter_1.default);
        app.get("/", (req, res) => {
            try {
                return res.status(200).json({
                    msg: "Welcome to my API",
                });
            }
            catch (error) {
                return res.status(404).json({
                    msg: "Error",
                });
            }
        });
        app.all("*", (req, res, next) => {
            next(new mainError_1.mainError({
                name: "Route Error",
                message: `This endpoint you entered ${req.originalUrl} is not supported`,
                status: enums_1.HTTP.BAD,
                success: false,
            }));
        });
        app.use(errHandler_1.errHandler);
    }
    catch (error) {
        console.log(error);
    }
};
exports.mainApp = mainApp;
