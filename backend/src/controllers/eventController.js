const Event = require("../models/Event");

const createEvent = async (req, res) => {
  const event = await Event.create({
    ...req.body,
    organizerId: req.user._id,
    availableTickets: req.body.capacity,
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
  const events = await Event.find(query).sort({ datetime: 1 });
  res.json(events);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizerId", "name email");
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (event.approvalStatus !== "approved" && req.user?.role !== "admin" && `${event.organizerId._id}` !== `${req.user?._id}`) {
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

  const wasCapacity = event.capacity;
  const wasAvailable = event.availableTickets;

  Object.assign(event, req.body);
  if (req.body.capacity && req.body.capacity !== wasCapacity) {
    const bookedSeats = wasCapacity - wasAvailable;
    event.availableTickets = Math.max(0, req.body.capacity - bookedSeats);
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
  getEventById,
  getOrganizerEvents,
  updateOwnEvent,
  deleteOwnEvent,
};
