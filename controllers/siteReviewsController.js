const SiteReview = require("./../models/SiteReview");
const APIError = require("./../utils/errors/APIError");

const createSiteReview = async (req, res, next) => {
  try {
    req.body.poster = req.user.id;
    const siteReview = await SiteReview.create(req.body);
    res
      .status(200)
      .json({ message: "Review created successfully!", data: siteReview });
  } catch (error) {
    next(error);
  }
};

const getSiteReviews = async (req, res, next) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      query.poster = userId;
    }

    const siteReviews = await SiteReview.find(query).populate({
      path: "poster",
      select: "firstName lastName _id",
    });

    if (siteReviews.length === 0) {
      return res
        .status(200)
        .json({ message: "No site reviews found.", data: [] });
    }

    res.status(200).json({
      message: "Fetched site reviews successfully!",
      data: siteReviews,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSiteReview = async (req, res, next) => {
  try {
    const siteReview = await SiteReview.findById(req.params.id);

    if (!siteReview) {
      throw new APIError(
        `Not Found: site review with id ${req.params.id} does not exist`,
        404
      );
    }

    if (
      req.user.id != siteReview.poster.toString() &&
      req.user.role != "admin"
    ) {
      throw new APIError(
        `Forbidden: cannot delete site review posted by different user`,
        403
      );
    }

    await siteReview.deleteOne();

    res.status(200).json({
      message: `Successfully deleted site review with id ${req.params.id}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSiteReview, getSiteReviews, deleteSiteReview };
