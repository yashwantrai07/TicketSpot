/** In-memory OTP store (dev/demo). For production use Redis. */
const store = new Map();

const normEmail = (email) => String(email || "").toLowerCase().trim();

const key = (purpose, email) => `${purpose}:${normEmail(email)}`;

const set = (purpose, email, otp, payload = {}, ttlMs = 15 * 60 * 1000) => {
  store.set(key(purpose, email), {
    otp: String(otp),
    payload,
    expiresAt: Date.now() + ttlMs,
  });
};

const get = (purpose, email) => {
  const k = key(purpose, normEmail(email));
  const entry = store.get(k);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(k);
    return null;
  }
  return entry;
};

const verifyAndConsume = (purpose, email, otp) => {
  const k = key(purpose, normEmail(email));
  const entry = store.get(k);
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(k);
    return null;
  }
  if (String(entry.otp) !== String(otp)) {
    return false;
  }
  const payload = entry.payload;
  store.delete(k);
  return payload;
};

module.exports = { set, get, verifyAndConsume };
