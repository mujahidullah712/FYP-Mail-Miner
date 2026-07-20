import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  const displayName =
    user?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Professor";

  const profileImage =
    user?.picture ||
    user?.photo ||
    user?.avatar ||
    user?.profileImage ||
    "";

  return (
    <div className="bg-white rounded-3xl shadow-md px-8 py-6 mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">
        Mail Miner Dashboard
      </h1>

      <div className="flex items-center gap-3">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <FaUserCircle className="text-4xl text-gray-500" />
        )}

        <span className="font-semibold text-gray-800">
          {displayName}
        </span>
      </div>
    </div>
  );
};

export default Topbar;  