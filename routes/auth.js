const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const verifySignup = require("../middlewares/verifySignup");


router.post("/signup", [verifySignup.checkDuplicateEntries], AuthController.signup);
router.post("/signin", AuthController.signin);
module.exports = router;