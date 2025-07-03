const express = require("express");
const router = express.Router();
const protectMW = require("../middlewares/protectMW");
const checkoutController = require("../controllers/checkoutController");

router.post("/stripe", protectMW, checkoutController.stripeCheckout);

module.exports = router;