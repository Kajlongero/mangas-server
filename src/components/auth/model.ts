import joi from "joi";

const jwt = joi
  .string()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

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

export const RefreshTokenSchema = joi.object({
  refreshToken: jwt.required(),
});

export const ChangePasswordSchema = joi.object({
  oldPassword: joi.string().required().min(8).max(64),
  newPassword: joi.string().required().min(8).max(64),
  closeSessions: joi.boolean(),
});
