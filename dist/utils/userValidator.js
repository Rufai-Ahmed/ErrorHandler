"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidator = exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
// const
exports.registerValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    confirm: joi_1.default.ref("password"),
});
exports.passwordValidator = joi_1.default.object({
    password: joi_1.default.string().required(),
    confirm: joi_1.default.ref("password"),
});
