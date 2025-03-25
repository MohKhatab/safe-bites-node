const joi = require("joi");

const productSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
  brand: joi.string().min(3).max(50).required(),
  quantity: joi.number().integer().min(0).required(),
  ingredients: joi.array().items(joi.string().required()).optional(),

  categories: joi.array().items(joi.string()).optional(),

  nutritionalValues: joi
    .array()
    .items(
      joi.object({
        nutrition: joi.string().required(),
        amount: joi.string().required(),
      })
    )
    .optional(),

  reviews: joi.array().items(
    joi.object({
      userId: joi.string().optional(),
      rating: joi.number().integer().min(1).max(5).optional(),
      reviewDescription: joi.string().min(1).max(500).optional(),
    })
  ),
  productOwner: joi.string().optional(),
  weight: joi.string().required(),
  description: joi.string().min(3).max(200).required(),
  tags: joi.array().items(joi.string().min(3).max(20).optional).optional(),
  price: joi.number().integer().min(0).required(),
  // images: joi.array().items(joi.string().uri()).min(1),
  // // .required(),
  viewsCount: joi.number().integer().min(0).default(0),
  expiryDate: joi.date().required(),
});

module.exports = productSchema;

//  {
//       "_id": "3001",
//       "name": "Low-Carb Almond Flour Bread",
//       "brand": "ObjectId of brand",
//       "quantity": 50,
//       "category": ["400"],
//       "ingredients": ["Almond Flour", "Eggs", "Olive Oil", "Baking Powder"],
//       "nutritionalValues": {
//         "sodium": "120mg",
//         "sugar": "1g",
//         "carbohydrates": "3g"
//       },
//       "reviews": [
//         {
//           "userId": "ObjectId",
//           "rating": 5,
//           "reviewDescription": "Tastes amazing and perfect for keto diets!"
//         }
//       ],
//       "productOwner": "userObjectId",
//       "weight": "500g",
//       "description": "A soft and fluffy almond flour bread with only 3g net carbs.",
//       "tags": ["low-carb", "keto", "gluten-free"],
//       "price": "7.99",
//       "images": ["https://example.com/low-carb-bread.jpg"],
//       "viewsCount": 2800,
//       "listDate": "02/15/2025",
//       "expiryDate": "06/30/2025"
//     },
