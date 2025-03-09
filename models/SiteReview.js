const { required } = require("joi");
const mongoose = require("mongoose");

const siteReviewSchemaDb = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    poster: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: "true",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteReview", siteReviewSchemaDb);
