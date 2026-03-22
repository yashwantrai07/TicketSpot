const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phone: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["admin", "organizer", "attendee"],
      default: "attendee",
    },
    status: {
      type: String,
      enum: ["pending_verification", "active", "blocked"],
      default: "pending_verification",
    },
    /** Organizer KYC-style fields (format-only PAN check) */
    panNumber: { type: String, trim: true, default: "" },
    upiId: { type: String, trim: true, default: "" },
    organizerProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
