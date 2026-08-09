import React, { useState, useEffect } from 'react';
import { QrCode, X, Search, Camera, AlertCircle, AlertTriangle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
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
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let html5QrCode: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader");
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.75;
              return { width: size, height: size };
            }
          },
          (decodedText) => {
            // QR Code scanned successfully
            handleVerify(decodedText);
          },
          () => {
            // Keep scanning - ignore single frame failures
          }
        );
        setIsScanning(true);
        setCameraPermission(true);
      } catch (err) {
        console.warn("Failed to initialize or start camera: ", err);
        setCameraPermission(false);
        setIsScanning(false);
      }
    };

    // Slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop()
          .then(() => {
            html5QrCode?.clear();
          })
          .catch((err) => console.error("Error stopping QR Scanner:", err));
      }
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 border border-indigo-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
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

        {/* Live Camera Scanner Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center mb-5 relative overflow-hidden">
          <div 
            id="qr-reader" 
            className="w-full aspect-square max-w-[280px] bg-black rounded-lg overflow-hidden border border-indigo-500/20"
          >
            {/* html5-qrcode will render camera video here */}
          </div>

          {!isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center space-y-3 rounded-xl">
              {cameraPermission === false ? (
                <>
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                  <h4 className="text-xs font-bold text-white">Camera Access Denied</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Could not access camera device. Please permit camera permissions or enter code manually below.
                  </p>
                </>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-indigo-400 animate-pulse" />
                  <span className="text-[10px] text-cyan-300 font-mono">STARTING WEBCAM FEED...</span>
                </>
              )}
            </div>
          )}
          {isScanning && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>LIVE CAMERA ACTIVE</span>
            </div>
          )}
        </div>

        {/* Demo Preset Quick Scan Buttons */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Demo Test Passes (1-Click Test):
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleVerify('RF-2026-A101')}
              className="px-3 py-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-xs text-indigo-300 text-left flex items-center justify-between transition-colors"
            >
              <span>Scan Demo Booking: <strong className="text-white">RF-2026-A101</strong> (Upcoming Pickup)</span>
              <StatusBadge status="RESERVED" />
            </button>
            <button
              onClick={() => handleVerify('RF-2026-C303')}
              className="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-xs text-rose-300 text-left flex items-center justify-between transition-colors"
            >
              <span>Scan Demo Booking: <strong className="text-white">RF-2026-C303</strong> (Overdue Return!)</span>
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
            placeholder="Enter rental code e.g. RF-2026-A101"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleVerify(manualCode)}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
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
