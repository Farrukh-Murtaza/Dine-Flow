const router = require('express').Router();
const categoryController = require("../controllers/category-controller");
const { ownerOrManager } = require('../middlewares/authorize');

router.get("/" ,categoryController.getAllCategories);
router.get("/:id" ,categoryController.getCategoryById);
router.post("/" ,ownerOrManager, categoryController.createCategory);
router.put("/:id" ,ownerOrManager, categoryController.updateCategory);
router.delete("/:id", ownerOrManager, categoryController.deleteCategory);


module.exports = router;