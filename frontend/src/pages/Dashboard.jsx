import React from "react";
import { useNavigate } from "react-router-dom"; 
import EmailCard from "../components/EmailCard";
import { User, Mail, Lock } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate(); 

  const importantEmails = [
    { sender: "companyhr@techcorp.com", subject: "Internship opportunity for CS students", matched: "Internship", date: "Today, 10:24" },
    { sender: "hr@startup.com", subject: "Graduate recruiting", matched: "Recruiter", date: "May 17, 2023" },
    { sender: "recruiter@agency.org", subject: "Invitation to interview", matched: "GPA ≥ 3.5", date: "May 16, 2023" },
  ];

  const allEmails = [
    { sender: "professor@university.edu", subject: "Meeting agenda", date: "Today, 5:00 AM" },
    { sender: "student123@college.edu", subject: "Assignment submission", date: "May 16, 2023" },
    { sender: "cse@university.edu", subject: "Course announcement", date: "May 13, 2023" },
  ];

  const remainingEmails = [
    { sender: "support@jobportal.com", subject: "Application status update", date: "May 10, 2023" },
    { sender: "info@eventhub.org", subject: "Upcoming tech seminar invite", date: "May 8, 2023" },
    { sender: "no-reply@newsletter.com", subject: "Weekly newsletter", date: "May 6, 2023" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100">

      <div className="grid grid-cols-3 gap-6 px-8 pb-8">
        {/* Left column */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Important Emails</h2>
            {importantEmails.map((email, index) => (
              <EmailCard key={index} email={email} highlight />
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">All Emails</h2>
            {allEmails.map((email, index) => (
              <EmailCard key={index} email={email} />
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Remaining Emails</h2>
            {remainingEmails.map((email, index) => (
              <EmailCard key={index} email={email} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Scenario Manager</h3>
            <p className="text-sm text-gray-600 mb-3">
              Create or edit scenarios to automatically filter emails.
            </p>
            <input
              type="text"
              placeholder="Internship emails"
              className="w-full border p-2 rounded mb-2"
            />
            <textarea
              placeholder="Internship, recruiter, CV, GPA = 3.5"
              className="w-full border p-2 rounded mb-3"
            />
            <button className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700">
              Save Scenario
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Settings</h3>
            <ul className="text-gray-700 space-y-3">
              <li
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
                onClick={() => navigate("/profile")}
              >
                <User className="w-5 h-5  text-blue-600" /> Profile
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 ml-2 text-green-600" /> Gmail Connect
              </li>
              <li className="flex items-center gap-3 ">
                <Lock className="w-5 h-5 ml-2 text-red-600" /> Security
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
