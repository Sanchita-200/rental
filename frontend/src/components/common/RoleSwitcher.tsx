import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RoleSwitcher: React.FC = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  const handleToggle = (targetRole: 'ADMIN' | 'CUSTOMER') => {
    if (user.role === targetRole) return;

    switchRole(targetRole);

    const msg = targetRole === 'ADMIN'
      ? '⚡ Admin Cockpit Mode Activated'
      : '👤 Customer Marketplace View Activated';

    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);

    if (targetRole === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-2xl glass-panel border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-2xl flex items-center gap-2 glow-emerald animate-scale-up"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Dual Segmented Role Switcher Pill */}
      <div className="p-1 rounded-2xl bg-[#060F0B] border border-emerald-500/30 flex items-center gap-1 shadow-lg">
        
        {/* Customer Button */}
        <button
          type="button"
          onClick={() => handleToggle('CUSTOMER')}
          className={`relative px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 z-10 ${
            !isAdmin
              ? 'text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {!isAdmin && (
            <motion.div
              layoutId="roleActivePill"
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl shadow-lg glow-emerald"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Customer
          </span>
        </button>

        {/* Admin Button */}
        <button
          type="button"
          onClick={() => handleToggle('ADMIN')}
          className={`relative px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 z-10 ${
            isAdmin
              ? 'text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAdmin && (
            <motion.div
              layoutId="roleActivePill"
              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 rounded-xl shadow-lg glow-purple"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Admin Cockpit
          </span>
        </button>

      </div>
    </div>
  );
};
