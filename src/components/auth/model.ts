import joi from "joi";

export const LoginSchema = joi.object({
  identifier: joi.string().required(),
  password: joi.string().required().min(8).max(64),
  remember: joi.boolean(),
});

export const RegisterSchema = joi.object({
  email: joi.string().email().required(),
  username: joi.string().required(),
  password: joi.string().required().min(8).max(64),
  remember: joi.boolean(),
});
