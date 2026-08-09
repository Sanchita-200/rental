import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Search, CheckCircle2, AlertTriangle, Shield, Check, Clock, ArrowLeft, LayoutDashboard, Compass } from 'lucide-react';
import { QRScannerModal } from '../../components/features/operations/QRScannerModal';
import { operationsApi } from '../../api/operations.api';
import type { QRVerificationResponse, RentalItem } from '../../types';
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
      setScanResult((prev: QRVerificationResponse | null) => prev ? { ...prev, rental: updated, action_type: 'RETURN' } : null);
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
      setScanResult((prev: QRVerificationResponse | null) => prev ? { ...prev, rental: updated } : null);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Return processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-[#0E1F18] border border-green-500/20 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Cockpit</span>
        </Link>
      </div>

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
            {scanResult.rental.items.map((item: RentalItem) => (
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

      {/* Smart Pickup & Delivery Route Optimizer */}
      <div className="glass-panel rounded-3xl p-6 border border-green-500/20 bg-[#0A1813]/90 space-y-5 shadow-2xl animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-green-500/10 pb-4 gap-2">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              AI-Optimized Route Planner (Today's Operations)
            </h3>
            <p className="text-xs text-slate-400">
              Optimal travel path sequence to handle active pickups/returns and minimize operational travel overhead
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 align-self-start md:align-self-auto">
            🚀 AI Dispatched: Saved 2.4L Fuel
          </span>
        </div>

        {/* Route Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step Sequence Timeline */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Optimized Stops Sequence</span>
            
            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-green-500/20">
              
              {/* Start/End Stop */}
              <div className="relative">
                <span className="absolute left-[-22px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">H</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Central RentFlow Hub (Start Operations)</h4>
                  <p className="text-[10px] text-slate-400">Inventory check & vehicle safety inspection completed at 09:30 AM.</p>
                </div>
              </div>

              {/* Stop 1 */}
              <div className="relative">
                <span className="absolute left-[-22px] top-0.5 w-4 h-4 rounded-full bg-indigo-500 border-2 border-slate-950 flex items-center justify-center font-bold text-[8px] text-white">1</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">Stop 1: Alex Johnson (Upcoming Pickup)</h4>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold">1.2 km</span>
                  </div>
                  <p className="text-[10px] text-slate-300">Booking: <strong className="text-emerald-400">RF-2026-A101</strong> • 1x Canon R6 Camera Kit • ETA 10:15 AM</p>
                </div>
              </div>

              {/* Stop 2 */}
              <div className="relative">
                <span className="absolute left-[-22px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">2</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">Stop 2: Alex Johnson (Overdue Return)</h4>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold">3.8 km</span>
                  </div>
                  <p className="text-[10px] text-slate-300">Booking: <strong className="text-rose-400">RF-2026-C303</strong> • 1x DeWalt Cordless Drill Kit • ETA 10:45 AM</p>
                </div>
              </div>

              {/* End Hub */}
              <div className="relative">
                <span className="absolute left-[-22px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">H</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Central RentFlow Hub (Return & Unload)</h4>
                  <p className="text-[10px] text-slate-400">Equipment check-in, late fee invoices posted, deposit escrow clearance. ETA 11:15 AM.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Logistics metrics card */}
          <div className="p-4 rounded-2xl bg-[#07140F]/80 border border-green-500/10 space-y-4 h-fit">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-green-500/10 pb-1.5">Route Statistics</span>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Route Distance</span>
                <strong className="text-white">8.5 km</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Est Transit Time</span>
                <strong className="text-white">28 mins (Light Traffic)</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Optimal Stops</span>
                <strong className="text-white">2 Customer Dropoffs</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 leading-relaxed font-semibold font-sans">
              🌱 AI Routing sequence minimizes backtracking, saving 18 minutes of drive time and reducing CO2 emissions by approximately 0.6 kg today.
            </div>
          </div>

        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSuccessScan={handleSuccessScan}
      />

    </div>
  );
};
