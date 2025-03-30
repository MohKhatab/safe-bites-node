const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
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
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
