import React from "react";

const ScenarioManager = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-lg">
      <h2 className="text-lg font-semibold mb-2">Scenario Manager</h2>
      <p className="text-gray-600 mb-3 text-sm">Create or edit scenarios to automatically filter emails.</p>
      <input type="text" placeholder="Internship emails" className="border w-full p-2 rounded mb-2" />
      <textarea placeholder="Internship, recruiter, CV, GPA = 3.5" className="border w-full p-2 rounded mb-3" />
      <button className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700">
        Save Scenario
      </button>
    </div>
  );
};

export default ScenarioManager;
