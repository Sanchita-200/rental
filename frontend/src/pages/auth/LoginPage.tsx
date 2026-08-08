import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles, AlertCircle, Building2, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@rentflow.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isLoading, isConfigured } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = email.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Invalid User ID or Password.');
      return;
    }

    try {
      await login(email.trim(), password);
      // Decode role from JWT to determine the correct dashboard
      const token = localStorage.getItem('rentflow_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = (payload.role || '').toUpperCase();
          if (role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/catalog');
          }
        } catch {
          navigate('/catalog');
        }
      } else {
        navigate('/catalog');
      }
    } catch (err: any) {
      setErrorMessage('Invalid User ID or Password.');
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPw: string) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-stretch bg-[#07140F]">
      
      {/* Left Column: Visual Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0E1F18] via-[#13271F] to-[#07140F] p-12 flex-col justify-between overflow-hidden border-r border-green-500/10">
        
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/15 rounded-full blur-3xl animate-blob-1" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-blob-2" />

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Enterprise Authentication Engine
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Intelligent Asset Rentals Powered by <span className="gradient-emerald-text">RentFlow AI</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Automate security deposit holds, QR pass check-ins, and overdue penalty calculations with zero manual errors.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Upfront Refundable Security Deposit Escrow',
              'Instant Digital QR Pass Generation for Pickup',
              'Automated 1.5x Late Penalty Fee Engine',
              'AI Demand Forecast & Executive Analytics'
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-green-500/20 glow-emerald">
            <span className="text-2xl font-black text-emerald-400 block">99.8%</span>
            <span className="text-[11px] text-slate-300 font-medium">On-Time Equipment Returns</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-green-500/20 glow-emerald">
            <span className="text-2xl font-black text-cyan-400 block">₹0.00</span>
            <span className="text-[11px] text-slate-300 font-medium">Manual Fee Discrepancies</span>
          </div>
        </div>

      </div>

      {/* Right Column: Glassmorphism Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-green-500/30 shadow-2xl space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg glow-emerald">
                  <Shield className="w-5 h-5 text-slate-950" />
                </div>
                <span className="text-lg font-black gradient-emerald-text">RentFlow AI</span>
              </div>

              <Link to="/vendor-register" className="text-[11px] text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Vendor Sign Up
              </Link>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight pt-2">Welcome Back</h2>
            <p className="text-xs text-slate-400">Enter your email and password to access your account</p>
          </div>

          {/* Supabase Status Banner */}
          {!isConfigured && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <Database className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Demo Mode Active. Add Supabase keys in <code className="text-emerald-300">.env</code> to connect live backend!</span>
            </div>
          )}

          {/* Demo Quick Fill Toolbar */}
          <div className="p-3 rounded-2xl bg-[#0E1F18] border border-green-500/20 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              ⚡ 1-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@rentflow.com', 'admin123')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-[11px] text-emerald-300 font-semibold text-left transition-colors"
              >
                Admin Account
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('customer@rentflow.com', 'customer123')}
                className="px-2.5 py-1.5 rounded-xl bg-green-950/80 hover:bg-green-900 border border-green-500/40 text-[11px] text-green-300 font-semibold text-left transition-colors"
              >
                Customer Account
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
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

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-emerald-400 hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-green-500/30 bg-[#07140F] text-emerald-500 focus:ring-emerald-500/40"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                Remember this device for 30 days
              </label>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="relative border-t border-green-500/10 pt-4 text-center">
            <span className="text-[11px] text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-400 font-bold hover:underline">
                Sign Up
              </Link>
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
