const Order = require("../models/Order");
const APIError = require("../utils/errors/APIError");

const createOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { products, shippingAddress, totalPrice, paymentMethod } = req.body;

        if (!products || products.length === 0) {
            throw new APIError("No products provided", 400);
        }
        if (!shippingAddress) {
            throw new APIError("Shipping address required", 400);
        }
        if (!totalPrice) {
            throw new APIError("Total price required", 400);
        }

        const order = new Order({
            userId,
            products,
            shippingAddress,
            totalPrice,
            paymentMethod: paymentMethod || "cash",
        });

        await order.save();

        res.status(201).json({
            message: "Order created successfully",
            data: order,
        });
    } catch (err) {
        next(err);
    }
};

const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        if (!orders) {
            throw new APIError("Orders not found", 404);
        }
        return res
            .status(200)
            .send({
                message: "Orders fetched successfully !",
                data: orders
            })
    } catch (err) {
        next(err);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            throw new APIError("Order not found", 404);
        }
        return res
            .status(200)
            .send({
                message: "Order fetched successfully !",
                data: order
            })
    } catch (err) {
        next(err);
    }
};

module.exports = { createOrder, getUserOrders, getOrderById };

/*
const updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { products } = req.body;

        const order = await Order.findOne({ _id: orderId, userId: req.user._id });
        if (!order) {
            throw new APIError("Order not found", 404);
        }

        if (order.status !== "Pending") {
            throw new APIError("Cannot edit order after shipping");
        }

        order.products = products;

        order.totalPrice = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await order.save();

        return res
            .status(200)
            .send({
                message: "Order updated successfully !",
                data: order
            })
    } catch (err) {
        next(err)
    }
};
*/

