const mongoose = require("mongoose");
const APIError = require("../utils/errors/APIError");
const {
  cloudinaryRemoveMultipleImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

// This model is used to represent images that are stored in cloudinary
// We store all images in a collection to keep track of their references and where they are used
const imageSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // This is a reference to the document that uses this image
  reference: {
    model: { type: String },
    field: { type: String },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reference.model",
    },
  },
});

// If a document already uses the image, don't use it twice
imageSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const filter = this.getQuery();
    const existingImage = await this.model.findOne(filter);

    if (
      existingImage.reference.documentId &&
      existingImage?.reference?.documentId.equals(
        this.getUpdate().reference.documentId
      )
    )
      next();

    if (existingImage?.reference?.documentId) {
      return next(new APIError("Image is already assigned", 400));
    }

    next();
  } catch (err) {
    next(err);
  }
});

imageSchema.pre("findOneAndDelete", async function (next) {
  const filter = this.getFilter();
  const imageDoc = await this.model.findById(filter._id).lean();

  if (imageDoc.reference.documentId) {
    const refModel = mongoose.model(imageDoc.reference.model);
    const refDoc = await refModel
      .findById(imageDoc.reference.documentId)
      .lean();

    if (refDoc) {
      const fieldData = refDoc[imageDoc.reference.field];

      // Case 1: Direct reference (non-array)
      if (!Array.isArray(fieldData)) {
        console.log(imageDoc._id.toString());

        if (fieldData === imageDoc._id.toString()) {
          throw new APIError(
            `Cannot delete image. ${imageDoc.reference.model} requires this image.`,
            400
          );
        } else {
          await cloudinaryRemoveImage(imageDoc.publicId);
          return next();
        }
      }

      // Case 2: Array with <= 1 elements
      if (Array.isArray(fieldData) && fieldData.length <= 1) {
        throw new APIError(
          `Cannot delete image. ${imageDoc.reference.model} requires at least one image.`,
          400
        );
      }

      // Case 3: Remove the image from the array
      await refModel.updateOne(
        { _id: refDoc._id },
        { $pull: { [imageDoc.reference.field]: imageDoc._id } }
      );
    }
  }

  // Delete from Cloudinary using the document's publicId
  await cloudinaryRemoveImage(imageDoc.publicId);

  next();
});

module.exports = mongoose.model("Image", imageSchema);
