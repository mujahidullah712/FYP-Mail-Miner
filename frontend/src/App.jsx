import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import AllEmails from "./pages/AllEmails";
import ImportantEmails from "./pages/ImportantEmails";
import RemainingEmails from "./pages/RemainingEmails";
import ScenarioManager from "./pages/ScenarioManager";
import ScenarioView from "./pages/ScenarioView";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SpamEmails from "./pages/SpamEmails";

/* ---------- Protected Route ---------- */
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/auth/logout', {}, { withCredentials: true });
    } catch(err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId="131683360939-l3tv520mfkhdbb62rukvdfgq3cbi85l3.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute user={user}>
                <div className="flex">
                  <Sidebar handleLogout={handleLogout} />
                  <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                    <Topbar />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/all-emails" element={<AllEmails />} />
                      <Route path="/important-emails" element={<ImportantEmails />} />
                      <Route path="/remaining-emails" element={<RemainingEmails />} />
                      <Route path="/spam-emails" element={<SpamEmails />} />
                      <Route path="/scenario-manager" element={<ScenarioManager />} />
                      <Route path="/scenarios/:id" element={<ScenarioView />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;