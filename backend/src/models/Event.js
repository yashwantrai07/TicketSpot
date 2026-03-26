const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    /** Event window (organizer picks start and end) */
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    seatLayout: {
      rows: { type: Number, required: true, min: 1, max: 50 },
      cols: { type: Number, required: true, min: 1, max: 50 },
    },
    /** Booked seat ids, format R{row}-C{col} */
    bookedSeats: { type: [String], default: [] },
    capacity: { type: Number, required: true, min: 1 },
    availableTickets: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
