const Booking = require("../models/Booking");
const Event = require("../models/Event");

const createBooking = async (req, res) => {
  const { eventId, qty } = req.body;
  const safeQty = Number(qty);

  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      approvalStatus: "approved",
      availableTickets: { $gte: safeQty },
    },
    { $inc: { availableTickets: -safeQty } },
    { new: true }
  );

  if (!event) {
    return res.status(400).json({ message: "Not enough tickets or invalid event" });
  }

  const existing = await Booking.findOne({
    userId: req.user._id,
    eventId,
    status: "confirmed",
    createdAt: { $gte: new Date(Date.now() - 10 * 1000) },
  });
  if (existing) {
    await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: safeQty } });
    return res.status(409).json({ message: "Duplicate booking attempt detected" });
  }

  const booking = await Booking.create({
    userId: req.user._id,
    eventId,
    qty: safeQty,
    totalAmount: safeQty * event.price,
  });

  res.status(201).json(booking);
};

const myBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("eventId", "title datetime venue")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

module.exports = { createBooking, myBookings };
