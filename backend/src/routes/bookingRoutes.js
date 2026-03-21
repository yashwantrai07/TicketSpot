const express = require("express");
const { body } = require("express-validator");

const { createBooking, myBookings } = require("../controllers/bookingController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("attendee"),
  [
    body("eventId").isMongoId().withMessage("Valid eventId is required"),
    body("qty").isInt({ min: 1 }).withMessage("Quantity should be >= 1"),
    validateRequest,
  ],
  createBooking
);

router.get("/me", protect, allowRoles("attendee"), myBookings);

module.exports = router;
