import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EmailCard from "../components/EmailCard";
import { getEmailsByScenario } from "../services/api";

const ScenarioView = () => {
  const { id } = useParams();
  const [emails, setEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
         const res = await getEmailsByScenario(id);
         setEmails(res.data);
      } catch(err) {
         console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const totalPages = Math.ceil(emails.length / emailsPerPage);
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 min-h-screen">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
        <Link to="/scenario-manager" className="text-gray-400 hover:text-blue-600 font-semibold transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm">
          ← Output Board
        </Link>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Isolated Match Inbox</h2>
      </div>

      {emails.length === 0 ? (
        <div className="text-center bg-gray-50 py-16 rounded-3xl border border-dashed border-gray-300">
           <h3 className="text-gray-500 font-semibold mb-2 text-lg">No documents passed the threshold yet</h3>
           <p className="text-gray-400 text-sm">The background engine might still be sweeping, or no PDFs matched your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentEmails.map((email) => (
              <EmailCard
                key={email._id || Math.random()}
                email={email}
                highlight={true}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-5 py-2.5 bg-gray-50 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 rounded-xl font-semibold text-gray-600 transition"
              >
                Previous
              </button>
              <span className="text-gray-600 font-bold bg-white border border-gray-100 shadow-sm px-5 py-2.5 rounded-xl">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-5 py-2.5 bg-gray-50 border border-gray-200 disabled:opacity-50 hover:bg-gray-100 rounded-xl font-semibold text-gray-600 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScenarioView;
