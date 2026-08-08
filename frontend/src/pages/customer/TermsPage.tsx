import React from 'react';
import { FileText, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 space-y-8 bg-[#07140F]">
      
      <div className="space-y-2 border-b border-green-500/20 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" /> Legal Governance
        </div>
        <h1 className="text-3xl font-extrabold text-white">Terms & Conditions of Rental</h1>
        <p className="text-xs text-slate-400">Effective Date: August 2026 • RentFlow Escrow Governance</p>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <div className="glass-panel p-6 rounded-2xl border border-green-500/20 space-y-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> 1. Security Deposit Escrow Policy
          </h2>
          <p>
            All rental bookings require an upfront refundable security deposit. The deposit is held safely in escrow during the rental period. Upon physical return inspection at the store counter, 100% of the deposit is refunded if the equipment is returned undamaged and on time.
          </p>
        </div>

        {/* Section 2 */}
        <div className="glass-panel p-6 rounded-2xl border border-green-500/20 space-y-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 2. Automated Late Return Penalty Fee Engine
          </h2>
          <p>
            Equipment returned past the scheduled end date will automatically trigger late fees calculated as:
          </p>
          <div className="p-3 rounded-xl bg-[#07140F] font-mono text-emerald-400 border border-green-500/20 my-2">
            Late Penalty = Overdue Days × Daily Rate × 1.5 Multiplier
          </div>
          <p>
            Late fees are automatically deducted from the held security deposit escrow.
          </p>
        </div>

        {/* Section 3 */}
        <div className="glass-panel p-6 rounded-2xl border border-green-500/20 space-y-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 3. Digital QR Pass & Store Pickup Inspection
          </h2>
          <p>
            Customers must present their valid digital QR pass upon equipment pickup. Both customer and store agent must verify physical equipment condition and serial numbers prior to dispatch.
          </p>
        </div>

      </div>

    </div>
  );
};
