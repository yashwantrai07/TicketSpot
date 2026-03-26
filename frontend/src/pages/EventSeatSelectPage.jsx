import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/events/public/${eventId}`)
      .then(({ data }) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load event");
        setLoading(false);
      });
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

  const goCheckout = () => {
    const seatIds = [...selected];
    if (seatIds.length < 1) {
      setError("Please select at least one seat to continue.");
      return;
    }
    navigate(`/events/${eventId}/checkout`, { state: { event, seatIds } });
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  if (error && !event) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;

  const rows = event.seatLayout?.rows || 0;
  const cols = event.seatLayout?.cols || 0;

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <Link to={`/events/${eventId}`} className="text-indigo-100 hover:text-white flex items-center mb-2 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Event Details
          </Link>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="mt-1 opacity-90">{event.venue} &bull; {new Date(event.startAt).toLocaleString()}</p>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Select Your Seats
              </h2>
              
              <div className="mb-8 flex flex-wrap gap-4 text-sm font-medium">
                <div className="flex items-center"><span className="w-4 h-4 bg-gray-100 border rounded mr-2"></span> Available</div>
                <div className="flex items-center"><span className="w-4 h-4 bg-indigo-600 rounded mr-2"></span> Selected</div>
                <div className="flex items-center"><span className="w-4 h-4 bg-gray-300 rounded mr-2"></span> Booked</div>
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{error}</div>}

              <div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100 overflow-auto flex justify-center">
                <div 
                  className="inline-grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))` }}
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
                        title={`Row ${r+1}, Col ${c+1}`}
                        className={`w-10 h-10 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer ${
                          booked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : isSel
                              ? "bg-indigo-600 text-white scale-110 shadow-lg ring-2 ring-indigo-300"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
                        }`}
                      >
                        {r + 1}-{c + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 w-full h-2 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Screen This Way</span>
              </div>
            </div>

            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Seats Selected:</span>
                    <span className="font-bold text-gray-900">{selected.size}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Price per seat:</span>
                    <span className="font-bold text-gray-900">Rs. {event.price}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between text-xl font-bold text-gray-900">
                    <span>Subtotal:</span>
                    <span className="text-indigo-600">Rs. {selected.size * event.price}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={selected.size < 1}
                  onClick={goCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Need Help?</h4>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  Select your preferred seats on the map. You can select multiple seats at once. Taxes will be calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
