const express = require("express");
const { body } = require("express-validator");

const {
  registerRequest,
  registerVerify,
  login,
  me,
  forgotPassword,
  resetPassword,
  updateOrganizerProfile,
} = require("../controllers/authController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register-request",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password min length is 8"),
    body("role").optional().isIn(["organizer", "attendee"]),
    validateRequest,
  ],
  registerRequest
);

router.post(
  "/register-verify",
  [
    body("email").isEmail(),
    body("otp").isLength({ min: 4, max: 8 }),
    validateRequest,
  ],
  registerVerify
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  login
);

router.post(
  "/forgot-password",
  [body("email").isEmail(), validateRequest],
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("email").isEmail(),
    body("otp").isLength({ min: 4, max: 8 }),
    body("newPassword").isLength({ min: 8 }),
    validateRequest,
  ],
  resetPassword
);

router.get("/me", protect, me);

router.patch(
  "/organizer-profile",
  protect,
  allowRoles("organizer"),
  [
    body("panNumber").notEmpty(),
    body("upiId").notEmpty(),
    validateRequest,
  ],
  updateOrganizerProfile
);

module.exports = router;
