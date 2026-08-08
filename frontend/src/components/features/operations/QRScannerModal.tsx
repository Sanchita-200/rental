import React, { useState } from 'react';
import { QrCode, X, Search, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { operationsApi } from '../../../api/operations.api';
import type { QRVerificationResponse } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessScan: (res: QRVerificationResponse) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onSuccessScan }) => {
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await operationsApi.verifyQR(codeToVerify.trim());
      if (res.valid) {
        onSuccessScan(res);
        onClose();
      } else {
        setErrorMsg(res.message || 'Invalid QR Token or Booking Code');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Verification error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 border border-indigo-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">QR Code Pass Scanner</h3>
            <p className="text-xs text-slate-400">Scan customer QR Pass or enter Booking Code</p>
          </div>
        </div>

        {/* Scanner Simulation Card */}
        <div className="bg-slate-900/90 border border-dashed border-indigo-500/40 rounded-xl p-6 flex flex-col items-center justify-center text-center mb-5 relative overflow-hidden">
          <div className="w-36 h-36 border-2 border-cyan-400/60 rounded-xl flex flex-col items-center justify-center bg-slate-950/50 mb-3 relative animate-pulse">
            <Camera className="w-10 h-10 text-indigo-400 mb-1" />
            <span className="text-[10px] text-cyan-300 font-mono">SCANNING PASS...</span>
          </div>
          <p className="text-xs text-slate-400">Position QR code within camera viewfinder</p>
        </div>

        {/* Demo Preset Quick Scan Buttons */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Demo Test Passes (1-Click Test):
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleVerify('RF-2026-8891')}
              className="px-3 py-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-xs text-indigo-300 text-left flex items-center justify-between"
            >
              <span>Scan Demo Booking: <strong className="text-white">RF-2026-8891</strong> (Upcoming Pickup)</span>
              <StatusBadge status="RESERVED" />
            </button>
            <button
              onClick={() => handleVerify('RF-2026-7734')}
              className="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-xs text-rose-300 text-left flex items-center justify-between"
            >
              <span>Scan Demo Booking: <strong className="text-white">RF-2026-7734</strong> (Overdue Return!)</span>
              <StatusBadge status="OVERDUE" />
            </button>
          </div>
        </div>

        {/* Manual Input Fallback */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter rental code e.g. RF-2026-8891"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleVerify(manualCode)}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Verify
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
