const router = require('express').Router();
const wishlistController = require('../controllers/wishListController');
const protectMW = require('../middlewares/protectMW');

router.route("/")
    .get(protectMW, wishlistController.getWishlist)
    .delete(protectMW, wishlistController.clearWishlist);

router.route("/:id")
    .post(protectMW, wishlistController.addToWishlist)
    .delete(protectMW, wishlistController.removeFromWishlist);

module.exports = router;
