const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },/*
                name: {
                    type: String,
                    required: true,
                    trim: true
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                },
                image: {
                    type: String,
                    // required: true
                },*/
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                }
            }
        ],
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active'
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema);