import React, { useState } from 'react';
import { api } from '../api';

const ResumeAnalyzer = () => {
  const [targetRole, setTargetRole] = useState('data scientist');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/resume/analyze', { targetRole, resumeText });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold">Resume Keyword Analyzer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Target Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="data scientist">Data Scientist</option>
              <option value="full stack developer">Full Stack Developer</option>
              <option value="data analyst">Data Analyst</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resume Text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm h-48"
            placeholder="Paste your resume here for analysis..."
          />
        </div>
        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Analyze Resume
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {analysis && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="md:col-span-1 border rounded-lg p-3">
            <h3 className="font-semibold mb-2">Match Score</h3>
            <p className="text-3xl font-bold">{analysis.score}%</p>
            <p className="text-xs text-slate-500 mt-1">
              Based on role-specific keyword coverage
            </p>
          </div>
          <div className="md:col-span-1 border rounded-lg p-3">
            <h3 className="font-semibold mb-2">Matched Keywords</h3>
            <ul className="flex flex-wrap gap-2">
              {analysis.matchedKeywords.map((kw) => (
                <li
                  key={kw}
                  className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs"
                >
                  {kw}
                </li>
              ))}
              {analysis.matchedKeywords.length === 0 && (
                <p className="text-xs text-slate-500">No matches found yet.</p>
              )}
            </ul>
          </div>
          <div className="md:col-span-1 border rounded-lg p-3">
            <h3 className="font-semibold mb-2">Missing Keywords</h3>
            <ul className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((kw) => (
                <li
                  key={kw}
                  className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs"
                >
                  {kw}
                </li>
              ))}
              {analysis.missingKeywords.length === 0 && (
                <p className="text-xs text-slate-500">Great coverage!</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
