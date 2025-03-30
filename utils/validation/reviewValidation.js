const joi = require("joi");

const createReviewSchema = joi.object({
  reviewTitle: joi.string().required(),
  reviewDescription: joi.string().required(),
  rating: joi.number().min(1).max(5).required(),
});

const updateReviewSchema = joi.object({
  reviewTitle: joi.string().optional(),
  reviewDescription: joi.string().min(5).optional(),
  rating: joi.number().min(1).max(5).optional(),
});

module.exports = { createReviewSchema, updateReviewSchema };
