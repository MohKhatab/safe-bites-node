const Product = require("./../models/Product");
const APIError = require("./../utils/errors/APIError");
const {
  cloudinary,
  cloudinaryRemoveMultipleImage,
} = require("../utils/cloudinary");

//getProductById
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select("-reviews");

    if (!product) {
      throw new APIError("product not found", 404);
    }

    res
      .status(200)
      .send({ message: "product fetched successfully", data: product });
  } catch (err) {
    next(err);
  }
};

//addProduct
const addProduct = async (req, res, next) => {
  try {
    req.body.productOwner = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).send({ message: "added successfully ", data: product });
  } catch (err) {
    next(err);
  }
};

// updateProduct
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new APIError("product not founded", 404);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .send({ message: "updated successfully", data: updatedProduct });
  } catch (err) {
    next(err);
  }
};

//deleteProduct
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new APIError("product not founded", 404);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "deleted successfully" });
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
      .populate([
        {
          path: "categories",
          select: "name _id",
        },
      ])
      .lean();

      const total = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Fetched products successfully",
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

module.exports = {
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  filteredProduct,
};
