const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const listUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

const updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

const pendingEvents = async (req, res) => {
  const events = await Event.find({ approvalStatus: "pending" })
    .populate("organizerId", "name email")
    .sort({ createdAt: -1 });
  res.json(events);
};

const setEventApproval = async (req, res) => {
  const { approvalStatus } = req.body;
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { approvalStatus },
    { new: true }
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.json(event);
};

const bookingReport = async (req, res) => {
  const [totalUsers, totalEvents, totalBookings, revenue] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments({ approvalStatus: "approved" }),
    Booking.countDocuments({ status: "confirmed" }),
    Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  res.json({
    totalUsers,
    totalEvents,
    totalBookings,
    totalRevenue: revenue[0]?.total || 0,
  });
};

module.exports = {
  listUsers,
  updateUserStatus,
  pendingEvents,
  setEventApproval,
  bookingReport,
};
