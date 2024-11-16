import { Request, Response, NextFunction } from "express";
import { CreateUserDTO, LoginUserDTO } from "../interfaces/user.DTO";
import Joi, { any } from "joi";

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const schema = Joi.object({
    firstname: Joi.string().required().messages({
      "string.empty": "Firstname cannot be empty",
      "any.required": "Firstname is required",
    }),
    lastname: Joi.string().required().messages({
      "string.empty": "Lastname cannot be empty",
      "any.required": "Lastname is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    username: Joi.string().required().messages({
      "any.required": "username is required",
      "string.empty": "username cannot be empty",
      "string.base": "invalid type,please provide a valid string",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    const errors = error.details.map((detail: any) => ({
      field: detail.context.key,
      message: detail.message,
    }));
    res.status(422).json({
      message: "Validation error",
      success: false,
      errors,
    });
  }
};
export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userSchema = Joi.object<LoginUserDTO>({
      email: Joi.string().email().required().messages({
        "string.email": "provide a vaild email ",
        "any.required": "email is required",
        "string.empty": "email cannot be emoty",
      }),
      password: Joi.string().required().messages({
        "any.required": "password is required",
        "string.empty": "password canoot be empty",
      }),
    });
    await userSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    res.status(422).json({
      message: "validation failed",
      success: false,
      error: error.details ? error.details[0].message : error.message,
    });
    return;
  }
};
