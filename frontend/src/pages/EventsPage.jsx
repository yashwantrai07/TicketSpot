import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await api.get(`/events${search ? `?search=${search}` : ""}`);
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Available Events</h1>
      <div className="flex gap-2">
        <input
          className="w-full rounded border p-2"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="rounded bg-indigo-600 px-4 py-2 text-white" onClick={fetchEvents}>
          Search
        </button>
      </div>
      {loading && <p>Loading events...</p>}
      {!loading && events.length === 0 && <p>No approved events yet.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <article key={event._id} className="rounded border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-700">{event.description}</p>
            <p className="mt-2 text-sm">Venue: {event.venue}</p>
            <p className="text-sm">
              From: {new Date(event.startAt).toLocaleString()}
              <br />
              To: {new Date(event.endAt).toLocaleString()}
            </p>
            <p className="text-sm">Available seats: {event.availableTickets}</p>
            <p className="text-sm font-medium">Price: Rs. {event.price} / seat</p>
            {user?.role === "attendee" && (
              <Link
                className="mt-3 inline-block rounded bg-green-600 px-3 py-1 text-white disabled:opacity-40"
                to={`/events/${event._id}/seats`}
              >
                Select seats & book
              </Link>
            )}
            {!user && (
              <p className="mt-2 text-sm text-gray-500">
                <Link className="text-indigo-600 underline" to="/login">
                  Login as attendee
                </Link>{" "}
                to book.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
