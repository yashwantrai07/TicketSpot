import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            TicketSpot
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/">Events</Link>
            {!user && <Link to="/login">Login</Link>}
            {!user && <Link to="/register">Register</Link>}
            {user?.role === "attendee" && <Link to="/attendee">My Dashboard</Link>}
            {user?.role === "organizer" && <Link to="/organizer">Organizer Dashboard</Link>}
            {user?.role === "organizer" && !user?.organizerProfileComplete && (
              <Link className="font-bold text-amber-700" to="/organizer/profile">
                Complete profile
              </Link>
            )}
            {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            {user && (
              <>
                <span className="rounded bg-gray-100 px-2 py-1">
                  {user.name} ({user.role})
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
