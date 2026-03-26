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
    try {
      const { data } = await api.get(`/events${search ? `?search=${search}` : ""}`);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Discover Events</h1>
        <div className="flex w-full md:w-auto shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
          <input
            className="flex-1 px-5 py-3 text-gray-700 focus:outline-none"
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
          />
          <button 
            className="bg-indigo-600 px-8 py-3 text-white font-bold hover:bg-indigo-700 transition duration-300 cursor-pointer"
            onClick={fetchEvents}
          >
            Search
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-xl text-gray-500 font-medium">No approved events found yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.map((event) => (
          <Link 
            key={event._id} 
            to={`/events/${event._id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
          >
            <div className="relative aspect-[200/345] overflow-hidden bg-gray-200">
              <img
                src={event.imageUrl || "https://via.placeholder.com/200x345?text=No+Image"}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center">
                <span className="text-yellow-500 mr-1 text-lg">★</span>
                <span className="text-gray-800">{event.averageRating ? event.averageRating.toFixed(1) : "N/A"}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">{event.category}</p>
                <h2 className="text-xl font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors truncate">
                  {event.title}
                </h2>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <p className="text-gray-900 font-bold text-lg">Rs. {event.price}</p>
                <span className="text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Details 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
