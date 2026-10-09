const router = require('express').Router();
const verifyAuthentication = require('../middlewares/verify-authentication');
const appSetupRouter = require("./app-setup");
const authRoutes = require("./auth-routes");
const userRoutes = require("./user-routes");
const categoryRoutes = require("./category-routes");
const menuItemRoutes = require("./menu-item-routes");
const restaurantRoutes = require("./restaurant-routes");
const orderRoutes =  require("./order-routes");
  
// route without any authentication
router.use("/app-setup", appSetupRouter);
router.use("/auth", authRoutes);

// PROTECT ALL SUBSEQUENT ROUTES
router.use(verifyAuthentication);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/menu-items", menuItemRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/orders",orderRoutes);


module.exports = router;