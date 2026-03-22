import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const emptyForm = () => ({
  title: "",
  description: "",
  startAt: "",
  endAt: "",
  venue: "",
  category: "",
  price: 0,
  seatRows: 5,
  seatCols: 10,
});

export default function OrganizerDashboard() {
  const [form, setForm] = useState(emptyForm);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  const loadEvents = async () => {
    const { data } = await api.get("/events/organizer/my-events");
    setEvents(data);
  };

  useEffect(() => {
    api.get("/events/organizer/my-events").then((res) => setEvents(res.data));
  }, []);

  const createEvent = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/events", {
        title: form.title,
        description: form.description,
        venue: form.venue,
        category: form.category,
        price: Number(form.price),
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        seatLayout: {
          rows: Number(form.seatRows),
          cols: Number(form.seatCols),
        },
      });
      setForm(emptyForm());
      setMessage("Event created and sent for admin approval");
      loadEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Event creation failed");
    }
  };

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm">
          <Link className="text-indigo-600 underline" to="/organizer/profile">
            Complete organizer profile
          </Link>{" "}
          (PAN + UPI) before listing events.
        </p>
        <form onSubmit={createEvent} className="space-y-2 rounded bg-white p-4 shadow">
          <h1 className="text-xl font-bold">Create Event</h1>
          <input
            className="w-full rounded border p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="w-full rounded border p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <label className="text-xs text-gray-600">Event start</label>
          <input
            className="w-full rounded border p-2"
            type="datetime-local"
            value={form.startAt}
            onChange={(e) => setForm({ ...form, startAt: e.target.value })}
            required
          />
          <label className="text-xs text-gray-600">Event end</label>
          <input
            className="w-full rounded border p-2"
            type="datetime-local"
            value={form.endAt}
            onChange={(e) => setForm({ ...form, endAt: e.target.value })}
            required
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Venue"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            required
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            className="w-full rounded border p-2"
            type="number"
            min={0}
            placeholder="Ticket price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Seat rows</label>
              <input
                className="w-full rounded border p-2"
                type="number"
                min={1}
                max={50}
                value={form.seatRows}
                onChange={(e) => setForm({ ...form, seatRows: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Seat columns</label>
              <input
                className="w-full rounded border p-2"
                type="number"
                min={1}
                max={50}
                value={form.seatCols}
                onChange={(e) => setForm({ ...form, seatCols: e.target.value })}
                required
              />
            </div>
          </div>
          {message && <p className="text-sm text-indigo-700">{message}</p>}
          <button className="rounded bg-indigo-600 px-4 py-2 text-white" type="submit">
            Save Event
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold">My Events</h2>
        {events.map((event) => (
          <article key={event._id} className="rounded border bg-white p-4">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">
              {new Date(event.startAt).toLocaleString()} &ndash; {new Date(event.endAt).toLocaleString()}
            </p>
            <p>
              Seat grid: {event.seatLayout?.rows} &times; {event.seatLayout?.cols}
            </p>
            <p>Status: {event.approvalStatus}</p>
            <p>Available seats: {event.availableTickets}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
