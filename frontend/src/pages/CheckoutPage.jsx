import { useLocation, useNavigate, useParams, Link } from "react-router-dom";

export default function CheckoutPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { event, seatIds } = location.state || {};

  if (!event || !seatIds?.length) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">No Booking Data</h1>
        <p className="text-gray-600 mb-6">It looks like you haven't selected any seats yet.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition duration-300">
          Browse Events
        </Link>
      </div>
    );
  }

  const quantity = seatIds.length;
  const baseAmount = quantity * event.price;
  const gst = baseAmount * 0.18;
  const convenienceFee = 75;
  const totalAmount = baseAmount + gst + convenienceFee;

  const handleProceedToPayment = () => {
    navigate(`/events/${eventId}/payment`, { 
      state: { 
        event, 
        seatIds,
        billDetails: {
          baseAmount,
          gst,
          convenienceFee,
          totalAmount,
          quantity
        }
      } 
    });
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Checkout Summary</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-indigo-700">{event.title}</h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue}
            </p>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(event.startAt).toLocaleString()}
            </p>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mt-6">Seats</h2>
          <div className="flex flex-wrap gap-2">
            {seatIds.map(id => (
              <span key={id} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                {id}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Bill Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Base Amount (Rs. {event.price} x {quantity})</span>
              <span className="font-semibold">Rs. {baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span className="font-semibold">Rs. {gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Convenience Fee</span>
              <span className="font-semibold">Rs. {convenienceFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold text-gray-900">
              <span>Total Payable</span>
              <span className="text-indigo-700">Rs. {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-300 transition duration-300"
        >
          Go Back
        </button>
        <button 
          onClick={handleProceedToPayment}
          className="flex-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
