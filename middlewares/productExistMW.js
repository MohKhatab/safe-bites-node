const APIError = require("./../utils/errors/APIError");
const Product = require("./../models/Product");

// This middleware is used to check if the product id in the params exists or not
// This is mainly used for product reviews and nothing else
async function productExistMW(req, res, next) {
  try {
    console.log(req.params);

    const product = await Product.findById(req.params.id);
    if (!product) throw new APIError("Not Found: Product does not exist", 404);
    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = productExistMW;
