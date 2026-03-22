require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Booking.deleteMany({})]);

  const pwd = async (p) => bcrypt.hash(p, 10);

  const [admin, organizer, attendee] = await User.create([
    {
      name: "Admin User",
      email: "admin@ticketspot.dev",
      password: await pwd("Admin@123"),
      role: "admin",
      status: "active",
      organizerProfileComplete: true,
    },
    {
      name: "Organizer User",
      email: "organizer@ticketspot.dev",
      password: await pwd("Organizer@123"),
      role: "organizer",
      status: "active",
      panNumber: "ABCDE1234F",
      upiId: "organizer@okaxis",
      organizerProfileComplete: true,
    },
    {
      name: "Attendee User",
      email: "attendee@ticketspot.dev",
      password: await pwd("Attendee@123"),
      role: "attendee",
      status: "active",
      organizerProfileComplete: true,
    },
  ]);

  const week = 7 * 24 * 60 * 60 * 1000;
  const t0 = Date.now() + week;
  const t1 = Date.now() + 2 * week;

  await Event.create([
    {
      organizerId: organizer._id,
      title: "React Bootcamp",
      description: "Hands-on React event for students.",
      startAt: new Date(t0),
      endAt: new Date(t0 + 3 * 60 * 60 * 1000),
      venue: "Varanasi Hall A",
      category: "Workshop",
      price: 499,
      seatLayout: { rows: 5, cols: 10 },
      bookedSeats: [],
      capacity: 50,
      availableTickets: 50,
      approvalStatus: "approved",
    },
    {
      organizerId: organizer._id,
      title: "Node.js Career Talk",
      description: "Talk by industry experts.",
      startAt: new Date(t1),
      endAt: new Date(t1 + 2 * 60 * 60 * 1000),
      venue: "Varanasi Hall B",
      category: "Seminar",
      price: 299,
      seatLayout: { rows: 4, cols: 10 },
      bookedSeats: [],
      capacity: 40,
      availableTickets: 40,
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
