import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register-request", form);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP");
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
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
    }
  };

  if (step === 2) {
    return (
      <form onSubmit={verify} className="mx-auto max-w-md space-y-3 rounded bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Enter OTP</h1>
        <p className="text-sm text-gray-600">We sent a code to {form.email}</p>
        <input
          className="w-full rounded border p-2"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-indigo-600 p-2 text-white" type="submit">
          Verify &amp; Create account
        </button>
        <button
          type="button"
          className="w-full text-sm text-indigo-600"
          onClick={() => setStep(1)}
        >
          Back
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={requestOtp} className="mx-auto max-w-md space-y-3 rounded bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Register</h1>
      <p className="text-xs text-gray-500">
        Password: min 8 chars, uppercase, lowercase, number, special character.
      </p>
      <input
        className="w-full rounded border p-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        className="w-full rounded border p-2"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        className="w-full rounded border p-2"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <select
        className="w-full rounded border p-2"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="w-full rounded bg-indigo-600 p-2 text-white" type="submit">
        Send OTP
      </button>
    </form>
  );
}
