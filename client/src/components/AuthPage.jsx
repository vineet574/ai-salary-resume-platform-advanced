import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ onAuth }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'register') {
        await api.post('/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password
        });
      }
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onAuth(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        {mode === 'login' ? 'Login' : 'Create an account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded text-sm font-medium"
        >
          {mode === 'login' ? 'Login' : 'Register & Login'}
        </button>
      </form>
      <p className="text-xs text-slate-600 mt-3 text-center">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('register')}
              className="text-slate-900 underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-slate-900 underline"
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthPage;
