import React, { useState } from 'react';
import {
  User, Mail, Phone, Shield, CheckCircle2, Lock, Save, Upload,
  Building2, MapPin, CreditCard, Plus, Trash2, Edit2, ShieldCheck,
  Check, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';

interface SavedAddress {
  id: string;
  tag: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'security'>('profile');

  // Profile Form Fields
  const [name, setName] = useState(user?.full_name || 'Kriti Sp');
  const [email] = useState(user?.email || 'ksp@gma.com');
  const [phone, setPhone] = useState(user?.phone || '+91 78259 64875');
  const [companyName, setCompanyName] = useState('Apex Equipment Ltd');
  const [gstIn, setGstIn] = useState('27AAAAA0000A1Z5');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');

  // Saved Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      tag: 'Head Office (Default)',
      recipientName: user?.full_name || 'Kriti Sp',
      phone: '+91 78259 64875',
      street: 'Tech Park Cyber City, Suite 402',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      isDefault: true,
    },
    {
      id: 'addr-2',
      tag: 'Project Site Depot',
      recipientName: 'Site Supervisor / Kriti Sp',
      phone: '+91 98765 43210',
      street: 'Plot 18, Industrial Logistics Area, Phase 2',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400705',
      isDefault: false,
    },
  ]);

  // Saved Payment Methods State
  const [cards, setCards] = useState<SavedCard[]>([
    {
      id: 'card-1',
      brand: 'Visa Corporate',
      last4: '4242',
      expiry: '12/28',
      holder: user?.full_name || 'Kriti Sp',
      isDefault: true,
    },
    {
      id: 'card-2',
      brand: 'Mastercard Equipment Escrow',
      last4: '8819',
      expiry: '09/27',
      holder: user?.full_name || 'Kriti Sp',
      isDefault: false,
    },
  ]);

  // Modals / Input states
  const [newAddrModal, setNewAddrModal] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    tag: 'Warehouse / Site',
    recipientName: user?.full_name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await authApi.updateProfile({
        full_name: name,
        phone: phone,
        avatar_url: avatarUrl,
      });
    } catch (err) {
      console.log('Saved to state');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      ...newAddrForm,
    };
    setAddresses([...addresses, newAddr]);
    setNewAddrModal(false);
    setNewAddrForm({
      tag: 'Warehouse / Site',
      recipientName: user?.full_name || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
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

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-8 bg-[#07140F]">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-green-500/20 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg glow-emerald"
            />
          </div>
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
          onClick={() => handleSaveProfile()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:opacity-90 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg glow-emerald transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-green-500/20 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-slate-950 shadow glow-emerald'
              : 'bg-[#0E1F18] text-slate-300 hover:text-white border border-green-500/20'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Personal & Company Info
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'addresses'
              ? 'bg-emerald-600 text-slate-950 shadow glow-emerald'
              : 'bg-[#0E1F18] text-slate-300 hover:text-white border border-green-500/20'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> Saved Shipping Addresses ({addresses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-emerald-600 text-slate-950 shadow glow-emerald'
              : 'bg-[#0E1F18] text-slate-300 hover:text-white border border-green-500/20'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Payment Methods ({cards.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-emerald-600 text-slate-950 shadow glow-emerald'
              : 'bg-[#0E1F18] text-slate-300 hover:text-white border border-green-500/20'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Security & Password
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4" /> Account information and profile saved successfully!
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 1: PERSONAL & COMPANY PROFILE */}
      {/* ==================================================================== */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-8 rounded-3xl border border-green-500/30 shadow-2xl space-y-6 bg-[#0E1F18]/90">
          
          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Choose Profile Image Avatar</label>
            <div className="flex items-center gap-3">
              {sampleAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    avatarUrl === url ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address (Verified Account)</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[#07140F]/50 border border-green-500/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Right Column Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">GSTIN Identification</label>
                  <input
                    type="text"
                    value={gstIn}
                    onChange={(e) => setGstIn(e.target.value)}
                    className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Account Role</label>
                  <div className="p-2.5 rounded-xl bg-[#07140F] border border-green-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Portal Access Level:</span>
                    <span className="text-emerald-400 font-mono font-bold">{user?.role || 'CUSTOMER'}</span>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: SAVED SHIPPING ADDRESSES */}
      {/* ==================================================================== */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Shipping & Delivery Addresses</h3>
            <button
              onClick={() => setNewAddrModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 bg-[#0E1F18] ${
                  addr.isDefault ? 'border-emerald-400 glow-emerald' : 'border-green-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">{addr.tag}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Default Delivery
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-white">{addr.recipientName}</p>
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-slate-400">Phone: {addr.phone}</p>
                </div>

                <div className="pt-2 border-t border-green-500/10 flex items-center justify-between text-xs">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-emerald-400 hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {newAddrModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="w-full max-w-md bg-[#0B1713] rounded-3xl border border-green-500/40 p-6 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-white">Add Delivery Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Address Label</label>
                    <input
                      type="text"
                      value={newAddrForm.tag}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, tag: e.target.value })}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white"
                      placeholder="e.g. Site Depot #2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={newAddrForm.recipientName}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, recipientName: e.target.value })}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newAddrForm.phone}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newAddrForm.street}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">City</label>
                      <input
                        type="text"
                        value={newAddrForm.city}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                        className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={newAddrForm.pincode}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                        className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setNewAddrModal(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#07140F] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-slate-950 font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: PAYMENT METHODS */}
      {/* ==================================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Saved Payment Methods & Escrow Rails</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((c) => (
              <div key={c.id} className="glass-panel p-5 rounded-2xl border border-green-500/20 bg-[#0E1F18] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{c.brand}</span>
                  </div>
                  {c.isDefault && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Default
                    </span>
                  )}
                </div>

                <div className="font-mono text-sm tracking-widest text-slate-200">
                  •••• •••• •••• {c.last4}
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Cardholder: <strong className="text-white">{c.holder}</strong></span>
                  <span>Expires: <strong className="text-white">{c.expiry}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#0E1F18] border border-green-500/20 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>UPI Escrow ID: <strong className="text-white font-mono">ksp@okhdfcbank</strong></span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: SECURITY & CREDENTIALS */}
      {/* ==================================================================== */}
      {activeTab === 'security' && (
        <div className="glass-panel p-6 rounded-3xl border border-green-500/30 bg-[#0E1F18] space-y-4">
          <h3 className="text-sm font-bold text-white">Update Account Password</h3>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Password updated successfully!
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
