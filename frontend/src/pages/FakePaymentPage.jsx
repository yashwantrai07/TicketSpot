import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function FakePaymentPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { event, seatIds, billDetails } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState(null);

  if (!event || !seatIds?.length || !billDetails) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">No Payment Data</h1>
        <p className="text-gray-600 mb-6">Something went wrong with the booking flow.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition duration-300">
          Back to Home
        </Link>
      </div>
    );
  }

  const pay = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/bookings", { 
        eventId, 
        seatIds,
        totalAmount: billDetails.totalAmount // Optional: backend calculates it too
      });
      setTicket(data);
    } catch (err) {
      setError(err.response?.data?.message || "Payment/booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (ticket) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-green-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black">Booking Confirmed!</h1>
          <p className="mt-2 text-green-100 text-lg">Your tickets are ready for the show.</p>
        </div>

        <div className="p-8">
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 relative">
            {/* Ticket Cut-outs */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-white rounded-full -translate-y-1/2 border-r-2 border-dashed border-gray-200"></div>
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-white rounded-full -translate-y-1/2 border-l-2 border-dashed border-gray-200"></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Event</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                    <p className="text-sm font-semibold text-gray-700">{new Date(event.startAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Venue</p>
                    <p className="text-sm font-semibold text-gray-700">{event.venue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Seats</p>
                    <p className="text-sm font-semibold text-indigo-600">{ticket.seatIds?.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                    <p className="text-sm font-semibold text-gray-700">Rs. {ticket.totalAmount}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Ticket Code</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-2">
                   {/* QR Code Placeholder */}
                   {/* <svg className="w-24 h-24 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M3 3h4v4H3V3zm0 7h4v4H3v-4zm0 7h4v4H3v-4zm7-14h4v4h-4V3zm0 7h4v4h-4v-4zm0 7h4v4h-4v-4zm7-14h4v4h-4V3zm0 7h4v4h-4v-4z" />
                   </svg> */}
                </div>
                <p className="font-mono font-bold text-lg text-indigo-700">{ticket.ticketCode}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link 
              to="/attendee" 
              className="flex-1 bg-indigo-600 text-white text-center py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
            >
              My Bookings
            </Link>
            <Link 
              to="/" 
              className="flex-1 bg-gray-100 text-gray-800 text-center py-4 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Explore More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-indigo-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Secure Checkout</h1>
        <p className="text-indigo-100 mt-2 italic">Almost there! Complete your payment to get your tickets.</p>
      </div>
      
      <div className="p-8">
        <div className="bg-gray-50 p-6 rounded-2xl mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Order Summary</h3>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              {billDetails.quantity} Tickets
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Base Amount:</span>
              <span>Rs. {billDetails.baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes (GST 18%):</span>
              <span>Rs. {billDetails.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Convenience Fees:</span>
              <span>Rs. {billDetails.convenienceFee.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t flex justify-between text-2xl font-black text-gray-900">
              <span>Total:</span>
              <span className="text-indigo-600">Rs. {billDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center"
            onClick={pay}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processing...
              </>
            ) : (
              `Pay Rs. ${billDetails.totalAmount.toFixed(2)}`
            )}
          </button>
          
          <button 
            type="button" 
            className="w-full text-gray-500 font-bold py-2 hover:text-gray-700 transition cursor-pointer" 
            onClick={() => navigate(-1)}
          >
            Cancel and Go Back
          </button>
        </div>
        
        {/* <div className="mt-8 flex justify-center items-center gap-4 text-gray-400 grayscale opacity-50">
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
        </div> */}
      </div>
    </div>
  );
}
