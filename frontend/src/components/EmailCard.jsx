import React from "react";

const EmailCard = ({ email, highlight }) => {
  return (
    <div className="flex justify-between items-start border-b py-3">
      <div>
        <p className="font-medium text-gray-800">{email.sender}</p>
        <p className="text-gray-600 text-sm">{email.subject}</p>
        {highlight && (
          <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mt-1">
            Matched: {email.matched}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm">{email.date}</p>
    </div>
  );
};

export default EmailCard;
