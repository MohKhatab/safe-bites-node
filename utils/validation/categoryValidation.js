const joi = require("joi");

const categorySchema = joi.object({
  name: joi.string().required(),
  type: joi.string().optional(),
});

module.exports = categorySchema;
