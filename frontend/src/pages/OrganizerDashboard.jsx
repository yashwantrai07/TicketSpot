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
  imageUrl: "",
});

export default function OrganizerDashboard() {
  const [form, setForm] = useState(emptyForm);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    try {
      const { data } = await api.get("/events/organizer/my-events");
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const createEvent = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api.post("/events", {
        title: form.title,
        description: form.description,
        venue: form.venue,
        category: form.category,
        price: Number(form.price),
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        imageUrl: form.imageUrl,
        seatLayout: {
          rows: Number(form.seatRows),
          cols: Number(form.seatCols),
        },
      });
      setForm(emptyForm());
      setMessage("Success: Event created and sent for admin approval!");
      loadEvents();
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || "Event creation failed"));
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to remove this event? This action cannot be undone.")) return;
    try {
      await api.delete(`/events/${id}`);
      loadEvents();
      setMessage("Success: Event removed successfully");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || "Failed to delete event"));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Organizer Dashboard</h1>
          <p className="text-indigo-600 font-medium">Manage your events and listings</p>
        </div>
        <Link 
          to="/organizer/profile" 
          className="inline-flex items-center bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:shadow-md transition border border-indigo-100"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Complete Profile (PAN + UPI)
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
            <div className="bg-indigo-600 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create New Event
              </h2>
            </div>
            
            <form onSubmit={createEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Event Title</label>
                <input
                  className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter event title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition h-24"
                  placeholder="Describe your event..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date & Time</label>
                  <input
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition text-sm"
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date & Time</label>
                  <input
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition text-sm"
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Venue</label>
                  <input
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Location name"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <input
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="e.g. Movies, Comedy, etc"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                <input
                  className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Enter image url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</label>
                  <input
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rows</label>
                  <input
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition"
                    type="number"
                    min={1}
                    max={50}
                    value={form.seatRows}
                    onChange={(e) => setForm({ ...form, seatRows: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cols</label>
                  <input
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500 transition"
                    type="number"
                    min={1}
                    max={50}
                    value={form.seatCols}
                    onChange={(e) => setForm({ ...form, seatCols: e.target.value })}
                    required
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.startsWith("Success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {message}
                </div>
              )}

              <button 
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition duration-300 disabled:opacity-50 cursor-pointer" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Launch Event"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            Your Active Listings
            <span className="ml-3 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-black">
              {events.length}
            </span>
          </h2>
          
          {events.length === 0 && (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center">
              <p className="text-gray-500 font-medium">No events listed yet. Create your first one!</p>
            </div>
          )}

          <div className="grid gap-6">
            {events.map((event) => (
              <article key={event._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 md:h-auto overflow-hidden bg-gray-100">
                    <img 
                      src={event.imageUrl || "https://via.placeholder.com/200x345?text=No+Image"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                          event.approvalStatus === "approved" ? "bg-green-100 text-green-700" : 
                          event.approvalStatus === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {event.approvalStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(event.startAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.venue}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          {event.availableTickets} / {event.capacity} seats left
                        </div>
                        <div className="flex items-center text-gray-600 font-bold">
                          Rs. {event.price} / ticket
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                      <button 
                        onClick={() => deleteEvent(event._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center px-4 py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Event
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
