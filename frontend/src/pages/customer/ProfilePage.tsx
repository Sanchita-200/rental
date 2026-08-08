import React, { useState } from 'react';
import { User, Mail, Phone, Shield, CheckCircle2, Lock, Save, Upload, Building2, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  // Profile Form Fields
  const [name, setName] = useState(user?.full_name || 'John Doe');
  const [email] = useState(user?.email || 'user@rentflow.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [companyName, setCompanyName] = useState('Apex Equipment Ltd');
  const [gstIn, setGstIn] = useState('27AAAAA0000A1Z5');
  const [address, setAddress] = useState('Tech Park Cyber City, Suite 402, Mumbai');
  
  // Sub-tab State: Work Information vs Security
  const [activeSubTab, setActiveSubTab] = useState<'work' | 'security'>('work');
  const [saved, setSaved] = useState(false);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 space-y-8 bg-[#07140F]">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-green-500/20 pb-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg glow-emerald"
          />
          <div>
            <h1 className="text-2xl font-black text-white">{name}</h1>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase font-mono">
                {user?.role || 'CUSTOMER'} ACCOUNT
              </span>
              <span className="text-xs text-slate-400 font-mono">{email}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg glow-purple transition-colors flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>

      {/* Excalidraw Wireframe-Matching Profile Card */}
      <div className="glass-panel p-8 rounded-3xl border border-green-500/30 shadow-2xl space-y-6">
        
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> User Information saved successfully!
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* 2-Column Inputs matching Wireframe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-[#07140F]/50 border border-green-500/10 rounded-xl px-3 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Right Column Inputs */}
            <div className="space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#07140F] border border-green-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    LOGO
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Logo upload triggered')}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-500 flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">GST IN</label>
                <input
                  type="text"
                  value={gstIn}
                  onChange={(e) => setGstIn(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>
            </div>

          </div>

          {/* Sub-Tabs: Work Information | Security */}
          <div className="pt-4 border-t border-green-500/10 space-y-4">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('work')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeSubTab === 'work'
                    ? 'bg-emerald-600 text-slate-950 shadow'
                    : 'bg-[#07140F] text-slate-400 border border-green-500/20'
                }`}
              >
                Work Information
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('security')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeSubTab === 'security'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-[#07140F] text-slate-400 border border-green-500/20'
                }`}
              >
                Security
              </button>
            </div>

            {/* Work Information Content */}
            {activeSubTab === 'work' && (
              <div className="p-4 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-2">
                <span className="text-xs font-bold text-white block">Account Role</span>
                <span className="text-xs text-emerald-400 font-mono font-bold uppercase">{user?.role || 'CUSTOMER'} ACCOUNT</span>
              </div>
            )}

            {/* Security Content */}
            {activeSubTab === 'security' && (
              <div className="p-5 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-4">
                <h3 className="text-xs font-bold text-white">Change Password</h3>

                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                    Password updated successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-[#13251D] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#13251D] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#13251D] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow hover:bg-purple-500"
                >
                  Change Password
                </button>
              </div>
            )}

          </div>

        </form>
      </div>

      {/* Wireframe Note Card */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 space-y-2">
        <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider">📌 Wireframe Access Note</span>
        <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
          <li>Settings are strictly accessible by Admin users under `/admin/dashboard`.</li>
          <li>For all non-admin users, this user information page is accessible here under the Profile section (`/profile`).</li>
        </ul>
      </div>

    </div>
  );
};
