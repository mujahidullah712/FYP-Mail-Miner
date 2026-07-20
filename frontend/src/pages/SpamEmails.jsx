import React, { useEffect, useState } from "react";
import EmailCard from "../components/EmailCard";
import { getSpamEmails } from "../services/api";

const SpamEmails = () => {
  const [emails, setEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSpamEmails();
      setEmails(res.data);
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(emails.length / emailsPerPage);
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Spam Emails
      </h2>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentEmails.map((email) => (
          <EmailCard
            key={email._id || Math.random()}
            email={email}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-white shadow hover:bg-gray-50 disabled:opacity-50 rounded font-semibold text-gray-700"
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-white shadow hover:bg-gray-50 disabled:opacity-50 rounded font-semibold text-gray-700"
          >
            Next
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default SpamEmails;