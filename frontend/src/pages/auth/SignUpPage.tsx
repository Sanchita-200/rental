import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, User, Phone, CheckCircle2, XCircle, ArrowRight, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { UserRole } from '../../types/supabase.types';

export const SignUpPage: React.FC = () => {
  const [accountType, setAccountType] = useState<UserRole>('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, isLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  // Password Rules Validation
  const hasMinLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedRulesCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthPercentage = (passedRulesCount / 5) * 100;

  const isPasswordValid = passedRulesCount === 5;
  const isConfirmValid = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must satisfy all 5 security rules.');
      return;
    }

    if (!isConfirmValid) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone,
        role: accountType,
      });

      if (accountType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-stretch bg-[#07140F]">
      
      {/* Left Column: Visual Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0E1F18] via-[#13271F] to-[#07140F] p-12 flex-col justify-between overflow-hidden border-r border-green-500/10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/15 rounded-full blur-3xl animate-blob-1" />
        
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Supabase Profiles Sync
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Join RentFlow AI & Unlock <span className="gradient-emerald-text">Powerful Rental Tools</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Create a Customer or Admin Account to access digital QR passes, automated deposit management, and real-time store counter operations.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Customer & Store Manager Admin Access',
              'Digital QR Pass issued instantly upon booking',
              'Fair automated 1.5x late fee calculation engine',
              '24/7 Smart AI Rental Assistance'
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-4 rounded-2xl glass-panel border border-green-500/20 glow-emerald max-w-md">
          <span className="text-xs font-bold text-white block">Enterprise Security Standard</span>
          <span className="text-[11px] text-slate-300">All customer data and deposit escrow accounts are protected with 256-bit AES encryption.</span>
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-green-500/30 shadow-2xl space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg glow-emerald">
                <Shield className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-base font-black gradient-emerald-text">RentFlow AI</span>
            </div>

            {/* Account Type Selector Tab */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#07140F] border border-green-500/20 rounded-xl">
              <button
                type="button"
                onClick={() => setAccountType('customer')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  accountType === 'customer'
                    ? 'bg-emerald-600 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer Account
              </button>
              <button
                type="button"
                onClick={() => setAccountType('admin')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  accountType === 'admin'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Account
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Create {accountType === 'admin' ? 'Admin / Manager' : 'Customer'} Account
              </h2>
              <p className="text-xs text-slate-400">
                {accountType === 'admin'
                  ? 'Access operational store counter, QR scanners, and analytics'
                  : 'Fill in your information to rent equipment with instant QR passes'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="John"
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Doe"
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field & Strength Indicator */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Password</label>
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
                <div className="space-y-2 p-3 rounded-xl bg-[#0E1F18] border border-green-500/20">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Password Strength:</span>
                    <span
                      className={`font-bold ${
                        strengthPercentage <= 40
                          ? 'text-rose-400'
                          : strengthPercentage <= 80
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {strengthPercentage <= 40 ? 'Weak' : strengthPercentage <= 80 ? 'Good' : 'Strong'}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-[#07140F] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthPercentage <= 40
                          ? 'bg-rose-500'
                          : strengthPercentage <= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${strengthPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                    <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasMinLength ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>12+ Characters</span>
                    </div>

                    <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasUppercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>1 Uppercase Letter</span>
                    </div>

                    <div className={`flex items-center gap-1 ${hasLowercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasLowercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>1 Lowercase Letter</span>
                    </div>

                    <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasNumber ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>1 Number</span>
                    </div>

                    <div className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasSpecial ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>1 Special Character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className={`w-full bg-[#07140F] border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none ${
                  confirmPassword.length > 0 && !isConfirmValid
                    ? 'border-rose-500'
                    : 'border-green-500/20 focus:border-emerald-400'
                }`}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-green-500/30 bg-[#07140F] text-emerald-500 focus:ring-emerald-500/40"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-tight cursor-pointer">
                I agree to the <a href="#" className="text-emerald-400 underline">Terms of Service</a> and <a href="#" className="text-emerald-400 underline">Privacy Policy</a>.
              </label>
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
              className={`w-full py-3.5 rounded-xl text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 ${
                accountType === 'admin'
                  ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-500 glow-emerald'
                  : 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 glow-emerald'
              }`}
            >
              {isLoading ? (
                <span>Creating Supabase Account...</span>
              ) : (
                <>
                  <span>Create {accountType === 'admin' ? 'Admin' : 'Customer'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative border-t border-green-500/10 pt-4 text-center">
            <span className="text-[11px] text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 font-bold hover:underline">
                Sign In
              </Link>
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
