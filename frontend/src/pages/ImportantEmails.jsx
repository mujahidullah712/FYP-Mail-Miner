import React from "react";
import EmailCard from "../components/EmailCard";

const ImportantEmails = () => {
  const importantEmails = [
    { sender: "hr@techfirm.com", subject: "Internship Offer for Summer 2025", matched: "Internship", date: "Today, 10:24 AM" },
    { sender: "careers@startuphub.io", subject: "Exciting Job Opportunities Await!", matched: "Recruitment", date: "Oct 10, 2025" },
    { sender: "scholarship@edu.org", subject: "Scholarship Result Announcement", matched: "Academic", date: "Oct 8, 2025" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Important Emails</h2>
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        {importantEmails.map((email, index) => (
          <EmailCard key={index} email={email} highlight />
        ))}
      </div>
    </div>
  );
};

export default ImportantEmails;
