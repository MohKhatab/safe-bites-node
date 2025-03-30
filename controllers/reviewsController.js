const Product = require("./../models/Product");
const APIError = require("./../utils/errors/APIError");

const createProductReview = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    req.product.reviews.push(req.body);

    // Update the rating average for the product
    req.product.averageRating =
      (req.product.averageRating * (req.product.reviews.length - 1) +
        req.body.rating) /
      req.product.reviews.length;

    await req.product.save();
    res.status(201).json({ message: "Review added", product: req.product });
  } catch (error) {
    next(error);
  }
};

const deleteProductReview = async (req, res, next) => {
  try {
    const reviewIndex = req.product.reviews.findIndex(
      (review) => review.id == req.params.id.toString()
    );

    if (reviewIndex === -1)
      throw new APIError("Not Found: review does not exist", 404);

    if (req.user.id !== req.product.reviews[reviewIndex].userId.toString())
      throw new APIError(
        "Forbidden: You cannot delete a review that was posted by another user",
        403
      );

    req.product.reviews.splice(reviewIndex, 1);
    await req.product.save();
    res.status(200).json({
      message: "Successfully deleted review",
    });
  } catch (error) {
    next(error);
  }
};

const updateProductReview = async (req, res, next) => {
  try {
    const reviewIndex = req.product.reviews.findIndex(
      (review) => review.id == req.params.id
    );

    if (reviewIndex === -1)
      throw new APIError("Not Found: review does not exist", 404);

    if (req.user.id !== req.product.reviews[reviewIndex].userId.toString())
      throw new APIError(
        "Forbidden: You cannot update a review that was posted by another user",
        403
      );

    Object.assign(req.product.reviews[reviewIndex], req.body);

    await req.product.save();

    res.status(200).json({
      message: "Successfully updated review",
      data: req.product.reviews[reviewIndex],
    });
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const productReviews = await Product.findById(req.product.id)
      .select("reviews averageRating")
      .populate({
        path: "reviews.userId",
        select: "firstName lastName -_id image",
      })
      .lean();

    res.status(200).send({
      message: "retrieved reviews successfully",
      data: {
        reviews: productReviews.reviews,
        averageRating: productReviews.averageRating,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProductReview,
  deleteProductReview,
  updateProductReview,
  getProductReviews,
};
