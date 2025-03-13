const APIError = require("./errors/APIError");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUploadImage = async (fileToUpload, folderName) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      folder: folderName || "general",
      resource_type: "auto",
      format: "webp",
    });
    return data;
  } catch (error) {
    throw new Error("Internal Server Error (cloudinary)");
  }
};

const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};

const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);

    return result;
  } catch (error) {
    throw new Error("Internal Server Error (cloudinary)");
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
  cloudinary,
};
