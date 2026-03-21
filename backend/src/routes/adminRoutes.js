const express = require("express");
const { body } = require("express-validator");

const {
  listUsers,
  updateUserStatus,
  pendingEvents,
  setEventApproval,
  bookingReport,
} = require("../controllers/adminController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/users", listUsers);
router.patch(
  "/users/:id/status",
  [body("status").isIn(["active", "blocked"]), validateRequest],
  updateUserStatus
);
router.get("/events/pending", pendingEvents);
router.patch(
  "/events/:id/approval",
  [body("approvalStatus").isIn(["approved", "rejected"]), validateRequest],
  setEventApproval
);
router.get("/reports/bookings", bookingReport);

module.exports = router;
