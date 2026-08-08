import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Shield, Lock, Mail, User, Phone, CheckCircle2, XCircle, ArrowRight,
  Sparkles, Eye, EyeOff, AlertCircle, Gift, Copy, Check, Tag, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignUpPage: React.FC = () => {
  const location = useLocation();
  const redirectMessage = location.state?.message || null;

  const accountType = 'customer';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const { register, isLoading } = useAuth();
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

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

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

      navigate('/catalog');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.detail || err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-stretch bg-[#07140F]">
      
      {/* Left Column: Visual Showcase & Wireframe Coupon Widget */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0E1F18] via-[#13271F] to-[#07140F] p-12 flex-col justify-between overflow-hidden border-r border-green-500/10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/15 rounded-full blur-3xl animate-blob-1" />
        
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Instant Account Provisioning
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Join RentFlow AI & Unlock <span className="gradient-emerald-text">Powerful Rental Tools</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Create your account to access digital QR passes, automated deposit management, and real-time store counter pickup.
          </p>

          {/* EXCALIDRAW WIREFRAME COUPON CODE WIDGET */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#172E24] via-[#0E221A] to-[#172E24] border-2 border-emerald-500/40 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <Gift className="w-4 h-4 text-emerald-400" /> For new signup
            </div>
            
            <div className="bg-[#07140F] border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Coupon Code (10% OFF):</span>
                <span className="text-xl font-black text-emerald-400 font-mono tracking-widest">WELCOME10</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
              >
                {copiedCoupon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCoupon ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Apply this code on your first rental booking to claim 10% instant discount.</p>
          </div>

          <div className="space-y-2.5 pt-1">
            {[
              'Digital QR Pass issued instantly upon booking',
              'Fair automated 1.5x late fee calculation engine',
              '100% Refundable Security Deposit Escrow',
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
          
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-slate-950" />
              </div>
              <h2 className="text-2xl font-black text-white">Create Account</h2>
            </div>
            <p className="text-xs text-slate-400">Get started in seconds. No credit card required for browsing.</p>
          </div>

          {/* Unauthenticated Product Redirect Notice Banner */}
          {redirectMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-lg animate-fade-in">
              <Info className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#07140F] border border-green-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Morgan"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#07140F] border border-green-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Work / Personal Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#07140F] border border-green-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Phone Number (For Store Pickup SMS)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#07140F] border border-green-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Create Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 12 characters"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#07140F] border border-green-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthPercentage === 100
                          ? 'bg-emerald-400'
                          : strengthPercentage >= 60
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${strengthPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                    <span className={hasMinLength ? 'text-emerald-400 font-bold' : ''}>✓ 12+ Characters</span>
                    <span className={hasUppercase ? 'text-emerald-400 font-bold' : ''}>✓ Uppercase Letter</span>
                    <span className={hasLowercase ? 'text-emerald-400 font-bold' : ''}>✓ Lowercase Letter</span>
                    <span className={hasNumber ? 'text-emerald-400 font-bold' : ''}>✓ Number</span>
                    <span className={hasSpecial ? 'text-emerald-400 font-bold' : ''}>✓ Special Character</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#07140F] border border-green-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-green-500/30 text-emerald-500 focus:ring-emerald-400 bg-[#07140F]"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-300 leading-tight">
                I agree to the <Link to="/terms" className="text-emerald-400 hover:underline">Terms of Service</Link> and understand the refundable deposit policy.
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:scale-102 transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Your Account...' : 'Complete Registration & Claim WELCOME10'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-2 border-t border-green-500/10 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              Sign In Here →
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
