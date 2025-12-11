import React from "react";
import EmailCard from "../components/EmailCard";

const SpamEmails = () => {
  const spamEmails = [
    { sender: "spam@scam.com", subject: "You've won $1,000,000!", date: "Today, 2:00 PM" },
    { sender: "offers@fakepromo.io", subject: "Get free iPhone now!", date: "Oct 21, 2025" },
    { sender: "noreply@phishing.net", subject: "Verify your account immediately", date: "Oct 20, 2025" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Spam Emails</h2>
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        {spamEmails.map((email, index) => (
          <EmailCard key={index} email={email} />
        ))}
      </div>
    </div>
  );
};

export default SpamEmails;
