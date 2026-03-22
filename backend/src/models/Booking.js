const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    seatIds: { type: [String], required: true },
    qty: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    /** Fake payment completed — ticket issued */
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    ticketCode: { type: String, default: "" },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
