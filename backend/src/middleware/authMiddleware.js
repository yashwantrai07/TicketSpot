const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret_change_me"
    );
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.status === "blocked") {
      return res.status(401).json({ message: "Invalid user access" });
    }

    if (user.status === "pending_verification") {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden for this role" });
    }
    next();
  };
};

const requireOrganizerProfile = (req, res, next) => {
  if (req.user.role !== "organizer") {
    return next();
  }
  if (!req.user.organizerProfileComplete) {
    return res.status(403).json({
      message: "Complete organizer profile (PAN + UPI) before listing events",
    });
  }
  next();
};

module.exports = { protect, allowRoles, requireOrganizerProfile };
