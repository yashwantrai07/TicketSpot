const express = require("express");
const { body } = require("express-validator");

const {
  createEvent,
  getPublicEvents,
  getPublicEventById,
  getEventById,
  getOrganizerEvents,
  updateOwnEvent,
  deleteOwnEvent,
} = require("../controllers/eventController");
const { protect, allowRoles, requireOrganizerProfile } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", getPublicEvents);
router.get("/public/:id", getPublicEventById);
router.get("/organizer/my-events", protect, allowRoles("organizer"), getOrganizerEvents);

const eventValidators = [
  body("title").notEmpty(),
  body("description").notEmpty(),
  body("startAt").isISO8601(),
  body("endAt").isISO8601(),
  body("venue").notEmpty(),
  body("category").notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("seatLayout.rows").isInt({ min: 1, max: 50 }),
  body("seatLayout.cols").isInt({ min: 1, max: 50 }),
  validateRequest,
];

router.post(
  "/",
  protect,
  allowRoles("organizer"),
  requireOrganizerProfile,
  eventValidators,
  createEvent
);
router.get("/:id", protect, getEventById);
router.put("/:id", protect, allowRoles("organizer"), updateOwnEvent);
router.delete("/:id", protect, allowRoles("organizer"), deleteOwnEvent);

module.exports = router;
