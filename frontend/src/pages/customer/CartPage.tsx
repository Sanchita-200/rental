import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Shield, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, startDate, endDate, durationDays, updateDates, subtotalRent, totalDeposit, grandTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Rental Cart is Empty</h2>
        <p className="text-xs text-slate-400">Explore our catalog and choose dates to rent equipment.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg glow-indigo transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Rental Cart Summary</h1>
          <p className="text-xs text-slate-400">Review selected equipment, rental duration, and security deposit hold</p>
        </div>
        <Link to="/catalog" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Add More Items
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Cart Items & Date Picker */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Global Date Selector */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" /> Selected Rental Duration
              </span>
              <span className="text-xs font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                {durationDays} Days Total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => updateDates(e.target.value, endDate)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Return Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => updateDates(startDate, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-4"
              >
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80'}
                  alt={item.product.title}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
                    <div>Daily Rate: <span className="text-indigo-300 font-semibold">₹{item.product.base_daily_rate} / day</span></div>
                    <div className="text-amber-400">Security Deposit: <span className="font-semibold">₹{item.product.security_deposit_amount}</span></div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-white">
                    ₹{item.product.base_daily_rate * durationDays * item.quantity}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors mt-2"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right: Price & Deposit Summary */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-6 border border-indigo-500/30 space-y-5 sticky top-24 shadow-2xl">
            <h3 className="text-base font-bold text-white">Order Financial Summary</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Rent ({durationDays} days)</span>
                <span className="font-semibold text-white">₹{subtotalRent}</span>
              </div>

              <div className="flex justify-between text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Refundable Security Deposit Hold
                </span>
                <span className="font-bold">₹{totalDeposit}</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-white pt-3 border-t border-slate-800">
                <span>Total Upfront Payment</span>
                <span className="text-lg font-black text-indigo-400">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl glow-indigo hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout & Get QR Pass
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
