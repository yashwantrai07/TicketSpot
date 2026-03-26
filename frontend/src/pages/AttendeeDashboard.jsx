import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AttendeeDashboard() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [ratingForm, setRatingForm] = useState({ eventId: "", rating: 5, comment: "", bookingId: "" });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      const { data } = await api.get("/bookings/me");
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load bookings");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleRateClick = (booking) => {
    setRatingForm({
      eventId: booking.eventId._id,
      rating: 5,
      comment: "",
      bookingId: booking._id
    });
    setShowRatingModal(true);
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events/rate", {
        eventId: ratingForm.eventId,
        rating: ratingForm.rating,
        comment: ratingForm.comment
      });
      setMessage("Rating submitted successfully!");
      setShowRatingModal(false);
      loadBookings();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900">My Tickets</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your bookings and rate past experiences</p>
        </div>
        <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
          {bookings.length} Total Bookings
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 font-bold animate-bounce text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-bold text-center">
          {error}
        </div>
      )}

      {bookings.length === 0 && !error && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-xl text-gray-400 font-medium">No bookings yet. Start exploring events!</p>
        </div>
      )}

      <div className="grid gap-8">
        {bookings.map((booking) => {
          const event = booking.eventId;
          const isEventOver = event && new Date(event.endAt) < new Date();
          const canRate = isEventOver && !booking.isRated && booking.status === "confirmed";

          return (
            <article key={booking._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col md:flex-row group">
              <div className={`w-2 md:w-4 ${booking.status === "confirmed" ? "bg-green-500" : "bg-red-500"}`}></div>
              
              <div className="p-8 flex-1">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {event?.title || "Deleted Event"}
                    </h2>
                    <p className="text-gray-500 flex items-center mt-1 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event?.venue || "Unknown Venue"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {booking.status}
                    </span>
                    <p className="mt-2 font-mono font-bold text-indigo-700">{booking.ticketCode}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-50">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Seats</p>
                    <p className="font-semibold text-gray-700">{booking.seatIds?.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                    <p className="font-semibold text-gray-700">{booking.qty}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="font-bold text-gray-900">Rs. {booking.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Event Date</p>
                    <p className="font-semibold text-gray-700">{event ? new Date(event.startAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-400 italic">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                  
                  {canRate && (
                    <button 
                      onClick={() => handleRateClick(booking)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-2 rounded-xl font-bold transition shadow-sm hover:shadow-md cursor-pointer flex items-center"
                    >
                      <span className="mr-2 text-xl">★</span> Rate Event
                    </button>
                  )}
                  {booking.isRated && (
                    <div className="flex items-center text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Rated
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Rate Your Experience</h3>
              <button onClick={() => setShowRatingModal(false)} className="text-indigo-200 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={submitRating} className="p-8 space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                    className={`text-4xl transition transform hover:scale-110 cursor-pointer ${
                      star <= ratingForm.rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Review</label>
                <textarea
                  className="w-full rounded-2xl border-gray-200 border p-4 focus:ring-2 focus:ring-indigo-500 transition h-32"
                  placeholder="What did you think of the event?"
                  value={ratingForm.comment}
                  onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 cursor-pointer"
              >
                Submit Rating
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
