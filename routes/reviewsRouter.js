const router = require("express").Router();
const protectMW = require("./../middlewares/protectMW");
const reviewSchema = require("./../utils/validation/reviewValidation");
const reviewsController = require("./../controllers/reviewsController");
const validationMW = require("../middlewares/validateMW");

router
  .route("/")
  .post(
    protectMW,
    validationMW(reviewSchema.createReviewSchema),
    reviewsController.createProductReview
  );

router
  .route("/:id")
  .delete(protectMW, reviewsController.deleteProductReview)
  .put(
    protectMW,
    validationMW(reviewSchema.updateReviewSchema),
    reviewsController.updateProductReview
  );

router.route("/").get(reviewsController.getProductReviews);

module.exports = router;
