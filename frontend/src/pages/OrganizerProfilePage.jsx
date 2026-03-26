import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function OrganizerProfilePage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [panNumber, setPanNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (data.user?.panNumber) setPanNumber(data.user.panNumber);
        if (data.user?.upiId) setUpiId(data.user.upiId);
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.patch("/auth/organizer-profile", { panNumber: panNumber.trim().toUpperCase(), upiId: upiId.trim() });
      await refreshUser();
      setMessage("Success: Profile saved. Redirecting...");
      setTimeout(() => navigate("/organizer"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-black">Organizer Profile</h1>
          <p className="text-indigo-100 mt-2 font-medium">Verify your identity to list events</p>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <p className="text-xs text-indigo-700 font-bold leading-relaxed uppercase tracking-wider">
              Verification Required
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              PAN format: 5 letters, 4 digits, 1 letter. Required for secure payouts.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">PAN Number</label>
              <input
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-500 transition-all font-mono uppercase text-slate-700 font-bold"
                placeholder="Enter your pan card number"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">UPI ID</label>
              <input
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                placeholder="Enter your upi id"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}
          
          {message && (
            <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 animate-pulse">
              {message}
            </div>
          )}

          <button 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-1 transition duration-300 disabled:opacity-50 cursor-pointer" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
          
          <button
            type="button"
            className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition cursor-pointer"
            onClick={() => navigate("/organizer")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
