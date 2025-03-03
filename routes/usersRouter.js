const router = require("express").Router();
const usersController = require("./../controllers/usersController");
const validationMW = require("./../middlewares/validateMW");
const userSchema = require("./../utils/validation/userValidation");

router
  .route("/")
  .get(usersController.getUser)
  .post(validationMW(userSchema), usersController.createUser);

router.route("/:id").get(usersController.getUserById);

module.exports = router;
