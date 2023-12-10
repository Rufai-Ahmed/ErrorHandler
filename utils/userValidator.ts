import Joi from "joi";

let regex =
  /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;

export const registerValidator = Joi.object({
  schoolName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirm: Joi.ref("password"),
});

export const passwordValidator = Joi.object({
  password: Joi.string().required(),
  confirm: Joi.ref("password"),
});
