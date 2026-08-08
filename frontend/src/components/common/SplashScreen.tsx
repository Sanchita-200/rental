import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  autoDismissMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, autoDismissMs = 2400 }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07140F] transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Floating Abstract Green Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-blob-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-blob-2 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-6 max-w-md">
        
        {/* Animated Logo */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center shadow-2xl glow-emerald-lg animate-pulse">
            <Shield className="w-12 h-12 text-slate-950" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#13271F] border border-green-500/40 text-emerald-400 shadow-lg">
            <Cpu className="w-5 h-5 animate-spin" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight gradient-emerald-text">
            RentFlow AI
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/90 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Intelligent Rentals
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 space-y-2 pt-4">
          <div className="h-1.5 w-full bg-[#13271F] rounded-full overflow-hidden border border-green-500/20">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-pulse w-full" />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">INITIALIZING ENTERPRISE CORE...</span>
        </div>

      </div>
    </div>
  );
};
