const { string, required, number } = require("joi");
const mongoose = require("mongoose");
const { type } = require("../utils/validation/userValidation");
const Image = require("./Image");
const verifyReference = require("../utils/verifyReference");
const APIError = require("../utils/errors/APIError");

const productSchemaDb = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    nutritionalValues: [
      {
        nutrition: { type: String, trim: true },
        amount: { type: String, trim: true },
      },
    ],
    reviews: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          // required: true,
        },
        reviewTitle: {
          type: String,
          trim: true,
        },
        reviewDescription: {
          type: String,
          trim: true,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    productOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    brief: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        // required: true,
      },
    ],
    viewsCount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      // required: true,
    },
  },
  { timestamps: true }
);

productSchemaDb.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchemaDb);
