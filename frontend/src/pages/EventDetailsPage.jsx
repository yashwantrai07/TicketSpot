import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/public/${eventId}`);
        setEvent(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="flex justify-center p-10"><p className="text-xl">Loading...</p></div>;
  if (error) return <div className="text-center p-10 text-red-600"><p>{error}</p></div>;
  if (!event) return <div className="text-center p-10"><p>Event not found</p></div>;

  const isEventOver = new Date(event.startAt) < new Date();

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-96 w-full object-cover md:w-80"
            src={event.imageUrl || "https://via.placeholder.com/200x345?text=No+Image"}
            alt={event.title}
          />
        </div>
        <div className="p-8 w-full">
          <div className="flex justify-between items-start">
            <div>
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {event.category}
              </div>
              <h1 className="mt-1 text-3xl font-bold text-gray-900 leading-tight">
                {event.title}
              </h1>
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <span className="mr-1">★</span>
              {event.averageRating ? event.averageRating.toFixed(1) : "N/A"}
            </div>
          </div>

          <div className="mt-4 text-gray-600">
            <p className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue}
            </p>
            <p className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(event.startAt).toLocaleString()} - {new Date(event.endAt).toLocaleString()}
            </p>
            <p className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              {event.availableTickets} tickets left
            </p>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-bold mb-2">About this event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              Rs. {event.price} <span className="text-sm font-normal text-gray-500">per ticket</span>
            </div>
            {isEventOver ? (
              <button disabled className="bg-gray-400 text-white px-8 py-3 rounded-lg font-bold cursor-not-allowed">
                Event Finished
              </button>
            ) : user?.role === "attendee" ? (
              <Link
                to={`/events/${event._id}/seats`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
              >
                Book Tickets
              </Link>
            ) : !user ? (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
              >
                Login to Book
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {event.ratings?.length > 0 && (
        <div className="bg-gray-50 p-8 border-t">
          <h2 className="text-xl font-bold mb-4">User Reviews</h2>
          <div className="space-y-4">
            {event.ratings.map((r, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between mb-2">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx}>{idx < r.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
