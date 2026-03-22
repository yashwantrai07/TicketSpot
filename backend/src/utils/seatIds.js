/** Row-major seat ids: R0-C0, R0-C1, ... */
const generateSeatId = (row, col) => `R${row}-C${col}`;

const parseSeatId = (id) => {
  const m = /^R(\d+)-C(\d+)$/.exec(id);
  if (!m) return null;
  return { row: Number(m[1]), col: Number(m[2]) };
};

const allSeatIdsForLayout = (rows, cols) => {
  const ids = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      ids.push(generateSeatId(r, c));
    }
  }
  return ids;
};

const validateSeatIdsForEvent = (event, seatIds) => {
  const { rows, cols } = event.seatLayout || {};
  if (!rows || !cols) return "Event has no seat layout";
  const valid = new Set(allSeatIdsForLayout(rows, cols));
  const unique = new Set(seatIds);
  if (unique.size !== seatIds.length) return "Duplicate seats selected";
  for (const id of seatIds) {
    if (!valid.has(id)) return `Invalid seat: ${id}`;
  }
  return null;
};

module.exports = { generateSeatId, parseSeatId, allSeatIdsForLayout, validateSeatIdsForEvent };
