const router = require("express").Router();
const multerMW = require("../middlewares/multerMW");
const uploadController = require("../controllers/uploadController");
const validationMW = require("../middlewares/validateMW");

router.post("/:folder", multerMW.single("image"), uploadController.uploadImage);
router.delete("/:id", uploadController.deleteImage);

module.exports = router;
