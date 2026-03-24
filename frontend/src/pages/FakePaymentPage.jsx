import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function FakePaymentPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { event, seatIds } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState(null);

  if (!event || !seatIds?.length) {
    return (
      <div className="rounded bg-white p-6 shadow">
        <p className="text-gray-700">No booking data. Start from the event list.</p>
        <Link className="mt-2 inline-block text-indigo-600" to="/">
          Browse events
        </Link>
      </div>
    );
  }

  const total = seatIds.length * event.price;

  const pay = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/bookings", { eventId, seatIds });
      setTicket(data);
    } catch (err) {
      setError(err.response?.data?.message || "Payment/booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (ticket) {
    return (
      <div className="mx-auto max-w-lg space-y-3 rounded bg-white p-6 shadow">
        <h1 className="text-xl font-bold text-green-700">Payment successful (demo)</h1>
        <p className="font-mono text-lg">Ticket: {ticket.ticketCode}</p>
        <p className="text-sm">Seats: {ticket.seatIds?.join(", ")}</p>
        <p className="text-sm">Total paid: Rs. {ticket.totalAmount}</p>
        <Link className="text-indigo-600 underline" to="/attendee">
          View my bookings
        </Link>
        <button
          type="button"
          className="block text-sm text-gray-600"
          onClick={() => navigate("/")}
        >
          Back to events
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Payment Page</h1>
      <p className="text-sm text-gray-600">Pay now by clicking below</p>
      <div className="rounded border p-3 text-sm">
        <p className="font-semibold">{event.title}</p>
        <p>Seats ({seatIds.length}): {seatIds.join(", ")}</p>
        <p className="mt-2 text-lg font-bold">Amount due: Rs. {total}</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        disabled={loading}
        className="w-full rounded bg-indigo-600 py-3 text-white disabled:opacity-50"
        onClick={pay}
      >
        {loading ? "Processing…" : `Pay Rs. ${total}`}
      </button>
      <button type="button" className="w-full text-sm text-gray-600" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
