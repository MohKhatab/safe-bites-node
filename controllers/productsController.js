const Product = require("./../models/Product");
const Image = require("./../models/Image");
const APIError = require("./../utils/errors/APIError");
const {
  cloudinary,
  cloudinaryRemoveMultipleImage,
} = require("../utils/cloudinary");

//getProductById
// getProductById
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("-reviews")
      .lean();

    if (!product) {
      throw new APIError("Product not found", 404);
    }

    if (product.images && product.images.length > 0) {
      const imageIds = product.images.filter(
        (img) =>
          typeof img === "object" &&
          img !== null &&
          img.toString().match(/^[a-f\d]{24}$/i)
      );

      const populatedImages = await Image.find({
        _id: { $in: imageIds },
      }).lean();

      product.images = product.images.map((img) => {
        if (typeof img === "string") {
          return { imageUrl: img };
        }

        const foundImage = populatedImages.find(
          (imgDoc) => imgDoc._id.toString() === img.toString()
        );

        return foundImage || img;
      });
    }

    res
      .status(200)
      .send({ message: "Product fetched successfully", data: product });
  } catch (err) {
    next(err);
  }
};

const filteredProduct = async (req, res, next) => {
  try {
    const {
      search,
      sortBy,
      order,
      inStock,
      outOfStock,
      minPrice,
      maxPrice,
      categories,
    } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Available
    if (inStock === "true" && outOfStock === "true") {
      // Skip, no filter for stock
    } else if (inStock === "true") {
      // if only in stock is true
      filter.quantity = { $gt: 0 };
    } else if (outOfStock === "true") {
      // if only out of stock is true
      filter.quantity = { $eq: 0 };
    }

    //price
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    //category
    if (categories) {
      const categoryArray = categories.split(",");
      filter.categories = { $in: categoryArray };
    }

    //sorting
    let sortCreteria = {};
    if (sortBy) {
      const lowerOrder = order.toLowerCase();
      if (lowerOrder === "desc" || lowerOrder === "asc") {
        sortCreteria[sortBy] = lowerOrder === "desc" ? -1 : 1;
      }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .select("-reviews")
      .sort(sortCreteria)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "categories",
        select: "name _id",
      })
      .lean();

    const populatedProducts = await Promise.all(
      products.map(async (product) => {
        if (product.images?.length > 0) {
          const imageIds = product.images.filter(
            (img) =>
              typeof img === "object" &&
              img !== null &&
              img.toString().match(/^[a-f\d]{24}$/i)
          );

          const populatedImages = await Image.find({
            _id: { $in: imageIds },
          }).lean();

          product.images = product.images.map((img) => {
            if (typeof img === "string") return { imageUrl: img };

            const found = populatedImages.find(
              (imgDoc) => imgDoc._id.toString() === img.toString()
            );
            return found || img; // fallback to ObjectId if not found
          });
        }

        return product;
      })
    );

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Fetched products successfully",
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: populatedProducts,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

module.exports = {
  getProductById,
  // addProduct,
  // updateProduct,
  // deleteProduct,
  filteredProduct,
};
