const router = require("express").Router();
const usersController = require("./../controllers/usersController");
const validationMW = require("./../middlewares/validateMW");
const userSchema = require("./../utils/validation/userValidation");
const protectMW = require("../middlewares/protectMW");
const roleMW = require("../middlewares/roleMW");

router
  .route("/")
  .get(protectMW,usersController.getUser)
  .post(validationMW(userSchema.signUpSchema), usersController.createUser);

router.route("/:id").get(protectMW,roleMW("admin"),usersController.getUserById);

router.route("/login").post(validationMW(userSchema.signInSchema),usersController.loginUser)

module.exports = router;
