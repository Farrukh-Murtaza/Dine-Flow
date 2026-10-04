const router = require('express').Router();
const appSetupController = require("../controllers/app-setup-controller");

router.post("/" ,appSetupController);

module.exports = router;