import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaEnvelope, FaCogs, FaSignOutAlt, FaList, FaHome, FaInbox } from "react-icons/fa";

const Sidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "All Emails", path: "/all-emails", icon: <FaEnvelope /> },
    { name: "Important Emails", path: "/important-emails", icon: <FaInbox /> },
    { name: "Remaining Emails", path: "/remaining-emails", icon: <FaList /> },
    { name: "Spam Emails", path: "/spam-emails", icon: <FaInbox /> },
    { name: "Scenario Manager", path: "/scenario-manager", icon: <FaCogs /> },
    { name: "Settings", path: "/settings", icon: <FaCogs /> },

  ];

  return (
    <div className="w-64 bg-gray-100 shadow-lg p-6 flex flex-col justify-between min-h-screen border-r border-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-blue-600 mb-8 tracking-wide">Mail Miner</h1>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                  pathname === item.path
                    ? "bg-blue-200 text-blue-800 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button className="flex items-center gap-3 text-red-500 hover:text-red-600 mt-6">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
