const joi = require('joi');

const cartSchema = joi.object({
   productId: joi.string().required(),
   quantity: joi.number().min(1).optional()
})

module.exports = cartSchema;