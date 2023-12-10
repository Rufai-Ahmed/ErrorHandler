import { Router } from "express";
import {
  changeUserPassword,
  createUser,
  getAllUsers,
  logoutUser,
  resetUserPassword,
  signinUser,
  verifyUser,
} from "../controller/userController";
import validator from "../utils/validator";
import { passwordValidator, registerValidator } from "../utils/userValidator";
import { authorization } from "../utils/authorization";

const router: Router = Router();

router.route("/create-user").post(validator(registerValidator), createUser);
router.route("/verify-user").patch(verifyUser);
router.route("/logout").get(logoutUser);
router.route("/getAll").get(authorization, getAllUsers);
router.route("/sign-in-user").post(signinUser);
router.route("/reset-password").patch(resetUserPassword);
router
  .route("/change-password/:userID")
  .patch(validator(passwordValidator), changeUserPassword);

export default router;
