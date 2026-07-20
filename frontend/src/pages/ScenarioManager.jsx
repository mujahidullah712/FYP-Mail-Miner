import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createScenario, getAllScenarios } from "../services/api";

const ScenarioManager = () => {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await getAllScenarios();

      if (res.data.success) {
        setScenarios(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch scenarios", err);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !keywords.trim()) return;

    setLoading(true);

    try {
      const res = await createScenario({
        name: name.trim(),
        keywords: keywords.trim(),
      });

      setName("");
      setKeywords("");

      if (res.data.success) {
        // Show only the latest deployed scenario
        setScenarios([res.data.data]);
      } else {
        fetchScenarios();
      }
    } catch (err) {
      console.error("Failed to save scenario", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Target Scenario Builder
      </h2>

      {/* Create Box */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 max-w-xl mb-10">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Deploy Semantic Matcher
        </h3>

        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          The sweeping engine will automatically slice raw text from any email
          body and extract `.pdf` binaries to probabilistically match your
          keywords!
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="E.g. Engineering Internships"
          className="w-full p-3.5 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
        />

        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Keywords (comma separated): python, CV, GPA > 3.0"
          rows={3}
          className="w-full p-3.5 rounded-xl border border-gray-200 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
        />

        <button
          onClick={handleSave}
          disabled={loading || !name.trim() || !keywords.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white w-full py-3.5 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all hover:-translate-y-0.5"
        >
          {loading ? "Scanning Document Cache..." : "Deploy Scenario Sweep"}
        </button>
      </div>

      {/* Render Scenarios */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Active Scanning Engines
      </h3>

      {scenarios.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No active scenario deployed yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scenarios.map((s) => (
            <Link
              to={`/scenarios/${s._id}`}
              key={s._id}
              className="block bg-white p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-gray-800 break-words group-hover:text-blue-600 transition-colors">
                  {s.name}
                </h4>

                <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider bg-blue-50 group-hover:bg-blue-100 text-blue-600 px-2 py-1 rounded-full transition-colors">
                  {s.keywords.length} Triggers
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {s.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-md"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;