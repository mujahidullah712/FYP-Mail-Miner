import React from "react";
import EmailCard from "../components/EmailCard";

const RemainingEmails = () => {
  const remainingEmails = [
    { sender: "newsletter@codingtips.io", subject: "Top 10 React Practices You Should Know", date: "Oct 9, 2025" },
    { sender: "projectlead@company.com", subject: "Weekly Team Update", date: "Oct 8, 2025" },
    { sender: "offers@shopnow.pk", subject: "Exclusive Discount — Limited Time Only!", date: "Oct 7, 2025" },
    { sender: "classroom@university.edu", subject: "Lab Schedule for Next Week", date: "Oct 5, 2025" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Remaining Emails</h2>
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        {remainingEmails.map((email, index) => (
          <EmailCard key={index} email={email} />
        ))}
      </div>
    </div>
  );
};

export default RemainingEmails;
