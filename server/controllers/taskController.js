const Task = require("../models/Task");
const User = require("../models/User");
const { teacherCanViewTask } = require("../middleware/authorization");

// ============================
// GET /tasks — Role-based Access
// ============================
exports.getTasks = async (req, res, next) => {
  try {
    const { id, role, teacherId } = req.user;

    let tasks;

    if (role === "student") {
      // Students ONLY get their own tasks
      tasks = await Task.find({ userId: id });
    }

    else if (role === "teacher") {
      // Teacher can view:
      // 1. Their own tasks
      // 2. Tasks created by assigned students
      const students = await User.find({ teacherId: id });
      const studentIds = students.map(s => s._id);

      tasks = await Task.find({
        $or: [
          { userId: id },          // teacher's own tasks
          { userId: { $in: studentIds } }  // tasks of assigned students
        ]
      });
    }

    return res.json({ success: true, tasks });

  } catch (err) {
    next(err);
  }
};

// ============================
// POST /tasks — Create Task
// ============================
exports.createTask = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { title, description, dueDate } = req.body;

    // User can ONLY create tasks for THEMSELVES
    const task = await Task.create({
      userId: id,
      title,
      description,
      dueDate
    });

    return res.status(201).json({ success: true, message: "Task created", task });
  } catch (err) {
    next(err);
  }
};

// ============================
// PUT /tasks/:id — Update Task
// ============================
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, progress } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    // Task owner can update
    const updated = await Task.findOneAndUpdate(
      { _id: taskId, userId: userId },
      { title, description, progress },
      { new: true }
    );

    if (!updated) {
      return res.status(403).json({ success: false, message: "Not allowed or Task not found" });
    }

    return res.json({ success: true, message: "Task updated", task: updated });

  } catch (err) {
    next(err);
  }
};

// ============================
// DELETE /tasks/:id
// ============================
exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const deleted = await Task.findOneAndDelete({
      _id: taskId,
      userId: userId
    });

    if (!deleted) {
      return res.status(403).json({ success: false, message: "Not allowed or Task not found" });
    }

    return res.json({ success: true, message: "Task deleted" });

  } catch (err) {
    next(err);
  }
};
