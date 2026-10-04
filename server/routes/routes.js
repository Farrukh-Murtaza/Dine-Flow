const router = require('express').Router();
// const verifyAuthentication = require('../middlewares/verify-authentication');
const appSetupRouter = require("./app-setup");
const authRoutes = require("./auth-routes");
  
// route without any authentication
router.use("/app-setup", appSetupRouter);
router.use("/auth", authRoutes);

// PROTECT ALL SUBSEQUENT ROUTES
// router.use(verifyAuthentication);

module.exports = router;