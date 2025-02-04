import { Request, Response, NextFunction } from "express";
import Joi, { any } from "joi";

export const validateProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "name cannot be empty",
      "any.required": "name is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "description cannot be empty",
      "any.required": "description is required",
      "string.base": "invalid type,please provide a valid string",
    }),
    price: Joi.string().required().messages({
      "string.empty": "price cannot be empty",
      "any.required": "price is required",
      "number.base": "invalid type,please provide a valid number",
    }),
    stockQuantity: Joi.number().required().messages({
      "string.empty": "stock quality cannot be empty",
      "any.required": "stock quality is required",
    }),

    category: Joi.string().required().messages({
      "string.empty": "category cannot be empty",
      "any.required": "stock quality is required",
      "string.base": "invalid type,please provide a valid string",
    }),
    image: Joi.string(),
    availability: Joi.string().required().messages({
      "string.empty": "field cannot be empty",
      "any.required": "availability is required",
      "string.base": "invalid type, please provide a valid string",
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
