const { string, required, number } = require("joi");
const mongoose = require("mongoose");
const { type } = require("../utils/validation/userValidation");

const productSchemaDb = new mongoose.Schema({
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
    min: 0
  },
  mainCategory: {
    type: String,
    required: true,
    lowercase: true 
},
    subCategory: { 
    type: String, 
    required: true,
    lowercase: true 
},
  ingredients: [
    {
      type: String,
      trim: true
    },
  ],
  nutritionalValues: {
    sodium: { type: String, trim: true },
    sugar: { type: String, trim: true },
    carbohydrates: { type: String, trim: true },
  },
  reviews: [
    {
      userId: {
        type: String,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      reviewDescription: {
        type: String,
        trim: true,
      },
    },
  ],
  productOwner: {
    type: String,
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
      type: String,
      trim: true,
      required: true,
    },
  ],
  viewsCount: {
    type: Number,
    default: 0,
  },
  listDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("product", productSchemaDb);

