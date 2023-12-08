import Joi from "joi";

// const

export const registerValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirm: Joi.ref("password"),
});

export const passwordValidator = Joi.object({
  password: Joi.string().required(),
  confirm: Joi.ref("password"),
});
