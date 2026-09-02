'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, auth } from '../../lib/api';

export default function SignIn() {
  const [email, setEmail] = useState('student@eventiq.demo');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function goLogin(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
      const x = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      auth.set(x);
      location.href = x.user.role === 'organizer' ? '/organizer' : '/dashboard';
    } catch (x) {
      setError(x.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  async function goResetPassword(e) {
    e.preventDefault();
    setError('');
    setMsg('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: resetEmail, newPassword })
      });
      setMsg(res.message || 'Password reset successfully!');
      setEmail(resetEmail);
      setPassword(newPassword);
      setIsResetMode(false);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-5 bg-soft">
      {isResetMode ? (
        <form onSubmit={goResetPassword} className="card p-8 w-full max-w-md">
          <div className="text-brand font-black text-xl">✦ EventIQ</div>
          <h1 className="text-2xl font-black mt-6">Reset Password 🔒</h1>
          <p className="muted text-sm mt-1">Enter your registered email and a new password below.</p>

          <label className="text-xs font-bold muted uppercase block mt-6">Registered Email</label>
          <input
            className="input mt-1"
            type="email"
            required
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <label className="text-xs font-bold muted uppercase block mt-3">New Password</label>
          <input
            className="input mt-1"
            type="password"
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password"
          />

          <label className="text-xs font-bold muted uppercase block mt-3">Confirm New Password</label>
          <input
            className="input mt-1"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />

          {error && <p className="text-red-600 text-sm mt-3 font-bold">{error}</p>}

          <button className="btn btn-primary w-full mt-5" disabled={loading}>
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>

          <button
            type="button"
            className="text-xs text-center block w-full mt-4 text-brand font-bold"
            onClick={() => {
              setIsResetMode(false);
              setError('');
            }}
          >
            ← Back to Sign In
          </button>
        </form>
      ) : (
        <form onSubmit={goLogin} className="card p-8 w-full max-w-md">
          <div className="text-brand font-black text-xl">✦ EventIQ</div>
          <h1 className="text-3xl font-black mt-8">Welcome back 👋</h1>
          <p className="muted mt-2">Sign in to continue to EventIQ.</p>

          {msg && <p className="text-green-700 text-sm font-bold mt-4 p-3 bg-green-50 rounded-xl">{msg}</p>}

          <label className="text-xs font-bold muted uppercase block mt-6">Email</label>
          <input
            className="input mt-1"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />

          <div className="flex justify-between items-center mt-3">
            <label className="text-xs font-bold muted uppercase">Password</label>
            <button
              type="button"
              className="text-xs text-brand font-bold hover:underline"
              onClick={() => {
                setResetEmail(email);
                setIsResetMode(true);
                setError('');
                setMsg('');
              }}
            >
              Forgot password?
            </button>
          </div>
          <input
            className="input mt-1"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />

          {error && <p className="text-red-600 text-sm mt-3 font-bold">{error}</p>}

          <button className="btn btn-primary w-full mt-5" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-xs text-center mt-4 muted">Demo: student@eventiq.demo / student123</p>
          <p className="text-sm text-center mt-4">
            Don't have an account?{' '}
            <Link className="text-brand font-bold" href="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      )}
    </main>
  );
}
