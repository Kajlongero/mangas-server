import joi from "joi";

export const ChangeUsernameSchema = joi.object({
  username: joi.string().min(3).max(64).required(),
});

export const ChangeDescriptionSchema = joi.object({
  description: joi.string().min(0).max(192).required(),
});

export const ChangeBirthDateSchema = joi.object({
  birthDate: joi.string().isoDate(),
});
