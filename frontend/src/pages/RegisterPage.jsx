import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register-request", form);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register-verify", {
        email: form.email,
        otp,
      });
      login(data);
      if (data.user?.role === "organizer" && !data.user?.organizerProfileComplete) {
        navigate("/organizer/profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto my-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-indigo-600 p-8 text-white text-center">
            <h1 className="text-3xl font-black tracking-tight">Verify Email</h1>
            <p className="text-indigo-100 mt-2 font-medium">We've sent a 6-digit code to {form.email}</p>
          </div>
          
          <form onSubmit={verify} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-bold flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Enter Verification Code</label>
              <input
                className="w-full bg-slate-50 border-none rounded-2xl py-5 text-center text-3xl font-black tracking-[1em] focus:ring-2 focus:ring-indigo-500 transition-all text-indigo-600 placeholder:tracking-normal placeholder:text-sm placeholder:font-medium"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <button 
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-1 transition duration-300 disabled:opacity-50 cursor-pointer" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
            
            <button
              type="button"
              className="w-full text-slate-500 font-bold py-2 hover:text-indigo-600 transition cursor-pointer"
              onClick={() => setStep(1)}
            >
              Back to registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-black tracking-tight">Join TicketSpot</h1>
          <p className="text-indigo-100 mt-2 font-medium">Create your account to start booking</p>
        </div>
        
        <form onSubmit={requestOtp} className="p-8 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
              <input
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <p className="mt-2 text-[10px] text-slate-400 leading-tight">
                Must be at least 8 characters with uppercase, lowercase, number and special character.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "attendee" })}
                  className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 cursor-pointer ${
                    form.role === "attendee" 
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  Attendee
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "organizer" })}
                  className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 cursor-pointer ${
                    form.role === "organizer" 
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  Organizer
                </button>
              </div>
            </div>
          </div>

          <button 
            className="w-full bg-indigo-600 text-white py-4 mt-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-1 transition duration-300 disabled:opacity-50 cursor-pointer" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
          
          <p className="text-center text-slate-500 font-medium text-sm pt-2">
            Already have an account?{" "}
            <Link className="text-indigo-600 font-bold hover:underline" to="/login">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
