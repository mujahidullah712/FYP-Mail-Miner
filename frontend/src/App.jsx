import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import AllEmails from "./pages/AllEmails";
import ImportantEmails from "./pages/ImportantEmails";
import RemainingEmails from "./pages/RemainingEmails";
import ScenarioManager from "./pages/ScenarioManager";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SpamEmails from "./pages/SpamEmails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                <Topbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/all-emails" element={<AllEmails />} />
                  <Route path="/important-emails" element={<ImportantEmails />} />
                  <Route path="/remaining-emails" element={<RemainingEmails />} />
                  <Route path="/spam-emails" element={<SpamEmails />} />
                  <Route path="/scenario-manager" element={<ScenarioManager />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />

                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
