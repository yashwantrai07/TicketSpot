const Event = require("../models/Event");

const createEvent = async (req, res) => {
  const { title, description, venue, category, price, startAt, endAt, seatLayout } = req.body;
  const rows = Number(seatLayout?.rows);
  const cols = Number(seatLayout?.cols);
  if (!rows || !cols || rows < 1 || cols < 1) {
    return res.status(400).json({ message: "seatLayout.rows and seatLayout.cols are required" });
  }
  const start = new Date(startAt);
  const end = new Date(endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid startAt or endAt" });
  }
  if (end <= start) {
    return res.status(400).json({ message: "endAt must be after startAt" });
  }

  const capacity = rows * cols;
  const event = await Event.create({
    title,
    description,
    venue,
    category,
    price: Number(price),
    startAt: start,
    endAt: end,
    seatLayout: { rows, cols },
    bookedSeats: [],
    capacity,
    availableTickets: capacity,
    organizerId: req.user._id,
    approvalStatus: "pending",
  });
  res.status(201).json(event);
};

const getPublicEvents = async (req, res) => {
  const query = {
    approvalStatus: "approved",
  };
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: "i" };
  }
  const events = await Event.find(query).sort({ startAt: 1 });
  res.json(events);
};

const getPublicEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizerId", "name email");
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (event.approvalStatus !== "approved") {
    return res.status(403).json({ message: "Event is not available" });
  }
  res.json(event);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizerId", "name email");
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  const orgId = event.organizerId?._id || event.organizerId;
  if (
    event.approvalStatus !== "approved" &&
    req.user?.role !== "admin" &&
    String(orgId) !== String(req.user?._id)
  ) {
    return res.status(403).json({ message: "Event is not available" });
  }
  res.json(event);
};

const getOrganizerEvents = async (req, res) => {
  const events = await Event.find({ organizerId: req.user._id }).sort({ createdAt: -1 });
  res.json(events);
};

const updateOwnEvent = async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, organizerId: req.user._id });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const { title, description, venue, category, price, startAt, endAt, seatLayout } = req.body;
  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (venue !== undefined) event.venue = venue;
  if (category !== undefined) event.category = category;
  if (price !== undefined) event.price = Number(price);
  if (startAt !== undefined) event.startAt = new Date(startAt);
  if (endAt !== undefined) event.endAt = new Date(endAt);
  if (event.endAt <= event.startAt) {
    return res.status(400).json({ message: "endAt must be after startAt" });
  }

  if (seatLayout?.rows && seatLayout?.cols) {
    const booked = event.bookedSeats?.length || 0;
    const newCap = Number(seatLayout.rows) * Number(seatLayout.cols);
    if (newCap < booked) {
      return res.status(400).json({ message: "New layout cannot be smaller than booked seats" });
    }
    event.seatLayout = { rows: Number(seatLayout.rows), cols: Number(seatLayout.cols) };
    event.capacity = newCap;
    event.availableTickets = newCap - booked;
  }

  event.approvalStatus = "pending";
  await event.save();

  res.json(event);
};

const deleteOwnEvent = async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, organizerId: req.user._id });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.json({ message: "Event deleted" });
};

module.exports = {
  createEvent,
  getPublicEvents,
  getPublicEventById,
  getEventById,
  getOrganizerEvents,
  updateOwnEvent,
  deleteOwnEvent,
};
