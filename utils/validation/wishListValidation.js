const wishlistSchema = joi.object({
    productId: joi.string().required(), 
 });
 
 module.exports = wishlistSchema;
 