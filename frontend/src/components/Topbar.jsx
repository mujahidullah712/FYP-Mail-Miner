import React from "react";
import { useNavigate } from "react-router-dom"; 

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-white px-8 py-4 shadow-sm mb-6 rounded-3xl mt-3">
    
      <h1 className="text-2xl font-semibold text-gray-800">Mail Miner Dashboard</h1>

      <div
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
        onClick={() => navigate("/login")} 
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Professor"
          className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
        />
        <p className="font-medium text-gray-800">Professor</p>
      </div>
    </div>
  );
};

export default Topbar;
