const { required } = require('joi');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        products: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                name: String,
                quantity: Number,
                price: Number
            },
        ],
        shippingAddress: {
            city: String,
            street: String,
            phone: String
        },
        totalPrice: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card"],
            default: "cash"
        },
        status: {
            type: String,
            enum: ["Pending", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);