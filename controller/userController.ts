import { Request, Response } from "express";
import { HTTP, SCHOOL } from "../utils/enums";
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import { sendMail } from "../utils/email";
import jwt from "jsonwebtoken";
import { mailSender } from "../utils/mail";
import passwordModel from "../model/passwordModel";
import { Types } from "mongoose";
import moment from "moment";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, schoolName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const schoolCode = crypto.randomBytes(4).toString("hex");

    const passwords = await passwordModel.create({ password });

    const user = await userModel.create({
      email,
      password: hashed,
      schoolCode,
      schoolName,
      token,
      status: SCHOOL.ADMIN,
    });

    user.allPasswords.push(new Types.ObjectId(passwords._id));
    user.save();

    mailSender(user);

    res.status(HTTP.CREATED).json({
      msg: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD).json({
      msg: "Error",
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;

    const getUser = await userModel.findOne({ token });

    if (getUser) {
      await userModel.findByIdAndUpdate(
        getUser._id,
        {
          verify: true,
          token: "",
        },
        { new: true }
      );
      res.status(HTTP.OK).json({
        msg: "User Verified",
      });
    } else {
      return res.status(HTTP.BAD).json({
        msg: "Error Getting user",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD).json({
      msg: "Error",
    });
  }
};

export const signinUser = async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    const getUser = await userModel.findOne({ email });

    if (getUser) {
      const passChecker = await bcrypt.compare(password, getUser.password);

      if (passChecker) {
        if (getUser.verify && getUser.token === "") {
          const encrypted = jwt.sign(
            { _id: getUser._id, status: getUser.status },
            "justSecret",
            { expiresIn: "2d" }
          );

          req.session.isAuth = true;
          req.session.data = getUser;

          res.status(HTTP.OK).json({
            msg: "User Verified",
            data: encrypted,
          });
        } else {
          return res.status(HTTP.BAD).json({
            msg: "Not yet verified ",
          });
        }
      } else {
        return res.status(HTTP.BAD).json({
          msg: "Password Error ",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        msg: "Error Getting user",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD).json({
      msg: "Error",
    });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const getUser = await userModel.findOne({ email });

    const token = crypto.randomBytes(16).toString("hex");

    if (getUser) {
      const check = await userModel.findByIdAndUpdate(
        getUser._id,
        {
          token,
        },
        { new: true }
      );
      res.status(HTTP.OK).json({
        msg: "Your password has been reset",
      });
    } else {
      return res.status(HTTP.BAD).json({
        msg: "Error Getting user",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD).json({
      msg: "Error",
    });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { userID } = req.params;

    const getUser = await userModel.findById(userID);

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    if (getUser) {
      if (getUser.token !== "" && getUser.verify) {
        const checker = (
          await getUser.populate({ path: "allPasswords" })
        ).allPasswords.find((el: any) => el.password === password);

        if (checker) {
          return res.status(404).json({
            msg: `You have used this password before at exactly ${moment(
              checker.createdAt
            ).fromNow()}`,
          });
        } else {
          const check = await userModel.findByIdAndUpdate(
            getUser._id,
            {
              password: hashed,
              token: "",
            },
            { new: true }
          );
          const newP = await passwordModel.create({ password });

          check?.allPasswords.push(new Types.ObjectId(newP._id));
          check?.save();

          res.status(HTTP.OK).json({
            msg: "Your password has changed",
          });
        }
      } else {
        res.status(HTTP.BAD).json({
          msg: "Your account has not been verified",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        msg: "Error Getting user",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD).json({
      msg: "Error",
    });
  }
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await userModel.find();

    const data = req.data;

    if (data.status === "admin") {
      return res.status(HTTP.OK).json({ msg: "user found", data: users });
    } else {
      return res.status(HTTP.BAD).json({
        msg: "You don't have access to this data",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD).json({
      msg: "Error",
    });
  }
};

export const logoutUser = async (req: any, res: Response) => {
  try {
    req.session.destroy();

    return res.status(HTTP.OK).json({
      msg: "User has been logged out",
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD).json({
      msg: "Error",
    });
  }
};
