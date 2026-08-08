import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  QrCode, Calendar, Shield, AlertTriangle, FileText, CheckCircle2, X,
  Printer, Download, Building2, MapPin, Phone, Mail, Clock, ArrowUpRight,
  Receipt, ShoppingBag, Sparkles, Check, Info, ShieldCheck, ChevronRight
} from 'lucide-react';
import { rentalsApi } from '../../api/rentals.api';
import type { Rental } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const MyRentalsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedQRPass, setSelectedQRPass] = useState<Rental | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Rental | null>(null);

  // Active Tab from URL query or state
  const currentTab = searchParams.get('tab') || 'all';

  useEffect(() => {
    rentalsApi.getMyRentals().then(setRentals).finally(() => setLoading(false));
  }, []);

  const setTab = (tab: string) => {
    if (tab === 'all') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab });
    }
  };

  // Filter rentals based on active tab
  const filteredRentals = rentals.filter((r) => {
    if (currentTab === 'active') return r.status === 'PICKED_UP';
    if (currentTab === 'upcoming') return r.status === 'RESERVED';
    if (currentTab === 'returned') return r.status === 'RETURNED';
    if (currentTab === 'invoices') return true; // all rentals have invoices
    return true;
  });

  // Calculate quick metric stats
  const totalHeldDeposit = rentals
    .filter((r) => r.status === 'RESERVED' || r.status === 'PICKED_UP')
    .reduce((sum, r) => sum + r.total_deposit_amount, 0);

  const activeRentalsCount = rentals.filter((r) => r.status === 'PICKED_UP').length;
  const completedCount = rentals.filter((r) => r.status === 'RETURNED').length;

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-6 bg-[#07140F]">
      
      {/* Top Banner & Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-green-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Customer Operations
            </span>
            <span className="text-xs text-slate-400 font-mono">User ID: {user?.id?.slice(0, 8) || 'CUST-01'}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">My Rentals & Security Deposit Hub</h1>
          <p className="text-xs text-slate-400">Track equipment status, access digital store pickup passes, download invoices, and monitor deposit refunds</p>
        </div>

        <Link
          to="/catalog"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-bold text-xs shadow-lg glow-emerald hover:opacity-95 transition-opacity flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" /> Rent More Equipment
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-green-500/20 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Bookings</span>
          <span className="text-2xl font-black text-white block mt-0.5">{rentals.length}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-green-500/20 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 block">Active In-Use</span>
          <span className="text-2xl font-black text-cyan-400 block mt-0.5">{activeRentalsCount}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-green-500/20 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 block">Deposit in Escrow</span>
          <span className="text-2xl font-black text-emerald-400 block mt-0.5">₹{totalHeldDeposit}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-green-500/20 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 block">Settled Returns</span>
          <span className="text-2xl font-black text-purple-400 block mt-0.5">{completedCount}</span>
        </div>
      </div>

      {/* Store Return Policy & 100% Refund Reminder Notice */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 flex items-start gap-3.5 shadow-md">
        <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1 text-slate-300 leading-relaxed">
          <div className="font-bold text-white flex items-center gap-2">
            Store Return & 100% Security Deposit Policy
          </div>
          <p>
            • <strong>On-Time Return:</strong> Visit the store counter on or before your return deadline to receive <strong>100% of your security deposit</strong> refunded immediately to your original payment method.
          </p>
          <p>
            • <strong>Late Return Penalty:</strong> If returned past the deadline, a 1.5x daily fee is automatically calculated and deducted from the held deposit, with the remaining balance refunded.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-green-500/20 pb-2">
        {[
          { key: 'all', label: 'All Bookings' },
          { key: 'active', label: 'Active In-Use' },
          { key: 'upcoming', label: 'Upcoming (Reserved)' },
          { key: 'returned', label: 'Returned & Settled' },
          { key: 'invoices', label: 'Tax Invoices & Receipts' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              currentTab === tab.key
                ? 'bg-emerald-600 text-slate-950 shadow glow-emerald'
                : 'text-slate-400 hover:text-white bg-[#0E1F18] border border-green-500/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rentals List Container */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 glass-panel rounded-3xl animate-pulse border border-green-500/10" />
          ))}
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-green-500/20 space-y-3">
          <QrCode className="w-12 h-12 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold text-white">No rental bookings found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {currentTab === 'invoices'
              ? 'You do not have any invoices generated yet. Rent equipment to receive tax invoices.'
              : 'Browse our equipment catalog to reserve tools, gear, and heavy machinery.'}
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition-colors mt-2"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
            const isReturned = rental.status === 'RETURNED';
            const isOverdue = rental.status === 'OVERDUE' || (rental.total_late_fee > 0);

            return (
              <div
                key={rental.id}
                className="glass-panel rounded-3xl p-6 border border-green-500/20 hover:border-emerald-500/40 transition-all shadow-xl space-y-4 bg-[#0E1F18]/80"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-green-500/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-white font-mono">{rental.rental_code}</span>
                      <StatusBadge status={rental.status} />
                    </div>
                    <span className="text-[11px] text-slate-400">Booked on {new Date(rental.created_at || rental.start_date).toLocaleDateString()}</span>
                  </div>

                  {/* Actions: QR Pass and Tax Invoice */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(rental)}
                      className="px-3.5 py-2 rounded-xl bg-[#07140F] border border-green-500/30 hover:border-emerald-400 text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tax Invoice</span>
                    </button>

                    <button
                      onClick={() => setSelectedQRPass(rental)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-bold text-xs shadow-lg glow-emerald hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Digital QR Pass</span>
                    </button>
                  </div>
                </div>

                {/* Rental Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Schedule */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Rental Schedule</span>
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{new Date(rental.start_date).toLocaleDateString()} — {new Date(rental.end_date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Store Pickup / Counter Collection: 09:00 AM – 08:00 PM
                    </span>
                  </div>

                  {/* Escrow Deposit & Late Fee */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Security Deposit Escrow</span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Shield className="w-3.5 h-3.5" />
                      <span>₹{rental.total_deposit_amount} {isReturned ? '(Settled & Refunded)' : '(Held in Escrow)'}</span>
                    </div>
                    {rental.total_late_fee > 0 ? (
                      <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Late Fee Applied: ₹{rental.total_late_fee}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-300">100% Refund guaranteed on on-time return</span>
                    )}
                  </div>

                  {/* Financial Total */}
                  <div className="space-y-1 md:text-right">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Total Net Paid</span>
                    <span className="text-base font-black text-white block">₹{rental.grand_total}</span>
                    <span className="text-[10px] text-slate-400 block">Rent: ₹{rental.subtotal_rent_amount} + Deposit: ₹{rental.total_deposit_amount}</span>
                  </div>
                </div>

                {/* Equipment Items list */}
                <div className="pt-2 border-t border-green-500/10 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Equipment:</span>
                  {rental.items.map((item) => (
                    <span
                      key={item.id}
                      className="text-[11px] bg-[#07140F] px-2.5 py-1 rounded-lg border border-green-500/20 text-slate-200 font-medium"
                    >
                      {item.product_variant?.variant_name || 'Equipment Asset Unit'}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================================== */}
      {/* DIGITAL STORE QR PASS MODAL */}
      {/* ==================================================================== */}
      {selectedQRPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-emerald-500/40 text-center space-y-5 relative shadow-2xl bg-[#0E1F18]">
            <button
              onClick={() => setSelectedQRPass(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400">RentFlow Digital Store Pass</span>
              <h3 className="text-xl font-black text-white font-mono">{selectedQRPass.rental_code}</h3>
              <div className="inline-block mt-1">
                <StatusBadge status={selectedQRPass.status} />
              </div>
            </div>

            {/* Generated QR Graphics */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-emerald-500/30">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedQRPass.qr_pass_token)}`}
                alt="QR Pass Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <p className="font-semibold text-white">Store Counter Check-In & Return</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Present this QR code to the store counter staff for instant equipment verification, pickup, or return check-in.
              </p>
            </div>

            <div className="pt-3 border-t border-green-500/20 text-xs text-slate-300 flex justify-between">
              <span>Security Deposit Held:</span>
              <span className="font-bold text-emerald-400">₹{selectedQRPass.total_deposit_amount}</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAX INVOICE MODAL (PRINTABLE / DOWNLOADABLE) */}
      {/* ==================================================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0B1713] rounded-3xl border border-green-500/40 p-8 shadow-2xl space-y-6 relative my-8">
            
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Receipt className="w-4 h-4" /> Official Tax Invoice
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-xl bg-[#07140F] text-slate-400 hover:text-white cursor-pointer border border-green-500/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Sheet */}
            <div className="space-y-6 text-slate-200">
              
              {/* Header: Company & Invoice info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
                      R
                    </div>
                    <span className="text-base font-black text-white">RentFlow AI Technologies Ltd</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    BKC Tech Park, Cyber City, Suite 402, Mumbai 400051<br />
                    GSTIN: <strong className="text-slate-300">27AAAAA0000A1Z5</strong> | PAN: <strong className="text-slate-300">AAACR1234F</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs uppercase font-extrabold text-emerald-400">Tax Invoice</span>
                  <div className="text-lg font-black text-white font-mono">INV-2026-{selectedInvoice.rental_code.replace(/[^0-9]/g, '').slice(-4) || '8841'}</div>
                  <span className="text-[11px] text-slate-400 block">Date: {new Date(selectedInvoice.created_at || selectedInvoice.start_date).toLocaleDateString()}</span>
                  <span className="text-[11px] text-slate-400 block">Booking: <strong className="text-white font-mono">{selectedInvoice.rental_code}</strong></span>
                </div>
              </div>

              {/* Bill To & Rental Period Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#07140F] border border-green-500/20 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Billed To (Customer):</span>
                  <strong className="text-white block text-sm">{user?.full_name || 'Customer Account'}</strong>
                  <span className="text-slate-300 block">{user?.email}</span>
                  <span className="text-slate-300 block">{user?.phone || '+91 98765 43210'}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Rental Period & Logistics:</span>
                  <span className="text-slate-200 block">
                    <strong>Start:</strong> {new Date(selectedInvoice.start_date).toLocaleDateString()}
                  </span>
                  <span className="text-slate-200 block">
                    <strong>Return Due:</strong> {new Date(selectedInvoice.end_date).toLocaleDateString()}
                  </span>
                  <span className="text-emerald-400 font-semibold block mt-0.5">
                    Fulfillment: Store Pickup (Counter #4)
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-green-500/20 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#0E1F18] border-b border-green-500/20 text-[11px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-3">Equipment Item</th>
                      <th className="p-3 text-right">Daily Rate</th>
                      <th className="p-3 text-right">Rent Subtotal</th>
                      <th className="p-3 text-right">Security Deposit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-500/10">
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 font-semibold text-white">
                          {item.product_variant?.variant_name || 'Equipment Unit'}
                          <span className="block text-[10px] text-slate-400 font-normal">Standard 24-hr daily rental cycle</span>
                        </td>
                        <td className="p-3 text-right text-slate-300">₹{item.daily_rate}/day</td>
                        <td className="p-3 text-right text-slate-200 font-bold">₹{item.item_subtotal}</td>
                        <td className="p-3 text-right text-emerald-400 font-semibold">₹{item.security_deposit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="text-xs space-y-1 text-slate-400 max-w-xs">
                  <span className="font-bold text-white block">Escrow Refund Policy:</span>
                  <p className="text-[11px]">
                    The security deposit of ₹{selectedInvoice.total_deposit_amount} is held in escrow and returned 100% upon timely return.
                  </p>
                </div>

                <div className="w-full sm:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal Equipment Rent:</span>
                    <span className="font-bold text-white">₹{selectedInvoice.subtotal_rent_amount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Refundable Deposit Escrow:</span>
                    <span className="font-bold">₹{selectedInvoice.total_deposit_amount}</span>
                  </div>
                  {selectedInvoice.total_late_fee > 0 && (
                    <div className="flex justify-between text-rose-400 font-bold">
                      <span>Late Return Deductions:</span>
                      <span>-₹{selectedInvoice.total_late_fee}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-black text-white pt-2 border-t border-green-500/20">
                    <span>Net Paid Total:</span>
                    <span className="text-lg text-emerald-400">₹{selectedInvoice.grand_total}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-4 border-t border-green-500/10 flex items-center justify-between text-[10px] text-slate-500">
                <span>Authorized Digital Invoice • RentFlow AI System</span>
                <span>Page 1 of 1</span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
