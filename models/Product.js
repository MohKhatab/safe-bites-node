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

// This is used to update the image document that we are referencing
productSchemaDb.pre("save", async function (next) {
  try {
    // Get the Image model from mongoose
    const Image = mongoose.model("Image");

    if (this.images.length < 2) {
      throw new APIError(
        `Product must have at least 2 images to be created`,
        400
      );
    }

    const imageIds = this.images.map((image) => image._id);

    if (!(await verifyReference(imageIds, "Image")))
      throw new APIError(
        `Some product image ids are invalid please verify that all ids are correct`,
        400
      );

    if (!(await verifyReference(this.categories, "Category")))
      throw new APIError(
        `Some category ids are invalid please verify that all ids are correct`,
        400
      );

    // Use promise API to attempt to update every single image reference given to the product
    await Promise.all(
      // Loop through each image given to the product and update the object to include the reference information
      this.images.map(async (image) => {
        await Image.findByIdAndUpdate(image, {
          reference: {
            model: "Product",
            documentId: this._id,
            field: "images",
          },
        });
      })
    );

    next();
  } catch (err) {
    next(err);
  }
});

productSchemaDb.pre("findOneAndUpdate", async function (next) {
  const updateObj = this.getUpdate;
  console.log("update fired");
  console.log(updateObj);
});

// TODO:
// productSchemaDb.pre("findOneAndUpdate", async function (next) {
//   try {
//     const Image = mongoose.model("Image");
//     // Filter to select the updated product
//     const filter = this.getQuery();
//     // The update object
//     const update = this.getUpdate();

//     // If images aren't being updated ignore this middleware
//     if (!update.images) {
//       return next();
//     }

//     // Get the product being updated
//     const product = await this.model.findOne(filter).lean();

//     // Declare both the new and old images
//     const oldImages = existingProduct.images || [];
//     const newImages = update.images || [];

//     // Get the images that are being removed and the images that will be added
//     const removedImages = oldImages.filter((img) => !newImages.includes(img));
//     const addedImages = newImages.filter((img) => !oldImages.includes(img));

//     // TODO: Remove the images that are no longer being used for this product
//     // TODO: Add references for newly added images
//   } catch (err) {
//     next(err);
//   }
// });

// Before deleting a product we have to delete that product's images
productSchemaDb.pre("findOneAndDelete", async function (next) {
  try {
    const filter = this.getQuery();
    const product = await this.model.findOne(filter);

    if (product.images && product.images.length) {
      product.images.forEach(async (image) => {
        await Image.findByIdAndDelete(image);
      });
    }

    next();
  } catch (err) {
    next(err);
  }
});

productSchemaDb.pre(/^find/, function (next) {
  this.populate({ path: "images", select: "imageUrl" });
  next();
});

productSchemaDb.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchemaDb);
