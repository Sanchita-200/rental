import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Shield, ShieldCheck, CheckCircle2, ArrowLeft, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { catalogApi } from '../../api/catalog.api';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { startDate, endDate, durationDays, updateDates, addToCart } = useCart();

  useEffect(() => {
    if (id) {
      catalogApi.getProductById(id).then(setProduct).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Loading product specs...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Product not found</div>;
  }

  const rentSubtotal = product.base_daily_rate * durationDays;
  const depositAmount = product.security_deposit_amount;
  const grandTotal = rentSubtotal + depositAmount;

  const handleBookNow = () => {
    addToCart(product, 1);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 p-2">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'}
              alt={product.title}
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Equipment Overview</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Serial Units</span>
                <span className="text-xs font-bold text-cyan-400">{product.variants?.length || 2} Available</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Cleanliness & Test</span>
                <span className="text-xs font-bold text-emerald-400">Inspected & Sanitized</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Pass Format</span>
                <span className="text-xs font-bold text-purple-400">Digital QR Pass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Booking Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-indigo-500/30 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <StatusBadge status={product.status} />
              <div className="flex items-center gap-1 text-xs text-indigo-300 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Fast Store Pickup
              </div>
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-white">{product.title}</h1>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black gradient-text">₹{product.base_daily_rate}</span>
                <span className="text-xs text-slate-400">/ day rental rate</span>
              </div>
            </div>

            {/* Date Selector Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Select Rental Dates
                </span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {durationDays} Day(s)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => updateDates(e.target.value, endDate)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => updateDates(startDate, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Rental Subtotal ({durationDays} days × ₹{product.base_daily_rate})</span>
                <span className="font-semibold text-white">₹{rentSubtotal}</span>
              </div>

              <div className="flex justify-between items-center text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Refundable Security Deposit</span>
                </div>
                <span className="font-bold">₹{depositAmount}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Upfront Amount</span>
                <span className="text-base font-extrabold text-indigo-400">₹{grandTotal}</span>
              </div>
            </div>

            {/* Deposit Guarantee Note */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>
                <strong>100% Refund Guarantee:</strong> Deposit is automatically released upon return on time with no physical damage.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleBookNow}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl glow-indigo hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
