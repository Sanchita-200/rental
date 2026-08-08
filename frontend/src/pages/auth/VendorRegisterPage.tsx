import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, FileText, CheckCircle2, ArrowRight, Shield, Tag, AlertCircle } from 'lucide-react';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';

export const VendorRegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productCategory, setProductCategory] = useState('Cameras & Photography');
  const [gstNumber, setGstNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, isLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
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
        role: 'vendor',
        companyName,
        gstNumber,
        productCategory,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Vendor registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-6 bg-[#07140F] relative">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-8 border border-green-500/30 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-green-500/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-slate-950 font-black shadow-lg glow-emerald">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Vendor Sign Up</h2>
              <p className="text-xs text-slate-400">Register your business & store on RentFlow AI</p>
            </div>
          </div>

          <Link to="/login" className="text-xs font-semibold text-emerald-400 hover:underline">
            Sign In
          </Link>
        </div>

        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Vendor Business Account Approved!</h3>
            <p className="text-xs text-slate-300">Redirecting to your RentFlow Merchant Admin Dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">First Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="John"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Doe"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Company Name & Product Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Apex Rentals Pvt Ltd"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Product Category</label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-500 z-10 pointer-events-none" />
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none appearance-none"
                  >
                    <option value="Cameras & Photography">Cameras & Photography</option>
                    <option value="Gaming & VR">Gaming & VR Consoles</option>
                    <option value="Power Tools & Hardware">Power Tools & Hardware</option>
                    <option value="Audio & DJ Equipment">Audio & DJ Equipment</option>
                    <option value="Camping & Outdoor">Camping & Outdoor Gear</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GST No. & Email ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">GST No.</label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    required
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="vendor@company.com"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
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
              {isLoading ? 'Registering Vendor...' : 'Register Vendor Account'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
