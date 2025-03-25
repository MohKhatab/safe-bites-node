const router = require("express").Router();
const productController = require("./../controllers/productsController");
const validationMW = require("./../middlewares/validateMW");
const productSchema = require("./../utils/validation/productValidation");
const protectMW = require("./../middlewares/protectMW");
const roleMW = require("./../middlewares/roleMW");

// router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.post(
  "/",
  protectMW,
  // roleMW("admin"),
  validationMW(productSchema),
  productController.addProduct
);

router.put(
  "/id",
  protectMW,
  roleMW("admin"),
  validationMW(productSchema),
  productController.updateProduct
);

router.delete(
  "/:id",
  protectMW,
  roleMW("admin"),
  productController.deleteProduct
);

router.get("/", productController.filteredProduct);

module.exports = router;
