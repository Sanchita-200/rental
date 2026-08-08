import React, { useState } from 'react';
import { QrCode, Search, CheckCircle2, AlertTriangle, Shield, Check, Clock } from 'lucide-react';
import { QRScannerModal } from '../../components/features/operations/QRScannerModal';
import { operationsApi } from '../../api/operations.api';
import type { QRVerificationResponse } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PickupReturnOpsPage: React.FC = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<QRVerificationResponse | null>(null);
  const [damageFee, setDamageFee] = useState<number>(0);
  const [forfeitReason, setForfeitReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSuccessScan = (res: QRVerificationResponse) => {
    setScanResult(res);
    setSuccessMsg('');
  };

  const handlePickup = async () => {
    if (!scanResult?.rental) return;
    setLoading(true);
    try {
      const updated = await operationsApi.processPickup(scanResult.rental.id);
      setSuccessMsg(`Pickup confirmed for booking ${updated.rental_code}! Status changed to PICKED_UP.`);
      setScanResult((prev) => prev ? { ...prev, rental: updated, action_type: 'RETURN' } : null);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Pickup processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!scanResult?.rental) return;
    setLoading(true);
    try {
      const updated = await operationsApi.processReturn({
        rental_id: scanResult.rental.id,
        damage_fee: damageFee,
        forfeit_reason: forfeitReason || undefined
      });
      setSuccessMsg(`Return completed for booking ${updated.rental_code}! Security deposit settled and invoice issued.`);
      setScanResult((prev) => prev ? { ...prev, rental: updated } : null);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Return processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Pickup & Return Operations Station</h1>
          <p className="text-xs text-slate-400">Scan customer QR Pass to release equipment or process returns</p>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs shadow-xl glow-indigo hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <QrCode className="w-5 h-5" /> Launch QR Scanner
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {scanResult?.rental ? (
        <div className="glass-panel rounded-3xl p-6 border border-indigo-500/30 space-y-6 shadow-2xl">
          
          {/* Header info */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Verified Booking</span>
              <h2 className="text-xl font-black text-white">{scanResult.rental.rental_code}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Customer: {scanResult.rental.user?.full_name} ({scanResult.rental.user?.email})</p>
            </div>
            <StatusBadge status={scanResult.rental.status} />
          </div>

          {/* Items checklist */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Equipment Checklist:</span>
            {scanResult.rental.items.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{item.product_variant?.variant_name || 'Equipment Unit'}</span>
                  <span className="text-[10px] text-slate-500">Serial: {item.product_variant?.serial_number}</span>
                </div>
                <div className="text-right">
                  <span className="text-indigo-400 font-semibold block">₹{item.daily_rate}/day</span>
                  <span className="text-[10px] text-amber-400">Deposit: ₹{item.security_deposit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action specifics: PICKUP vs RETURN */}
          {scanResult.action_type === 'PICKUP' && scanResult.rental.status === 'RESERVED' && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
              <h4 className="text-xs font-bold text-indigo-300">Pickup Counter Checklist</h4>
              <p className="text-xs text-slate-300">Verify customer identity and hand over the physical equipment units listed above.</p>
              <button
                onClick={handlePickup}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {loading ? 'Processing...' : 'Confirm Pickup & Handover Equipment'}
              </button>
            </div>
          )}

          {scanResult.action_type === 'RETURN' && scanResult.rental.status !== 'RETURNED' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white">Return Inspection & Late Fee Settlement</h4>

              {/* Late fee warning if overdue */}
              {scanResult.calculated_late_fee > 0 ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Overdue Return ({scanResult.overdue_days} Day(s) Late)</span>
                      <span className="text-[10px] text-rose-400">Automated 1.5x penalty applied</span>
                    </div>
                  </div>
                  <span className="text-base font-black text-rose-400">₹{scanResult.calculated_late_fee}</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Returned On-Time! Full deposit refund eligible.
                </div>
              )}

              {/* Damage adjustment input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Physical Damage Fee Adjustment (Optional)</label>
                <input
                  type="number"
                  value={damageFee}
                  onChange={(e) => setDamageFee(Number(e.target.value))}
                  placeholder="₹0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleReturn}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg glow-indigo hover:opacity-90 transition-opacity"
              >
                {loading ? 'Settling Deposit...' : 'Complete Return & Settle Security Deposit'}
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-3xl space-y-3">
          <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Station Idle</h3>
          <p className="text-xs text-slate-500">Click "Launch QR Scanner" to process a customer pickup or return pass</p>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSuccessScan={handleSuccessScan}
      />

    </div>
  );
};
