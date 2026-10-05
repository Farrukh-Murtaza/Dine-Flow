const router = require('express').Router();
const userController = require("../controllers/user-controller");
const { ownerOrManager } = require('../middlewares/authorize');

router.get("/",ownerOrManager ,userController.getAllUsers);
router.post("/",ownerOrManager ,userController.createStaffUser);
router.put("/reset-password",userController.resetPassword);
router.put("/:id/status",ownerOrManager ,userController.toggleStatus);
 
module.exports = router;``