import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AttendeeDashboard() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/bookings/me")
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load bookings"));
  }, []);

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      {error && <p className="text-red-600">{error}</p>}
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map((booking) => (
        <article key={booking._id} className="rounded border bg-white p-4">
          <h2 className="font-semibold">{booking.eventId?.title || "Event unavailable"}</h2>
          <p>Quantity: {booking.qty}</p>
          <p>Total: Rs. {booking.totalAmount}</p>
          <p>Status: {booking.status}</p>
        </article>
      ))}
    </section>
  );
}
