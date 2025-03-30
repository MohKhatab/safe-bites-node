const router = require('express').Router();
const cartsController = require('../controllers/cartsController');
const protectMW = require('../middlewares/protectMW');

router.route("/").get(protectMW, cartsController.getCart);
router.route("/:id").post(protectMW,cartsController.addToCart);
router.route("/:id").put(protectMW,cartsController.updateCart);
router.route("/:id").delete(protectMW,cartsController.removeFromCart);
router.route("/").delete(protectMW,cartsController.clearCart);


module.exports = router;