const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");
const { isTaskOwner } = require("../middleware/authorization");

// All task routes require login
router.use(auth);

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:id", isTaskOwner, taskController.updateTask);
router.delete("/:id", isTaskOwner, taskController.deleteTask);

module.exports = router;
