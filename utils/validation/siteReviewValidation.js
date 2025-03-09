const joi = require("joi");

const siteReviewSchema = joi.object({
  title: joi.string().required().max(100).trim(),
  description: joi.string().required().trim(),
  rating: joi.number().min(0).max(5).required(),
});

module.exports = siteReviewSchema;
