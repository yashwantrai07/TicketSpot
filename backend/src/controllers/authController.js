const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || "attendee",
  });

  const token = signToken(user);
  res.status(201).json({ token, user: sanitizeUser(user) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.status === "blocked") {
    return res.status(403).json({ message: "User is blocked by admin" });
  }

  const token = signToken(user);
  res.json({ token, user: sanitizeUser(user) });
};

const me = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

module.exports = { register, login, me };
