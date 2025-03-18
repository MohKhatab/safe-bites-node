const Cart = require('../models/Cart');
const Product = require('../models/Product');
const APIError = require('../utils/errors/APIError');

const getCart = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const cart = await Cart.findOne({userId}).populate({
            path: 'products.productId',
            select: 'name price images' 
        });

        if(!cart || cart.products.length == 0){
            throw new APIError("Cart is empty !", 200);
        }

        res.status(200).send({message: "Cart recieved successfully", data: cart.products});

    }catch(err){
        next(err);
    }
}

const addToCart = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const productId = req.params.id;
        const quantity = Number(req.body.quantity) || 1;

        const product = await Product.findById(productId);
        if (!product) {
            throw new APIError("Product not found", 404)
        };

        let cart = await Cart.findOne({userId});
        if(!cart){
            cart = new Cart ({
                userId,
                products: [{productId, quantity}]
            });
        } else{
            const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if(itemIndex > -1){
                cart.products[itemIndex].quantity += quantity;
            }
            else{
                cart.products.push({productId, quantity: quantity > 0 ? quantity : 1})
            }
        }
        await cart.save();
        const populatedCart = await cart.populate({
            path: 'products.productId',
            select: 'name price images'
        });
        res.status(200).json({ message: "Item added to cart", populatedCart });
    }catch(err){
        next(err)
    }
}

const updateCart = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const productId = req.params.id;
        let quantity = Number(req.body.quantity);

        let cart = await Cart.findOne({userId});
        if(!cart){
            throw new APIError("Cart not found", 404);
        }

        const indexItem = cart.products.findIndex(item => item.productId.toString() == productId);
        if(indexItem > -1) {
            if(quantity > 0){
                cart.products[indexItem].quantity = quantity;
            }else{
                cart.products.splice(indexItem, 1);
            }
        }else{
            throw new APIError("Product not found in the cart", 404)
        }

        await cart.save();
        res.status(200).send({message: "Cart updated successfully", data: cart});
    }catch(err){
        next(err)
    }
}

const removeFromCart = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const productId = req.params.id;

        const cart = await Cart.findOne({userId});
        if(!cart){
            throw new APIError("Cart not found", 404);
        }
        cart.products = cart.products.filter(item => 
            item.productId && item.productId.toString() !== productId
        );
        
        if (cart.products.length > 0) {
            await cart.save();
            return res.status(200).send({ message: "Product removed from cart", cart });
        } else {
            await Cart.deleteOne({ userId });
            return res.status(200).send({ message: "Cart is now empty and deleted" });
        }
    }catch (err){
        next(err);
    }
}

const clearCart = async (req, res, next) =>{
    try{
        const userId = req.user.id;

        const cart = await Cart.findOne({userId});
        if(!cart){
            throw new APIError("Cart not found", 404);
        }

        cart.products = [];
        await cart.save();
        res.status(200).send({message: "Cart cleared successfully"});
    }catch (err) {
        next(err);
    }
}

module.exports = {getCart, addToCart, updateCart, removeFromCart, clearCart};

/* 
    const addToCart = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const productId = req.params.id;
        const quantity = Number(req.body.quantity) || 1;

        const product = await Product.findById(productId);
        if (!product) {
            throw new APIError("Product not found", 404)
        };

        let cart = await Cart.findOne({userId});
        if(!cart){
            cart = new Cart ({
                userId,
                products: [{productId, name: product.name, image: product.image, price: product.price, quantity}]
            });
        } else{
            const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if(itemIndex > -1){
                cart.products[itemIndex].quantity += quantity;
            }
            else{
                cart.products.push({productId, name: product.name, image: product.image, price: product.price, quantity: quantity > 0 ? quantity : 1})
            }
        }
        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    }catch(err){
        next(err)
    }
}

*/