const router = require('express').Router();
const appSetupRouter = require("./app-setup");
const authRoutes = require("./auth-routes");


router.use("/app-setup", appSetupRouter);
router.use("/auth", authRoutes);

module.exports = router;