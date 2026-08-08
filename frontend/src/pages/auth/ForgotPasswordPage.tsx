import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Shield, Send, AlertCircle } from 'lucide-react';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { resetPassword, isLoading } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email) return;

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send reset link.');
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
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset Your Password</h2>
          <p className="text-xs text-slate-400">Enter your account email to receive Supabase recovery instructions</p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Reset Link Dispatched!</h3>
            <p className="text-xs text-slate-300">
              We have sent password recovery instructions to <strong className="text-emerald-400">{email}</strong>.
            </p>
            <Link
              to="/reset-password"
              className="inline-block pt-2 text-xs font-bold text-emerald-400 underline"
            >
              Proceed to Reset Password Page →
            </Link>
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
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none"
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
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Dispatching Link...' : 'Send Supabase Reset Link'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
