import React from "react";
import { User, Mail, Settings, Edit } from "lucide-react";

const Profile = () => {
  const professor = {
    name: "Prof.Dr Razaullah",
    email: "professor@mailminer.edu",
    department: "Computer Science",
    joined: "November 2025",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", 
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-6">
        <img
          src={professor.image}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-blue-500 shadow"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{professor.name}</h2>
          <p className="text-gray-500">{professor.department}</p>
          <p className="text-gray-400 text-sm">Joined {professor.joined}</p>
        </div>
        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Edit className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <hr className="my-6" />

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <Mail className="w-5 h-5 text-blue-600" />
          <span>{professor.email}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Settings className="w-5 h-5 text-green-600" />
          <span>Account Settings</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <User className="w-5 h-5 text-purple-600" />
          <span>Role: Professor</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
