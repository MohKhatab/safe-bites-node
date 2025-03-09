const router = require("express").Router();
const validationMW = require("./../middlewares/validateMW");
const protectMW = require("./../middlewares/protectMW");
const roleMW = require("./../middlewares/roleMW");
const categoriesController = require("./../controllers/categoriesController");
const categorySchema = require("./../utils/validation/categoryValidation");

router
  .route("/")
  .post(validationMW(categorySchema), categoriesController.createCategory)
  .get(categoriesController.getCateogries);

router.route("/:id").delete(categoriesController.deleteCategory);

module.exports = router;
