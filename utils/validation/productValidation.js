const joi = require("joi");

const productSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
  brand: joi.string().min(3).max(50).required(),
  quantity: joi.number().integer().min(0).required(),
  ingredients: joi.array().items(joi.string().required()).optional(),

  categories: joi.array().items(joi.string()).optional(),

  nutritionalValues: joi
    .array()
    .items(
      joi.object({
        nutrition: joi.string().required(),
        amount: joi.string().required(),
      })
    )
    .optional(),

  weight: joi.string().required(),
  description: joi.string().min(3).max(200).required(),
  tags: joi.array().items(joi.string().min(3).max(20).optional).optional(),
  price: joi.number().integer().min(0).required(),
  images: joi.array().items(joi.string()).min(1).required(),
  viewsCount: joi.number().integer().min(0).default(0),
  expiryDate: joi.date().required(),
});

module.exports = productSchema;
