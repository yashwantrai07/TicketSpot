const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { validateSeatIdsForEvent } = require("../utils/seatIds");

const createBooking = async (req, res) => {
  const { eventId, seatIds } = req.body;
  if (!Array.isArray(seatIds) || seatIds.length < 1) {
    return res.status(400).json({ message: "Select at least one seat" });
  }

  const session = await mongoose.startSession();
  let bookingOut;
  try {
    await session.withTransaction(async () => {
      const event = await Event.findOne({
        _id: eventId,
        approvalStatus: "approved",
      }).session(session);

      if (!event) {
        throw new Error("EVENT_UNAVAILABLE");
      }

      const err = validateSeatIdsForEvent(event, seatIds);
      if (err) {
        throw new Error(err);
      }

      const conflict = seatIds.some((s) => event.bookedSeats.includes(s));
      if (conflict) {
        throw new Error("SEAT_TAKEN");
      }

      if (event.availableTickets < seatIds.length) {
        throw new Error("NOT_ENOUGH");
      }

      await Event.updateOne(
        { _id: eventId },
        {
          $push: { bookedSeats: { $each: seatIds } },
          $inc: { availableTickets: -seatIds.length },
        },
        { session }
      );

      const totalAmount = seatIds.length * event.price;
      const ticketCode = `TKT-${nanoid(12).toUpperCase()}`;

      const [booking] = await Booking.create(
        [
          {
            userId: req.user._id,
            eventId,
            seatIds,
            qty: seatIds.length,
            totalAmount,
            paymentStatus: "paid",
            ticketCode,
            status: "confirmed",
          },
        ],
        { session }
      );
      bookingOut = booking;
    });
  } catch (e) {
    const msg = e.message;
    if (msg === "EVENT_UNAVAILABLE") {
      return res.status(400).json({ message: "Event not available" });
    }
    if (msg === "SEAT_TAKEN") {
      return res.status(409).json({ message: "One or more seats are already booked" });
    }
    if (msg === "NOT_ENOUGH") {
      return res.status(400).json({ message: "Not enough tickets available" });
    }
    if (msg && msg.length < 120 && !msg.includes("Transaction")) {
      return res.status(400).json({ message: msg });
    }
    throw e;
  } finally {
    session.endSession();
  }

  const populated = await Booking.findById(bookingOut._id)
    .populate("eventId", "title startAt endAt venue price")
    .lean();

  res.status(201).json(populated);
};

const myBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("eventId", "title startAt endAt venue price")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

module.exports = { createBooking, myBookings };
