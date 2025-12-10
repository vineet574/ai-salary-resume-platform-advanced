import React, { useEffect, useState } from 'react';
import { api } from '../api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      }
    };
    fetchSummary();
  }, []);

  const bestModelLabel = summary?.modelSummary?.bestModel
    ? summary.modelSummary.bestModel.replace('_', ' ')
    : 'Ensemble';

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-2">Analytics & Model Dashboard</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-xs text-slate-500">Total Salary Predictions</p>
          <p className="text-3xl font-bold">
            {summary ? summary.predictionCount : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-xs text-slate-500">Resume Analyses</p>
          <p className="text-3xl font-bold">
            {summary ? summary.analysisCount : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-xs text-slate-500">Last Ensemble Prediction</p>
          <p className="text-2xl font-bold">
            {summary?.latestPrediction
              ? `₹${Math.round(
                  summary.latestPrediction.result.ensemble
                ).toLocaleString()}`
              : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-xs text-slate-500">Best Performing Model</p>
          <p className="text-lg font-semibold capitalize">
            {bestModelLabel}
          </p>
        </div>
      </div>
      {summary?.modelSummary?.metrics && (
        <div className="bg-white rounded-xl shadow-md p-4 text-sm mt-2">
          <h3 className="font-semibold mb-2">Model RMSE (Test)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(summary.modelSummary.metrics)
              .filter(([name]) => name !== 'best_model')
              .map(([name, m]) => (
                <div key={name} className="border rounded-lg p-3">
                  <p className="text-xs text-slate-500 capitalize mb-1">
                    {name.replace('_', ' ')}
                  </p>
                  <p className="text-lg font-semibold">
                    {m.rmse_test?.toFixed(0)} RMSE
                  </p>
                  <p className="text-[11px] text-slate-500">
                    CV RMSE: {m.rmse_cv_mean?.toFixed(0)} ±{' '}
                    {m.rmse_cv_std?.toFixed(0)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md p-4 text-sm">
        <h3 className="font-semibold mb-2">How this platform stands out</h3>
        <p className="text-slate-600 mb-1">
          • Salary predictions use an ensemble of tuned models (Linear Regression, Random Forest,
          Gradient Boosting) with cross-validation and automatic best-model selection.
        </p>
        <p className="text-slate-600 mb-1">
          • Resume analysis computes a weighted, role-specific skill match score so you can see
          exactly which skills are missing for your target job.
        </p>
        <p className="text-slate-600">
          • All ML capabilities are exposed securely via a JWT-protected REST API and visualized
          through a modern React + Tailwind dashboard.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
