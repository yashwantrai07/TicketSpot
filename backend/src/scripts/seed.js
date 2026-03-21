require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Booking.deleteMany({})]);

  const [admin, organizer, attendee] = await User.create([
    {
      name: "Admin User",
      email: "admin@ticketspot.dev",
      password: await bcrypt.hash("Admin@123", 10),
      role: "admin",
    },
    {
      name: "Organizer User",
      email: "organizer@ticketspot.dev",
      password: await bcrypt.hash("Organizer@123", 10),
      role: "organizer",
    },
    {
      name: "Attendee User",
      email: "attendee@ticketspot.dev",
      password: await bcrypt.hash("Attendee@123", 10),
      role: "attendee",
    },
  ]);

  await Event.create([
    {
      organizerId: organizer._id,
      title: "React Bootcamp",
      description: "Hands-on React event for students.",
      datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: "Varanasi Hall A",
      category: "Workshop",
      price: 499,
      capacity: 100,
      availableTickets: 100,
      approvalStatus: "approved",
    },
    {
      organizerId: organizer._id,
      title: "Node.js Career Talk",
      description: "Talk by industry experts.",
      datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: "Varanasi Hall B",
      category: "Seminar",
      price: 299,
      capacity: 80,
      availableTickets: 80,
      approvalStatus: "pending",
    },
  ]);

  console.log("Seed complete:");
  console.log(`Admin: ${admin.email} / Admin@123`);
  console.log(`Organizer: ${organizer.email} / Organizer@123`);
  console.log(`Attendee: ${attendee.email} / Attendee@123`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
