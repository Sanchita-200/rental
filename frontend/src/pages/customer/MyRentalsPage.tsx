import React, { useState, useEffect } from 'react';
import { QrCode, Calendar, Shield, AlertTriangle, FileText, CheckCircle2, X } from 'lucide-react';
import { rentalsApi } from '../../api/rentals.api';
import type { Rental } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const MyRentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedQRPass, setSelectedQRPass] = useState<Rental | null>(null);

  useEffect(() => {
    rentalsApi.getMyRentals().then(setRentals).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-white">My Rental Passes & Bookings</h1>
        <p className="text-xs text-slate-400">Present your digital QR pass at the store counter for pickup and return</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-40 glass-panel rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <QrCode className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No active rental bookings</h3>
          <p className="text-xs text-slate-500 mt-1">Browse our catalog to rent equipment and get instant QR passes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-indigo-500/40 transition-colors"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-white font-mono">{rental.rental_code}</span>
                  <StatusBadge status={rental.status} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>
                      {new Date(rental.start_date).toLocaleDateString()} — {new Date(rental.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Shield className="w-4 h-4" />
                    <span>Deposit Hold: ₹{rental.total_deposit_amount}</span>
                  </div>

                  {rental.total_late_fee > 0 && (
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Late Fee: ₹{rental.total_late_fee}</span>
                    </div>
                  )}
                </div>

                {/* Rental Items summary */}
                <div className="flex items-center gap-2 pt-1">
                  {rental.items.map((item) => (
                    <span key={item.id} className="text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-medium">
                      {item.product_variant?.variant_name || 'Equipment Unit'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action QR Pass Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedQRPass(rental)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg glow-indigo hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  View Store QR Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital QR Pass Modal */}
      {selectedQRPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-indigo-500/40 text-center space-y-5 relative shadow-2xl">
            <button
              onClick={() => setSelectedQRPass(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">RentFlow Digital Pass</span>
              <h3 className="text-lg font-black text-white">{selectedQRPass.rental_code}</h3>
              <div className="inline-block mt-1">
                <StatusBadge status={selectedQRPass.status} />
              </div>
            </div>

            {/* Generated QR Graphics */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-indigo-500/20">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedQRPass.qr_pass_token)}`}
                alt="QR Pass Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Show this QR code at the counter during store pickup or equipment return.
            </p>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Security Deposit Held:</span>
              <span className="font-bold text-amber-400">₹{selectedQRPass.total_deposit_amount}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
