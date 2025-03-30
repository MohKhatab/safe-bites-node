const Wishlist = require("../models/wishList");
const Product = require("../models/Product");
const APIError = require("../utils/errors/APIError");

// Get Wishlist Items
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "products.productId",
      select: "name price images",
    });

    if (!wishlist || wishlist.products.length === 0) {
      throw new APIError("Wishlist is empty!", 200);
    }

    res
      .status(200)
      .send({
        message: "Wishlist retrieved successfully",
        data: wishlist.products,
      });
  } catch (err) {
    next(err);
  }
};

// Add Product to Wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      throw new APIError("Product not found", 404);
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [{ productId }],
      });
    } else {
      const exists = wishlist.products.some(
        (item) => item.productId.toString() === productId
      );
      if (!exists) {
        wishlist.products.push({ productId });
      } else {
        throw new APIError("Product already in wishlist", 400);
      }
    }
    await wishlist.save();

    res.status(200).json({ message: "Item added to wishlist", wishlist });
  } catch (err) {
    next(err);
  }
};

// Remove Product from Wishlist
const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      throw new APIError("Wishlist not found", 404);
    }

    const oldWishlistLength = wishlist.products.length;
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    if ((oldWishlistLength = wishlist.products.length)) {
      return new APIError("Product not found in wishlist", 404);
    }
    await wishlist.save();

    res
      .status(200)
      .send({ message: "Product removed from wishlist", wishlist });
  } catch (err) {
    next(err);
  }
};

// Clear Wishlist
const clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Wishlist.deleteOne({ userId });

    res.status(200).send({ message: "Wishlist cleared successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
