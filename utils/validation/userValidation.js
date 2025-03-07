const joi = require("joi");

const signUpSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().optional(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  phone: joi
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
    .optional(),
  address: joi
    .object({
      country: joi.string(),
      city: joi.string(),
      street: joi.string(),
    })
    .optional(),
  role: joi.string().default("user")
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
})

module.exports = {signUpSchema, signInSchema};
