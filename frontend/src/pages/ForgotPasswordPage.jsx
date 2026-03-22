import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("If this email exists, an OTP was sent (check console if SMTP not configured).");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setMessage("Password updated. You can login now.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  if (step === 3) {
    return (
      <div className="mx-auto max-w-md rounded bg-white p-6 shadow">
        <p className="text-green-700">{message}</p>
        <Link className="mt-4 block text-indigo-600" to="/login">
          Go to login
        </Link>
      </div>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={reset} className="mx-auto max-w-md space-y-3 rounded bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-gray-600">{message}</p>
        <input
          className="w-full rounded border p-2"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          className="w-full rounded border p-2"
          type="password"
          placeholder="New password (same rules as register)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-indigo-600 p-2 text-white" type="submit">
          Update password
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={sendOtp} className="mx-auto max-w-md space-y-3 rounded bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Forgot password</h1>
      <input
        className="w-full rounded border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="w-full rounded bg-indigo-600 p-2 text-white" type="submit">
        Send OTP
      </button>
      <Link className="block text-center text-sm text-indigo-600" to="/login">
        Back to login
      </Link>
    </form>
  );
}
