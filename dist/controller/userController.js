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
exports.getAllUsers = exports.changeUserPassword = exports.resetUserPassword = exports.signinUser = exports.verifyUser = exports.createUser = void 0;
const enums_1 = require("../utils/enums");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../model/userModel"));
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(3).toString("hex");
        const schoolCode = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            email,
            password: hashed,
            schoolCode,
            token,
        });
        (0, email_1.sendMail)();
        res.status(enums_1.HTTP.CREATED).json({
            msg: "User created successfully",
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(enums_1.HTTP.BAD).json({
            msg: "Error",
        });
    }
});
exports.createUser = createUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, token } = req.body;
        const getUser = yield userModel_1.default.findOne({ token });
        if (getUser) {
            yield userModel_1.default.findByIdAndUpdate(getUser._id, {
                verify: true,
                token: "",
            }, { new: true });
            res.status(enums_1.HTTP.OK).json({
                msg: "User Verified",
            });
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                msg: "Error Getting user",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(enums_1.HTTP.BAD).json({
            msg: "Error",
        });
    }
});
exports.verifyUser = verifyUser;
const signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const getUser = yield userModel_1.default.findOne({ email });
        if (getUser) {
            const passChecker = yield bcrypt_1.default.compare(password, getUser.password);
            if (passChecker) {
                if (getUser.verify && getUser.token === "") {
                    const encrypted = jsonwebtoken_1.default.sign({ _id: getUser._id, status: getUser.status }, "justSecret", { expiresIn: "2d" });
                    res.status(enums_1.HTTP.OK).json({
                        msg: "User Verified",
                        data: encrypted,
                    });
                }
                else {
                    return res.status(enums_1.HTTP.BAD).json({
                        msg: "Not yet verified ",
                    });
                }
            }
            else {
                return res.status(enums_1.HTTP.BAD).json({
                    msg: "Password Error ",
                });
            }
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                msg: "Error Getting user",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(enums_1.HTTP.BAD).json({
            msg: "Error",
        });
    }
});
exports.signinUser = signinUser;
const resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const getUser = yield userModel_1.default.findOne({ email });
        const token = crypto_1.default.randomBytes(16).toString("hex");
        if (getUser) {
            const check = yield userModel_1.default.findByIdAndUpdate(getUser._id, {
                token,
            }, { new: true });
            res.status(enums_1.HTTP.OK).json({
                msg: "Your password has been reset",
            });
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                msg: "Error Getting user",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(enums_1.HTTP.BAD).json({
            msg: "Error",
        });
    }
});
exports.resetUserPassword = resetUserPassword;
const changeUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const { userID } = req.params;
        const getUser = yield userModel_1.default.findById(userID);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        if (getUser) {
            if (getUser.token !== "" && getUser.verify) {
                const check = yield userModel_1.default.findByIdAndUpdate(getUser._id, {
                    password: hashed,
                    token: "",
                }, { new: true });
                res.status(enums_1.HTTP.OK).json({
                    msg: "Your password has changed",
                });
            }
            else {
                res.status(enums_1.HTTP.BAD).json({
                    msg: "Your account has not been verified",
                });
            }
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                msg: "Error Getting user",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(enums_1.HTTP.BAD).json({
            msg: "Error",
        });
    }
});
exports.changeUserPassword = changeUserPassword;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        const data = req.data;
        if (data.status === "admin") {
            return res.status(enums_1.HTTP.OK).json({ msg: "user found", data: users });
        }
        else {
            return res.status(enums_1.HTTP.BAD).json({
                msg: "You don't have access to this data",
            });
        }
        return res.status(200).json({
            msg: "All users",
            data: users,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(enums_1.HTTP.BAD).json({
            msg: "Error",
        });
    }
});
exports.getAllUsers = getAllUsers;
