const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const protectMW = require("../middlewares/protectMW");

router.post("/", protectMW, orderController.createOrder);
router.get("/my-orders", protectMW, orderController.getUserOrders);
router.get("/:orderId", protectMW, orderController.getOrderById);

module.exports = router;
// router.put("/:orderId/products", protectMW, orderController.updateOrder);