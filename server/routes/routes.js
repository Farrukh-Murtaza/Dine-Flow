const router = require('express').Router();
const appSetupRouter = require("./app-setup");


router.use("/app-setup", appSetupRouter);

module.exports = router;