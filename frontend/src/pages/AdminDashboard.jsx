import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [pendingRes, usersRes, reportRes] = await Promise.all([
      api.get("/admin/events/pending"),
      api.get("/admin/users"),
      api.get("/admin/reports/bookings"),
    ]);
    setPendingEvents(pendingRes.data);
    setUsers(usersRes.data);
    setReport(reportRes.data);
  };

  useEffect(() => {
    Promise.all([
      api.get("/admin/events/pending"),
      api.get("/admin/users"),
      api.get("/admin/reports/bookings"),
    ]).then(([pendingRes, usersRes, reportRes]) => {
      setPendingEvents(pendingRes.data);
      setUsers(usersRes.data);
      setReport(reportRes.data);
    });
  }, []);

  const approve = async (eventId, approvalStatus) => {
    await api.patch(`/admin/events/${eventId}/approval`, { approvalStatus });
    setMessage(`Event ${approvalStatus}`);
    load();
  };

  const toggleUser = async (userId, status) => {
    await api.patch(`/admin/users/${userId}/status`, { status });
    load();
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {message && <p className="text-sm text-indigo-700">{message}</p>}

      {report && (
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded bg-white p-3 shadow">Users: {report.totalUsers}</div>
          <div className="rounded bg-white p-3 shadow">Events: {report.totalEvents}</div>
          <div className="rounded bg-white p-3 shadow">Bookings: {report.totalBookings}</div>
          <div className="rounded bg-white p-3 shadow">Revenue: Rs. {report.totalRevenue}</div>
        </div>
      )}

      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-2 text-lg font-semibold">Pending Events</h2>
        {pendingEvents.length === 0 && <p>No pending events.</p>}
        {pendingEvents.map((event) => (
          <article key={event._id} className="mb-3 rounded border p-3">
            <h3 className="font-semibold">{event.title}</h3>
            <p>Organizer: {event.organizerId?.name}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-green-600 px-3 py-1 text-white"
                onClick={() => approve(event._id, "approved")}
              >
                Approve
              </button>
              <button
                className="rounded bg-red-600 px-3 py-1 text-white"
                onClick={() => approve(event._id, "rejected")}
              >
                Reject
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-2 text-lg font-semibold">User Management</h2>
        {users.map((u) => (
          <div key={u._id} className="mb-2 flex items-center justify-between rounded border p-2">
            <span>
              {u.name} ({u.role}) - {u.status}
            </span>
            {u.role !== "admin" && (
              <button
                className="rounded bg-gray-800 px-3 py-1 text-white"
                onClick={() => toggleUser(u._id, u.status === "active" ? "blocked" : "active")}
              >
                {u.status === "active" ? "Block" : "Activate"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
