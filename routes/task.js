const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  create,
  getAll,
  getSingle,
  update,
  deleteTask,
} = require("../controllers/task");

router.route("/").get(authenticate, getAll);
router
  .route("/:taskId")
  .get(authenticate, getSingle)
  .put(authenticate, update)
  .delete(authenticate, deleteTask);
router.route("/create").post(authenticate, create);

module.exports = router;
