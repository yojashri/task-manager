const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");

// Signup Route
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6 chars long"),
    body("role").isIn(["student", "teacher"]).withMessage("Role must be student or teacher")
  ],
  authController.signup
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  authController.login
);

module.exports = router;
