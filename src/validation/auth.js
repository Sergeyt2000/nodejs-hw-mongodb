import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const sendPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

// export const resetPasswordSchema = Joi.object({
//   email: Joi.string().email().required(),
//   newPassword: Joi.string().required(),
// });
