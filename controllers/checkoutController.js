const Stripe = require('stripe');
const Cart = require('../models/Cart');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const stripeCheckout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is missing in the request body.' });
        }

        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const line_items = cart.products.map((item) => {
            const product = item.productId;
            if (!product || !product.price || !product.name) {
                throw new Error(`Product data missing for item: ${item.productId}`);
            }
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: 'http://localhost:4203/',
            cancel_url: 'http://localhost:4203/payment-cancel',
            metadata: {
                userId: userId.toString(),
                cartId: cart._id.toString(),
                shippingAddress: JSON.stringify(shippingAddress),
            },
            customer_email: userEmail,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error("Error creating Stripe checkout session:", err);
        res.status(500).json({ message: 'Failed to create Stripe checkout session', error: err.message });
    }
};

module.exports = { stripeCheckout };