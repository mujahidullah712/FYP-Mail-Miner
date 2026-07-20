import React from "react";
import { Mail, Clock, Link as LinkIcon } from "lucide-react";

const EmailCard = ({ email, highlight }) => {
  return (
    <div className={`relative flex flex-col justify-between p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${highlight ? 'bg-gradient-to-br from-indigo-50 to-blue-50/50 border-blue-200' : 'bg-white border-gray-100 hover:border-blue-100'} group overflow-hidden`}>
      {/* Decorative gradient blur in background */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all pointer-events-none"></div>

      {/* Top Section */}
      <div className="z-10">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${highlight ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'} transition-colors shadow-sm`}>
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-gray-800 line-clamp-1 truncate text-sm">
              {email.from || email.sender}
            </h3>
          </div>
          {email.matchedScenarios && email.matchedScenarios.length > 0 && (
            <div className="flex gap-1 overflow-hidden z-20 absolute top-4 right-4">
               {email.matchedScenarios.map((s, i) => (
                  <span key={i} className="shrink-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                    {s.name}
                  </span>
               ))}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-[15px] font-medium line-clamp-2 mt-2 leading-relaxed">
          {email.subject}
        </p>

        {/* Attachments Rendering Logic */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {email.attachments.map((file, idx) => (
              <a
                key={idx}
                href={`http://localhost:5000/uploads/attachments/${email.messageId}-${file.filename}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-blue-50/80 hover:bg-blue-500 hover:text-white border border-blue-100 hover:border-blue-500 text-blue-700 text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm whitespace-nowrap max-w-full"
              >
                <LinkIcon className="w-3 h-3 shrink-0" />
                <span className="truncate">{file.filename}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-5 pt-3 flex justify-between items-center text-xs text-gray-400 font-medium z-10">
        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <Clock className="w-3.5 h-3.5" />
          <span>{email.createdAt ? new Date(email.createdAt).toLocaleDateString() : email.date}</span>
        </div>
      </div>
    </div>
  );
};

export default EmailCard;
