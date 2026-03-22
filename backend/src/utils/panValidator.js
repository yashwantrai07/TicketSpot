/** PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F) */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const isValidPanFormat = (pan) => {
  if (typeof pan !== "string") return false;
  return PAN_REGEX.test(pan.trim().toUpperCase());
};

module.exports = { isValidPanFormat, PAN_REGEX };
