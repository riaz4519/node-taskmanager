const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { create } = require("../controllers/task");

router.route("/create").post(authenticate, create);

module.exports = router;
