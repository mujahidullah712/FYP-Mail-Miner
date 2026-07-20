import React, { useEffect, useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  // 🔗 Fetch profile data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
        "http://localhost:5000/api/v1/users/me",
        { withCredentials: true }
);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 p-8">

  {/* Header */}
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex justify-between items-center">
    <h1 className="text-2xl font-bold">Mail Miner Dashboard</h1>

    
  </div>

  {/* CENTERED PROFILE */}
  <div className="flex justify-center items-center">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

      {user ? (
        <>
          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <img
              src={user.image}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md object-cover"
            />
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-800">
            {user.name}
          </h2>

          {/* Email */}
          <p className="text-gray-500 mb-4">
            {user.email}
          </p>

          {/* Divider */}
          <hr className="my-4" />

          {/* Info */}
          <div className="space-y-3 text-gray-700 text-left">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <span>Role: {user.role || "User"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-600" />
              <span>Account Secured</span>
            </div>
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}

    </div>
  </div>
</div>
  );
};

export default Dashboard;