const router = require('express').Router();
const menuItemController = require("../controllers/menu-item-controller");
const { ownerOrManager } = require('../middlewares/authorize');

router.get("/" ,menuItemController.getAllMenuItems);
router.get("/:id" ,menuItemController.getMenuItemById);
router.post("/" ,ownerOrManager, menuItemController.createMenuItem);
router.put("/:id" ,ownerOrManager, menuItemController.updateMenuItem);
router.put("/:id/status" ,ownerOrManager, menuItemController.updateMenuItemStatus);
router.delete("/:id", ownerOrManager, menuItemController.deleteMenuItem);


module.exports = router;