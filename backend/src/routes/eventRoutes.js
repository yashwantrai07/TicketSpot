const express = require("express");
const { body } = require("express-validator");

const {
  createEvent,
  getPublicEvents,
  getEventById,
  getOrganizerEvents,
  updateOwnEvent,
  deleteOwnEvent,
} = require("../controllers/eventController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", getPublicEvents);
router.get("/organizer/my-events", protect, allowRoles("organizer"), getOrganizerEvents);
router.get("/:id", protect, getEventById);

const eventValidators = [
  body("title").notEmpty(),
  body("description").notEmpty(),
  body("datetime").isISO8601(),
  body("venue").notEmpty(),
  body("category").notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("capacity").isInt({ min: 1 }),
  validateRequest,
];

router.post("/", protect, allowRoles("organizer"), eventValidators, createEvent);
router.put("/:id", protect, allowRoles("organizer"), updateOwnEvent);
router.delete("/:id", protect, allowRoles("organizer"), deleteOwnEvent);

module.exports = router;
