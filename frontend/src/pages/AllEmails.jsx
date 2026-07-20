import React, { useEffect, useState } from "react";
import EmailCard from "../components/EmailCard";
import { getAllEmails } from "../services/api";

const AllEmails = () => {
  const [emails, setEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllEmails();
      setEmails(res.data);
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(emails.length / emailsPerPage);
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">All Emails</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentEmails.map((email) => (
          <EmailCard
            key={email._id || email.messageId || Math.random()}
            email={email}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-100 disabled:opacity-50 hover:bg-gray-200 rounded font-semibold text-gray-700"
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-100 disabled:opacity-50 hover:bg-gray-200 rounded font-semibold text-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllEmails;