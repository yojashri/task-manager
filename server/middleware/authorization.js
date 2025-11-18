const Task = require("../models/Task");
const User = require("../models/User");

// Only task owner can update/delete
exports.isTaskOwner = async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  if (task.userId.toString() !== userId.toString()) {
    return res.status(403).json({ success: false, message: "Not allowed — you do not own this task" });
  }

  next();
};

// Allow Teacher to VIEW assigned students' tasks
exports.teacherCanViewTask = async (teacherId, taskOwnerId) => {
  const student = await User.findOne({
    _id: taskOwnerId,
    teacherId: teacherId,
  });

  return !!student;
};
