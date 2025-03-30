const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const verifyReference = require("../utils/verifyReference");
const APIError = require("../utils/errors/APIError");

const userSchemaDb = new mongoose.Schema(
  {
    firstName: {
      type: String,
      reguired: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Already Exist, Please Login"],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin"],
    },
    address: {
      country: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      street: {
        type: String,
        trim: true,
      },
    },
    phone: {
      type: String,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        "Please enter a valid phone",
      ],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      default: null,
    },
    googleId: { type: String },
  },
  { timestamps: true }
);

userSchemaDb.pre(["save", "findOneAndUpdate"], async function (next) {
  try {
    /**
     * since we are listening for "save" and "findOneAndUpdate", "this" can be a document or a query
     * a query won't have the this.IsModified method so we work around by having an variable that holds the document
     * and if it happens to be a query we change it to get the update data
     */
    let update = this;

    if (this instanceof mongoose.Query) {
      update = this.getUpdate();
      if (!update) return next();
    }

    if (update.email) {
      update.email = update.email.toLowerCase();
    }

    if (update.password) {
      if (update.password !== "google-auth") {
        let hashedPassword = await bcrypt.hash(update.password, 10);
        update.password = hashedPassword;
      }
    }

    if (update.image) {
      if (!update.image) return;
      const Image = mongoose.model("Image");
      if (!(await verifyReference(update.image, "Image")))
        throw new APIError(
          `User profile image id is invalid please verify that the image id is correct`,
          400
        );

      await Image.findByIdAndUpdate(update.image, {
        reference: {
          model: "User",
          documentId: update._id,
          field: "image",
        },
      });
    }

    if (this instanceof mongoose.Query) {
      this.setUpdate(update);
    }

    next();
  } catch (err) {
    next(err);
  }
});

userSchemaDb.pre("findOneAndUpdate", async function (next) {
  try {
    const updateObj = this.getUpdate();
    const filter = this.getQuery();
    const user = await this.model.findOne(filter).lean();

    if (!updateObj.image) return next();

    const Image = mongoose.model("Image");

    if (!(await verifyReference(updateObj.image, "Image")))
      throw new APIError(
        `User profile image id is invalid please verify that the image id is correct`,
        400
      );

    if (user.image === updateObj.image) {
      return next();
    } else {
      await Image.findByIdAndDelete(user.image);

      await Image.findByIdAndUpdate(updateObj.image, {
        reference: {
          model: "User",
          documentId: user._id,
          field: "image",
        },
      });
    }
  } catch (err) {
    next(err);
  }
});

userSchemaDb.pre("findOneAndDelete", async function (next) {
  try {
    const filter = this.getQuery();
    const user = await this.model.findOne(filter);

    if (user?.image) {
      const imageDoc = user.image;
      // Remove the image reference before deleting so that the image is unlinked allowing it to be deleted
      user.image = null;
      await user.save();

      console.log(user);

      const Image = mongoose.model("Image");
      await Image.findByIdAndDelete(imageDoc);
    }

    return next();
  } catch (err) {
    next(err);
  }
});

userSchemaDb.pre(/^find/, function (next) {
  this.populate("image");
  next();
});

module.exports = mongoose.model("User", userSchemaDb);
