import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Shield, Send, AlertCircle, KeyRound, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(cleanEmail);
      setSubmitted(true);
      if (res.reset_url) {
        setResetUrl(res.reset_url);
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.detail || err.message || 'Unable to generate password reset request.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-6 bg-[#07140F]">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-green-500/30 shadow-2xl space-y-6">
        
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center mx-auto shadow-lg glow-emerald">
            <KeyRound className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Forgot Password</h2>
          <p className="text-xs text-slate-400">
            Enter your registered email address to receive password recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-white">Reset Link Dispatched!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A secure password reset link has been generated for{' '}
              <strong className="text-emerald-400 block font-mono mt-1">{email}</strong>
            </p>

            {resetUrl && (
              <div className="pt-2">
                <button
                  onClick={() => navigate(resetUrl)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Set New Password</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/login"
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Verifying Account...' : 'Send Password Reset Link'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
