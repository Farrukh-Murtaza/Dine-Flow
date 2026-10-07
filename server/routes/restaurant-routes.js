const router = require('express').Router();
const restaurantController = require("../controllers/restaurant-controller");
const { ownerOnly } = require('../middlewares/authorize');

router.get("/", ownerOnly ,restaurantController.getRestaurant);
router.put("/", ownerOnly ,restaurantController.updateRestaurant);


module.exports = router;