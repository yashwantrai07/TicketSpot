import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OrganizerProfilePage from "./pages/OrganizerProfilePage";
import AttendeeDashboard from "./pages/AttendeeDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EventSeatSelectPage from "./pages/EventSeatSelectPage";
import FakePaymentPage from "./pages/FakePaymentPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/organizer/profile"
            element={
              <ProtectedRoute roles={["organizer"]}>
                <OrganizerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee"
            element={
              <ProtectedRoute roles={["attendee"]}>
                <AttendeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer"
            element={
              <ProtectedRoute roles={["organizer"]}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/seats"
            element={
              <ProtectedRoute roles={["attendee"]}>
                <EventSeatSelectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/payment"
            element={
              <ProtectedRoute roles={["attendee"]}>
                <FakePaymentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
