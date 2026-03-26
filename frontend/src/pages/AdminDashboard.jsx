import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [pendingRes, usersRes, reportRes] = await Promise.all([
        api.get("/admin/events/pending"),
        api.get("/admin/users"),
        api.get("/admin/reports/bookings"),
      ]);
      setPendingEvents(pendingRes.data);
      setUsers(usersRes.data);
      setReport(reportRes.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (eventId, approvalStatus) => {
    try {
      await api.patch(`/admin/events/${eventId}/approval`, { approvalStatus });
      setMessage(`Success: Event ${approvalStatus}`);
      setTimeout(() => setMessage(""), 3000);
      load();
    } catch (err) {
      setMessage("Error: Failed to update status");
    }
  };

  const toggleUser = async (userId, status) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
      load();
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor platform health and manage resources</p>
        </div>
        {message && (
          <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold border border-indigo-100 animate-pulse">
            {message}
          </div>
        )}
      </header>

      {report && (
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: "Total Users", value: report.totalUsers, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "bg-blue-500" },
            { label: "Total Events", value: report.totalEvents, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-purple-500" },
            { label: "Bookings", value: report.totalBookings, icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z", color: "bg-green-500" },
            { label: "Revenue", value: `Rs. ${report.totalRevenue}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-amber-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center group hover:shadow-md transition">
              <div className={`${stat.color} p-4 rounded-2xl text-white mr-4 shadow-lg shadow-opacity-20`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            Pending Approvals
            <span className="ml-3 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-black">
              {pendingEvents.length}
            </span>
          </h2>
          
          {pendingEvents.length === 0 && (
            <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
              <p className="text-slate-400 font-medium">All events are reviewed!</p>
            </div>
          )}

          <div className="space-y-4">
            {pendingEvents.map((event) => (
              <article key={event._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Organizer: {event.organizerId?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600">Rs. {event.price}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{event.category}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100 cursor-pointer"
                    onClick={() => approve(event._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-100 transition cursor-pointer"
                    onClick={() => approve(event._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            User Management
            <span className="ml-3 bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full font-black">
              {users.length}
            </span>
          </h2>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {users.map((u) => (
                <div key={u._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mr-4 ${
                      u.role === "admin" ? "bg-purple-100 text-purple-700" : 
                      u.role === "organizer" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {u.role} &bull; <span className={u.status === "active" ? "text-green-500" : "text-red-500"}>{u.status}</span>
                      </p>
                    </div>
                  </div>
                  
                  {u.role !== "admin" && (
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer ${
                        u.status === "active" 
                          ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                      }`}
                      onClick={() => toggleUser(u._id, u.status === "active" ? "blocked" : "active")}
                    >
                      {u.status === "active" ? "Block" : "Activate"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
