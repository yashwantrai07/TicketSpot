import { useEffect, useState } from "react";
import { api } from "../api/client";

const initialForm = {
  title: "",
  description: "",
  datetime: "",
  venue: "",
  category: "",
  price: 0,
  capacity: 1,
};

export default function OrganizerDashboard() {
  const [form, setForm] = useState(initialForm);
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
    try {
      await api.post("/events", form);
      setForm(initialForm);
      setMessage("Event created and sent for admin approval");
      loadEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Event creation failed");
    }
  };

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <form onSubmit={createEvent} className="space-y-2 rounded bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Create Event</h1>
        {Object.keys(initialForm).map((key) => (
          <input
            key={key}
            className="w-full rounded border p-2"
            type={key === "datetime" ? "datetime-local" : key === "price" || key === "capacity" ? "number" : "text"}
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
          />
        ))}
        {message && <p className="text-sm text-indigo-700">{message}</p>}
        <button className="rounded bg-indigo-600 px-4 py-2 text-white" type="submit">
          Save Event
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-bold">My Events</h2>
        {events.map((event) => (
          <article key={event._id} className="rounded border bg-white p-4">
            <h3 className="font-semibold">{event.title}</h3>
            <p>Status: {event.approvalStatus}</p>
            <p>Available: {event.availableTickets}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
