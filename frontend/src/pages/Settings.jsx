import React from "react";
import { User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const Settings = () => {
  const navigate = useNavigate(); 

  const settings = [
    { name: "Profile", icon: <User className="w-5 h-5 text-blue-600" />, path: "/profile" }, 
    { name: "Gmail Connect", icon: <Mail className="w-5 h-5 text-green-600" /> },
    { name: "Security", icon: <Lock className="w-5 h-5 text-red-600" /> },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-md">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <ul className="space-y-3">
        {settings.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer"
            onClick={() => item.path && navigate(item.path)} 
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Settings;
