import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

function allSeatIds(rows, cols) {
  const ids = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      ids.push(`R${r}-C${c}`);
    }
  }
  return ids;
}

export default function EventSeatSelectPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(() => new Set());

  useEffect(() => {
    api
      .get(`/events/public/${eventId}`)
      .then(({ data }) => setEvent(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load event"));
  }, [eventId]);

  const seats = useMemo(() => {
    if (!event?.seatLayout) return [];
    const { rows, cols } = event.seatLayout;
    return allSeatIds(rows, cols);
  }, [event]);

  const toggle = (id) => {
    if (!event || event.bookedSeats?.includes(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const goPay = () => {
    const seatIds = [...selected];
    if (seatIds.length < 1) {
      setError("Select at least one seat");
      return;
    }
    navigate(`/events/${eventId}/payment`, { state: { event, seatIds } });
  };

  if (error && !event) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!event) {
    return <p>Loading...</p>;
  }

  const rows = event.seatLayout?.rows || 0;
  const cols = event.seatLayout?.cols || 0;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-sm text-gray-600">
        {new Date(event.startAt).toLocaleString()} &ndash; {new Date(event.endAt).toLocaleString()} &middot; Rs.{" "}
        {event.price} / seat
      </p>
      <p className="text-sm">Tap seats to select multiple. Booked seats are disabled.</p>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div
        className="inline-grid gap-1 rounded border bg-white p-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {seats.map((id) => {
          const m = /^R(\d+)-C(\d+)$/.exec(id);
          const r = m ? Number(m[1]) : 0;
          const c = m ? Number(m[2]) : 0;
          const booked = event.bookedSeats?.includes(id);
          const isSel = selected.has(id);
          return (
            <button
              key={id}
              type="button"
              disabled={booked}
              onClick={() => toggle(id)}
              className={`rounded px-2 py-1 text-xs ${
                booked
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : isSel
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {r + 1}-{c + 1}
            </button>
          );
        })}
      </div>

      <p className="text-sm">
        Selected: {selected.size} seat(s) &middot; Subtotal: Rs. {selected.size * event.price}
      </p>
      <button
        type="button"
        className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        disabled={selected.size < 1}
        onClick={goPay}
      >
        Proceed to payment
      </button>
    </section>
  );
}
