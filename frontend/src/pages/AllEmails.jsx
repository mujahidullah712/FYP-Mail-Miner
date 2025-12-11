import React from "react";
import EmailCard from "../components/EmailCard";

const AllEmails = () => {
  const emails = [
    { sender: "professor@university.edu", subject: "Meeting agenda", date: "Today, 5:00 AM" },
    { sender: "student123@college.edu", subject: "Assignment submission", date: "May 16, 2023" },
    { sender: "cse@university.edu", subject: "Course announcement", date: "May 13, 2023" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">All Emails</h2>
      {emails.map((email, index) => (
        <EmailCard key={index} email={email} />
      ))}
    </div>
  );
};

export default AllEmails;
