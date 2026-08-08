import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ChevronDown, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const VendorRegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productCategory, setProductCategory] = useState('Electronics & Gadgets');
  const [gstNumber, setGstNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Electronics & Gadgets',
    'Furniture & Fixtures',
    'Cameras & Photography',
    'Gaming & VR Consoles',
    'Power Tools & Hardware',
    'Audio & DJ Equipment',
    'Camping & Outdoor Gear',
    'Heavy Machinery & Construction',
    'Medical & Healthcare Equipment',
    'Event & Party Supplies'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !companyName.trim() || !gstNumber.trim() || !lastName.trim() || !email.trim()) {
      setErrorMessage('Please fill in all required vendor business fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: 'vendor',
        companyName: companyName.trim(),
        gstNumber: gstNumber.trim(),
        productCategory,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.detail || err.message || 'Vendor registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-8 bg-[#07140F]">
      
      <div className="w-full max-w-lg space-y-6">
        
        {/* Wireframe Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Vendor Sign-up Page
          </h1>
          <p className="text-xs text-slate-400">
            Register your business & store inventory with RentFlow AI
          </p>
        </div>

        {/* Wireframe Card Layout */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-green-500/30 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top Logo / Brand Box matching wireframe box */}
          <div className="w-48 h-12 mx-auto rounded-2xl bg-[#0E2018] border-2 border-green-500/40 flex items-center justify-center gap-2 shadow-inner">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest gradient-emerald-text">
              Vendor Portal
            </span>
          </div>

          {success ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-white">Vendor Registered Successfully!</h3>
              <p className="text-xs text-slate-300">
                Your vendor merchant account has been created. Redirecting to Vendor Admin Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1. First Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter first name"
                  className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* 2. Company Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="e.g. Apex Equipment & Tools Ltd"
                  className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* 3. Product Category (Dropdown) */}
              <div className="space-y-1 relative">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 block">Product Category</label>
                  <span className="text-[10px] text-fuchsia-400 font-medium hidden sm:inline">
                    * Necessary during creation of sale order and invoices
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#07140F] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-400 sm:hidden">
                  * Necessary during creation of sale order and invoices
                </p>
              </div>

              {/* 4. GST no */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">GST no</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  required
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono uppercase transition-colors"
                />
              </div>

              {/* 5. Last Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Enter last name"
                  className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* 6. Email ID */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vendor@company.com"
                  className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* 7. Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* 8. Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#07140F] border border-green-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 9. Register Button (Styling faithfully matches wireframe pink/purple accent) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider shadow-lg glow-purple transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Registering Vendor...</span>
                  ) : (
                    <>
                      <span>Register</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Bottom Login Link */}
          <div className="text-center pt-2 border-t border-green-500/10">
            <span className="text-xs text-slate-400">
              Already have a Vendor or Customer account?{' '}
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
