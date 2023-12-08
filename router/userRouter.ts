import { Router } from "express";
import {
  changeUserPassword,
  createUser,
  resetUserPassword,
  signinUser,
  verifyUser,
} from "../controller/userController";
import validator from "../utils/validator";
import { passwordValidator, registerValidator } from "../utils/userValidator";

const router: Router = Router();

router.route("/create-user").post(validator(registerValidator), createUser);
router.route("/verify-user").patch(verifyUser);
router.route("/sign-in-user").post(signinUser);
router.route("/reset-password").patch(resetUserPassword);
router
  .route("/change-password/:userID")
  .patch(validator(passwordValidator), changeUserPassword);

export default router;
