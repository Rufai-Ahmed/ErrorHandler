"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const validator_1 = __importDefault(require("../utils/validator"));
const userValidator_1 = require("../utils/userValidator");
const router = (0, express_1.Router)();
router.route("/create-user").post((0, validator_1.default)(userValidator_1.registerValidator), userController_1.createUser);
router.route("/verify-user").patch(userController_1.verifyUser);
router.route("/sign-in-user").post(userController_1.signinUser);
router.route("/reset-password").patch(userController_1.resetUserPassword);
router
    .route("/change-password/:userID")
    .patch((0, validator_1.default)(userValidator_1.passwordValidator), userController_1.changeUserPassword);
exports.default = router;
