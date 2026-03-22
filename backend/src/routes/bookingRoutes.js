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
    body("seatIds").isArray({ min: 1 }).withMessage("seatIds must be a non-empty array"),
    body("seatIds.*").isString().notEmpty(),
    validateRequest,
  ],
  createBooking
);

router.get("/me", protect, allowRoles("attendee"), myBookings);

module.exports = router;
