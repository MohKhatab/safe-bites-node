const siteReviewSchema = require("./../utils/validation/siteReviewValidation");
const validateMW = require("./../middlewares/validateMW");
const protectMW = require("./../middlewares/protectMW");
const roleMW = require("./../middlewares/roleMW");
const router = require("express").Router();
const siteReviewsController = require("./../controllers/siteReviewsController");

router
  .route("/")
  .post(
    protectMW,
    validateMW(siteReviewSchema),
    siteReviewsController.createSiteReview
  )
  .get(siteReviewsController.getSiteReviews);

router.route("/:id").delete(protectMW, siteReviewsController.deleteSiteReview);

module.exports = router;
