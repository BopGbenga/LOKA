import { Request, Response, NextFunction } from "express";
import { CreateUserDTO, LoginUserDTO } from "../interfaces/user.DTO";
import Joi, { any } from "joi";

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: CreateUserDTO = req.body;
  const schema = Joi.object<CreateUserDTO>({
    firstname: Joi.string().required().messages({
      "string.base": "invalid type, please provide a valid string",
      "any.required": "name is required",
      "string.empty": "name cannot be emoty",
    }),
    lastname: Joi.string().required().messages({
      "string.base": "invalid type, please provide a valid string",
      "any.required": "name is required",
      "string.empty": "name cannot be emoty",
    }),
    username: Joi.string().required().messages({
      "string.base": "invalid type, please provide a valid string",
      "any.required": "name is required",
      "string.empty": "name cannot be emoty",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "password must not be less than 6 characters",
      "any.required": "password is required",
      "string.empty": "password cannot be empty",
    }),
  });
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    res.status(422).json({
      message: "validation error",
      success: false,
      error: error.details ? error.details[0].message : error.message,
    });
    return;
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
