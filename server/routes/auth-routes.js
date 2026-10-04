const router = require('express').Router();
const authController = require("../controllers/auth-controller");
const verifyAuthentication = require('../middlewares/verify-authentication');




router.post("/login" ,authController.login );
router.get("/me" ,verifyAuthentication, authController.me );

module.exports = router;