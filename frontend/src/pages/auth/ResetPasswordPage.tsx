import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { updateUserPassword, isLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  const hasMinLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passedCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthPercentage = (passedCount / 5) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (passedCount < 5) {
      setErrorMessage('Password does not satisfy all strength requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await updateUserPassword(password);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-6 bg-[#07140F]">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-green-500/30 shadow-2xl space-y-6">
        
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center mx-auto shadow-lg glow-emerald">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Set New Password</h2>
          <p className="text-xs text-slate-400">Choose a strong password with at least 12 characters</p>
        </div>

        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-white">Password Updated Successfully!</h3>
            <p className="text-xs text-slate-300">Your Supabase security credentials have been updated.</p>
            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-bold text-xs uppercase tracking-wider inline-block shadow-lg glow-emerald text-center"
            >
              Sign In with New Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* New Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-[#0E1F18] border border-green-500/20">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Strength:</span>
                    <span className="font-bold text-emerald-400">{strengthPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#07140F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${strengthPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
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
              <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
