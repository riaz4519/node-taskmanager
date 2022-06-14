const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");

const { register, login, getMe } = require("../controllers/user");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(authenticate, getMe);
module.exports = router;
