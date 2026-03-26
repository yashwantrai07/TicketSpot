import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                {/* <div className="bg-indigo-600 p-2 rounded-xl mr-3 group-hover:rotate-6 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div> */}
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Ticket<span className="text-indigo-600 group-hover:text-slate-900">Spot</span>
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider">
                Explore
              </Link>
              {!user && (
                <>
                  <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Get Started
                  </Link>
                </>
              )}
              
              {user?.role === "attendee" && (
                <Link to="/attendee" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Tickets
                </Link>
              )}
              
              {user?.role === "organizer" && (
                <Link to="/organizer" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Dashboard
                </Link>
              )}
              
              {user?.role === "admin" && (
                <Link to="/admin" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin
                </Link>
              )}

              {user && (
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-500 hidden lg:block">
                      {user.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-slate-100 p-2 rounded-lg mr-2 grayscale opacity-50">
              {/* <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg> */}
            </div>
            <span className="text-xl font-black tracking-tight text-slate-400">TicketSpot</span>
          </div>
          <div className="flex justify-center space-x-6 mt-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest">Terms</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
