import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, CheckCircle2, CreditCard, QrCode, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { rentalsApi } from '../../api/rentals.api';
import { useAuth } from '../../context/AuthContext';

export const CheckoutPage: React.FC = () => {
  const { items, startDate, endDate, durationDays, subtotalRent, totalDeposit, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'UPI' | 'CASH'>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    navigate('/catalog');
    return null;
  }

  const handleCompleteBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const itemsPayload = items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
      }));

      // Submit checkout request to FastAPI backend
      await rentalsApi.checkout({
        items: itemsPayload,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        payment_method: paymentMethod,
      });

      clearCart();
      navigate('/my-rentals');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Checkout transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <div className="text-left">
        <h1 className="text-2xl font-black text-white">Rental Order Checkout</h1>
        <p className="text-xs text-slate-400">Confirm payment and generate your instant store pickup QR pass</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Payment & Deposit Terms */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Payment Method Selector */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" /> Payment Gateway (Sandbox Mode)
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs">Razorpay</div>
                <div className="text-[10px] text-slate-500">Cards / Netbanking</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs">UPI FastPay</div>
                <div className="text-[10px] text-slate-500">GPay / PhonePe</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'CASH'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xs">Pay at Store</div>
                <div className="text-[10px] text-slate-500">Cash on Pickup</div>
              </button>
            </div>
          </div>

          {/* Deposit Policy Terms Box */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" /> Security Deposit Protection Terms
            </div>
            <ul className="text-xs text-emerald-200/90 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Security deposits are held in a secure escrow account during your rental period.</li>
              <li>Deposits are released 100% back to your account when returned on time in working condition.</li>
              <li>Late fees (if overdue) are deducted automatically upon return scan at 1.5x daily rate.</li>
            </ul>
          </div>

        </div>

        {/* Right Column: Total & Instant QR Generation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-indigo-500/30 space-y-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Rental Order Breakdown</h3>

            <div className="space-y-2 text-xs">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-slate-300">
                  <span className="truncate max-w-[200px]">{i.product.title}</span>
                  <span className="font-semibold text-white">₹{i.product.base_daily_rate * durationDays * i.quantity}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Rent ({durationDays} days)</span>
                  <span className="font-bold text-white">₹{subtotalRent}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Refundable Deposit</span>
                  <span className="font-bold">₹{totalDeposit}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Grand Total</span>
                  <span className="text-lg font-black text-indigo-400">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {errorMsg && <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{errorMsg}</div>}

            <button
              onClick={handleCompleteBooking}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl glow-indigo hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              {loading ? 'Processing Order...' : 'Pay & Generate Instant QR Pass'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
