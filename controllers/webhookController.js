const Stripe = require('stripe');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout Session Completed:', session.id);

            if (session.payment_status === 'paid') {
                try {
                    const userId = session.metadata.userId;
                    const cartId = session.metadata.cartId;

                    const shippingAddress = JSON.parse(session.metadata.shippingAddress);

                    const cart = await Cart.findById(cartId).populate('products.productId');

                    if (!cart) {
                        console.error(`Cart not found for cartId: ${cartId}, user: ${userId}`);
                        return res.status(404).send('Cart not found for order creation');
                    }

                    const productsForOrder = cart.products.map(item => ({
                        productId: item.productId._id,
                        name: item.productId.name,
                        quantity: item.quantity,
                        price: item.productId.price,
                    }));

                    const totalPrice = session.amount_total / 100;

                    const order = new Order({
                        userId: userId,
                        products: productsForOrder,
                        shippingAddress: shippingAddress,
                        totalPrice: totalPrice,
                        paymentMethod: 'card',
                        status: 'Pending',
                    });

                    await order.save();
                    console.log('Order created successfully:', order._id);

                    await Cart.findByIdAndDelete(cartId);
                    console.log('Cart cleared successfully for user:', userId);

                } catch (error) {
                    console.error('Error processing checkout.session.completed webhook:', error);
                    return res.status(500).send('Error processing order');
                }
            } else {
                console.log('Checkout session not paid:', session.id);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
};

module.exports = { stripeWebhook };