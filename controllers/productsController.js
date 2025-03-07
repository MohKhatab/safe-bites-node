const { date, number, array } = require("joi");
const { message, error } = require("../utils/validation/userValidation");
const product = require("./../models/Product");
const APIError = require("./../utils/errors/APIError");

//getAllProducts
const getAllProducts = async (req, res, next) => {
  try {
    const products = await product.find();
    res
      .status(200)
      .send({ message: "products fetched succesfully", data: products });
  } catch (err) {
    next(err);
  }
};
//getProductById
const getProductById = async (req, res, next) => {
  try {
    const product = await product.findById(req.params.id);
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
    const product = await product.create(req.body);
    res.status(200).send({ message: "added successfully ", data: product });
  } catch (err) {
    next(err);
  }
};

// updateProduct
const updateProduct = async (req, res, next) => {
  try {
    const product = await product.findById(req.params.id);
    if (!product) {
      throw new APIError("product not founded", 404);
    }

    const updatedProduct = await product.findByIdAndUpdate(
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
    const Product = await product.findById(req.params.id);
    if (!product) {
      throw new APIError("product not founded", 404);
    }

    await product.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "deletted successfully" });
  } catch (err) {
    next(err);
  }
};

//filter
const filteredProduct = async (req, res) => {
    try{
  const {
    sortBy,
    order,
    inStock,
    outOfStock,
    minPrice,
    maxPrice,
    categoryTypes,
    categories,
  } = req.query;
  const filter = {};
  //available
  if (inStock === "true" && outOfStock !== "true") {
    filter.quantity = { $gt: 0 };
  } else if (outOfStock === "true" && inStock !== "true") {
    filter.quantity = { $eq: 0 };
  }
  //price
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = number(minPrice);
    if (maxPrice) filter.price.$lte = number(maxPrice);
  }
  //mainCategory
  if (categoryTypes) {
    let mainCategories;
    if (Array.isArray(categoryTypes)) {
      mainCategories = categoryTypes;
    } else {
      mainCategories = categoryTypes.split(",").map((item) => item.trim());
    }
    filter.mainCategory = {
      $in: mainCategories.map((cat) => cat.toLowerCase()),
    };
  }

  //subCategory
  if (categories) {
    let subCategories;
    if (Array.isArray(categories)) {
      subCategories = categories;
    } else {
      subCategories = categories.split(",").map((item) => item.trim());
    }
    filter.category = { $in: categories.map((cat) => cat.toLowerCase()) };
  }

  //sorting
  let sortCreteria = {};
  if (sortBy) {
    const sortOrder = order && order.toLowerCase() === "des" ? -1 : 1;
    sortCreteria[sortBy] = sortOrder;
  }
  const products = await product.find(filter).sort(sortCreteria);
  res.status(200).json({products})
    }catch(err){
        res.status(500).json({message:"error feching data",error:error.message})
    }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  filteredProduct,
};
