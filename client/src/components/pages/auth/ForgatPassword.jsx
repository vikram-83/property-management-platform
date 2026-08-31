import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Shield, AlertCircle } from 'lucide-react';

export default function ForgatPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid registered email address');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4 sm:p-6 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
          <p className="text-sm text-slate-500">
            Enter your email to receive a password reset verification link and token.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base">Reset Instructions Sent!</h3>
              <p className="text-xs text-emerald-700">
                We've sent a 6-digit recovery code and link to <strong>{email}</strong>.
              </p>
            </div>

            <button
              onClick={() => navigate('/reset-password?email=' + encodeURIComponent(email))}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md"
            >
              Continue to Reset Password
            </button>

            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="manager@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}
