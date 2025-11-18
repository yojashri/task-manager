const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const User = require("../models/User"); // <-- IMPORTANT: add this

// ============================
// SIGNUP
// ============================
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6 chars long"),
    body("role").isIn(["student", "teacher"]).withMessage("Role must be student or teacher")
  ],
  authController.signup
);

// ============================
// LOGIN
// ============================
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  authController.login
);

// ============================
// GET ALL USERS  (NEW ROUTE)
// ============================
// Needed so teacher can see ONLY assigned students' tasks
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("_id email role teacherId");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
});

module.exports = router;
