import React from 'react';
import { Shield, Sparkles, Award, Users, CheckCircle2, Cpu } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-12 bg-[#07140F]">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> About RentFlow AI
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Next-Gen Equipment Rentals Powered by <span className="gradient-emerald-text">Artificial Intelligence</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          RentFlow AI is an enterprise rental management ecosystem built to eliminate manual security deposit paperwork, automate overdue penalty calculations, and issue digital QR passes for instant pickup & return counter check-ins.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-3 glow-emerald">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Escrow Security</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Security deposits are securely held in encrypted escrow and automatically refunded upon damage-free return inspection.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-3 glow-emerald">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">AI Fleet Intelligence</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Automated demand forecasting, dynamic pricing optimization, and real-time equipment availability tracking.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-3 glow-emerald">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Digital QR Passes</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instant digital QR pass generation for zero-wait customer store counter pickups and returns.
          </p>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="p-8 rounded-3xl glass-panel border border-green-500/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <span className="text-3xl font-black text-emerald-400 block">50,000+</span>
          <span className="text-xs text-slate-400 font-medium">Successful Rentals</span>
        </div>
        <div>
          <span className="text-3xl font-black text-cyan-400 block">99.8%</span>
          <span className="text-xs text-slate-400 font-medium">On-Time Returns</span>
        </div>
        <div>
          <span className="text-3xl font-black text-amber-400 block">₹0.00</span>
          <span className="text-xs text-slate-400 font-medium">Deposit Errors</span>
        </div>
        <div>
          <span className="text-3xl font-black text-purple-400 block">24/7</span>
          <span className="text-xs text-slate-400 font-medium">AI Assistant Support</span>
        </div>
      </div>

    </div>
  );
};
