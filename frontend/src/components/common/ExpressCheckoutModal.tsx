import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle2, Sparkles, Building, MapPin, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { rentalsApi } from '../../api/rentals.api';
import { useNavigate } from 'react-router-dom';

interface ExpressCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
}

export const ExpressCheckoutModal: React.FC<ExpressCheckoutModalProps> = ({
  isOpen,
  onClose,
  grandTotal
}) => {
  const { user } = useAuth();
  const { items, startDate, endDate, clearCart } = useCart();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [name, setName] = useState(user ? user.full_name : 'Jane Doe');
  const [email, setEmail] = useState(user ? user.email : 'customer@rentflow.com');
  const [addressLine1, setAddressLine1] = useState('123 Innovation Way, Tech Park');
  const [addressLine2, setAddressLine2] = useState('Suite 404, Block B');
  const [zipCode, setZipCode] = useState('560001');
  const [city, setCity] = useState('Bengaluru');
  const [country, setCountry] = useState('India');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleExpressPayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      onClose();
      navigate('/login', { state: { message: 'Please login or signup to complete your rental booking.' } });
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      // Build ISO date string properly
      const startIso = new Date(startDate).toISOString();
      const endIso = new Date(endDate).toISOString();

      const payload = {
        start_date: startIso,
        end_date: endIso,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        payment_method: 'SAVED_EXPRESS_CARD'
      };

      const result = await rentalsApi.checkout(payload);
      clearCart();
      onClose();
      navigate('/my-rentals?tab=active', { state: { bookingSuccess: result } });
    } catch (err: any) {
      console.error('Express checkout failed', err);
      if (err.response?.status === 401) {
        onClose();
        navigate('/login', { state: { message: 'Please login or signup to complete your rental booking.' } });
        return;
      }
      
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setErrorMsg(detail.map((d: any) => d.msg || d.detail).join(', '));
      } else if (typeof detail === 'string') {
        setErrorMsg(detail);
      } else {
        setErrorMsg('Express payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 bg-[#0E1F18] relative max-h-[90vh] overflow-y-auto">
        
        {/* Header matching Excalidraw "Express Checkout" */}
        <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Express Checkout</h2>
              <p className="text-xs text-slate-400">Instant Pay with Saved Card & Auto Counter Pass</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#07140F] text-slate-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer border border-green-500/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleExpressPayNow} className="space-y-5">
          
          {/* Card Details Section */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#07140F] border border-green-500/20">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Card Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">Saved Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#0E1F18] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-[#0E1F18] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  className="w-full bg-[#0E1F18] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* User Info Row: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Line 1 & Line 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Address Line 1</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-[#07140F] border border-green-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Zip Code, City, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          {/* Total & Pay Now Button matching Excalidraw [ Pay Now ] */}
          <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Total Amount Payable</span>
              <span className="text-2xl font-black gradient-emerald-text font-mono">
                Rs {grandTotal}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                'Authorizing Escrow...'
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Pay Now
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
