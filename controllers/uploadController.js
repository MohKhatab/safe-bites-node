const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
} = require("../utils/cloudinary");
const APIError = require("./../utils/errors/APIError");
const Image = require("./../models/Image");

const uploadImage = async (req, res, next) => {
  try {
    const result = await cloudinaryUploadImage(
      req.file.path,
      req.params.folder
    );

    const imageDoc = await Image.create({
      publicId: result.public_id,
      imageUrl: result.secure_url,
    });

    res.status(201).send({
      message: "Successfully uploaded image",
      data: imageDoc,
    });
  } catch (err) {
    next(err);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    await Image.findByIdAndDelete(req.params.id);

    // if (result.result === "not found") {
    //   throw new APIError("Not Found: Image does not exist", 404);
    // }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage, deleteImage };
