import React, { useState } from 'react';
import { api } from '../api';

const SalaryPredictor = () => {
  const [form, setForm] = useState({
    years_experience: 0,
    education_level: 1,
    role_level: 0,
    company_size: 1,
    model: 'ensemble'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'model' ? value : Number(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { ...form };
      if (payload.model === 'ensemble') {
        delete payload.model;
      }
      const res = await api.post('/ml/salary', payload);
      setResult(res.data.prediction.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get prediction');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold">Advanced Salary Prediction</h2>
      <p className="text-xs text-slate-500 mb-2">
        Powered by Linear Regression, Random Forest & Gradient Boosting with cross-validation.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Years of Experience</label>
          <input
            type="number"
            name="years_experience"
            value={form.years_experience}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            min="0"
            max="40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Education Level</label>
          <select
            name="education_level"
            value={form.education_level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value={0}>High School</option>
            <option value={1}>Bachelors</option>
            <option value={2}>Masters / PhD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role Level</label>
          <select
            name="role_level"
            value={form.role_level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value={0}>Junior</option>
            <option value={1}>Mid</option>
            <option value={2}>Senior</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Size</label>
          <select
            name="company_size"
            value={form.company_size}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value={0}>Startup</option>
            <option value={1}>SME</option>
            <option value={2}>MNC</option>
            <option value={3}>Big Tech / FAANG</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Model</label>
          <select
            name="model"
            value={form.model}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="ensemble">Ensemble (Recommended)</option>
            <option value="linear_regression">Linear Regression</option>
            <option value="random_forest">Random Forest</option>
            <option value="gradient_boosting">Gradient Boosting</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Predict Salary
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="border rounded-lg p-4 md:col-span-2">
            <h3 className="font-semibold mb-2">Model-wise Predictions</h3>
            <ul className="space-y-1">
              {Object.entries(result.per_model).map(([name, value]) => (
                <li key={name} className="flex justify-between">
                  <span className="capitalize">
                    {name.replace('_', ' ')}{' '}
                    {result.active_model === name && (
                      <span className="text-[10px] px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded-full ml-1">
                        best
                      </span>
                    )}
                  </span>
                  <span>₹{Math.round(value).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-1">Recommended Prediction</h3>
            <p className="text-2xl font-bold">
              ₹{Math.round(result.active_prediction || result.ensemble).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 text-center">
              Uses the best model (by RMSE) if metrics are available, otherwise the ensemble.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPredictor;
