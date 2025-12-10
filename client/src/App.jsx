import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import SalaryPredictor from './components/SalaryPredictor';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import Dashboard from './components/Dashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">AI Salary & Resume Analyzer</span>
        </div>
        <nav className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/" className="hover:underline">Dashboard</Link>
              <Link to="/salary" className="hover:underline">Salary Predictor</Link>
              <Link to="/resume" className="hover:underline">Resume Analyzer</Link>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link to="/auth" className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm">
              Login / Register
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/auth" element={<AuthPage onAuth={setUser} />} />
          <Route path="/salary" element={<SalaryPredictor />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="bg-slate-900 text-slate-300 text-center text-xs py-4">
        AI-Powered Salary Prediction & Resume Analyzer • Demo project
      </footer>
    </div>
  );
};

export default App;
