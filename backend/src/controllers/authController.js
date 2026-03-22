const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const otpStore = require("../utils/otpStore");
const { sendMail } = require("../utils/mailer");
const { validatePasswordStrength } = require("../utils/passwordPolicy");
const { isValidPanFormat } = require("../utils/panValidator");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  phone: user.phone,
  panNumber: user.panNumber ? "***" + user.panNumber.slice(-4) : "",
  upiId: user.upiId ? String(user.upiId).replace(/.(?=.{4})/g, "*") : "",
  organizerProfileComplete: user.organizerProfileComplete,
});

const sanitizeUserFull = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  phone: user.phone || "",
  panNumber: user.panNumber || "",
  upiId: user.upiId || "",
  organizerProfileComplete: user.organizerProfileComplete,
});

const randomOtp = () => String(Math.floor(100000 + Math.random() * 900000));

/** Step 1: send OTP, store pending registration */
const registerRequest = async (req, res) => {
  const { name, email, password, role: roleRaw } = req.body;
  const policy = validatePasswordStrength(password);
  if (policy) {
    return res.status(400).json({ message: policy });
  }

  const role = roleRaw === "organizer" ? "organizer" : "attendee";

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const otp = randomOtp();
  otpStore.set(
    "register",
    email,
    otp,
    { name, hashedPassword: hashed, role },
    15 * 60 * 1000
  );

  await sendMail({
    to: email,
    subject: "TicketSpot — verify your email",
    text: `Your OTP is ${otp}. It expires in 15 minutes.`,
  });

  res.json({ message: "OTP sent to your email" });
};

/** Step 2: verify OTP and create user */
const registerVerify = async (req, res) => {
  const { email, otp } = req.body;
  const payload = otpStore.verifyAndConsume("register", email, otp);
  if (payload === false) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  if (!payload) {
    return res.status(400).json({ message: "OTP expired or not found — request again" });
  }

  const { name, hashedPassword, role: r } = payload;
  const role = r === "organizer" ? "organizer" : "attendee";
  const user = await User.create({
    name,
    email: String(email).toLowerCase(),
    password: hashedPassword,
    role,
    status: "active",
    organizerProfileComplete: role === "organizer" ? false : true,
  });

  const token = signToken(user);
  res.status(201).json({ token, user: sanitizeUser(user) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.status === "pending_verification") {
    return res.status(403).json({ message: "Please verify your email first" });
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
  const user = await User.findById(req.user._id);
  res.json({ user: sanitizeUserFull(user) });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return res.json({ message: "If the email exists, an OTP was sent" });
  }
  const otp = randomOtp();
  otpStore.set("forgot", email, otp, { userId: String(user._id) }, 15 * 60 * 1000);
  await sendMail({
    to: email,
    subject: "TicketSpot — password reset OTP",
    text: `Your OTP is ${otp}. It expires in 15 minutes.`,
  });
  res.json({ message: "If the email exists, an OTP was sent" });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const policy = validatePasswordStrength(newPassword);
  if (policy) {
    return res.status(400).json({ message: policy });
  }
  const payload = otpStore.verifyAndConsume("forgot", email, otp);
  if (payload === false) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  if (!payload) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated — you can login now" });
};

const updateOrganizerProfile = async (req, res) => {
  if (req.user.role !== "organizer") {
    return res.status(403).json({ message: "Only organizers" });
  }
  const { panNumber, upiId } = req.body;
  const pan = String(panNumber || "").trim().toUpperCase();
  const upi = String(upiId || "").trim();

  if (!isValidPanFormat(pan)) {
    return res.status(400).json({
      message: "PAN must match format AAAAA9999A (5 letters, 4 digits, 1 letter)",
    });
  }
  if (!upi || upi.length < 3) {
    return res.status(400).json({ message: "UPI ID is required" });
  }

  const user = await User.findById(req.user._id);
  user.panNumber = pan;
  user.upiId = upi;
  user.organizerProfileComplete = true;
  await user.save();
  res.json({ user: sanitizeUserFull(user) });
};

module.exports = {
  registerRequest,
  registerVerify,
  login,
  me,
  forgotPassword,
  resetPassword,
  updateOrganizerProfile,
};
