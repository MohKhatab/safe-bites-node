const router=require("express").Router();
const { Router } = require("express");
const productController=require("./../controllers/productsController");
const validationMW=require("./../middlewares/validateMW");
const productSchema=require("./../utils/validation/productValidation");


router.get("/",productController.getAllProducts);
router.get("/:id",productController.getProductById);
router.post("/",validationMW(productSchema),productController.addProduct);
router.put("/id", validationMW(productSchema), productController.updateProduct);
router.delete("/:id",productController.deleteProduct)
router.get("/",productController.filteredProduct)    


module.exports=router;