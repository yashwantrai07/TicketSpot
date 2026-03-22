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
    try {
      await api.patch("/auth/organizer-profile", { panNumber: panNumber.trim().toUpperCase(), upiId: upiId.trim() });
      await refreshUser();
      setMessage("Profile saved. You can list events now.");
      setTimeout(() => navigate("/organizer"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Complete organizer profile</h1>
      <p className="text-sm text-gray-600">
        PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F). Required before listing events.
      </p>
      <input
        className="w-full rounded border p-2 font-mono uppercase"
        placeholder="PAN"
        value={panNumber}
        onChange={(e) => setPanNumber(e.target.value)}
        maxLength={10}
      />
      <input
        className="w-full rounded border p-2"
        placeholder="UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}
      <button className="w-full rounded bg-indigo-600 p-2 text-white" type="submit">
        Save
      </button>
    </form>
  );
}
