import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Shield, ArrowRight, ShoppingBag, ArrowLeft, Tag, ShieldCheck, Gift, Clock, Bookmark, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ExpressCheckoutModal } from '../../components/common/ExpressCheckoutModal';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, startDate, endDate, durationDays, updateDates, subtotalRent, totalDeposit, grandTotal } = useCart();
  const navigate = useNavigate();

  const [isExpressModalOpen, setIsExpressModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'WELCOME10') {
      const discount = Math.round(subtotalRent * 0.10);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 for 10% off.');
    }
  };

  const finalTotal = Math.max(0, grandTotal - discountAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 bg-[#07140F]">
        <div className="w-16 h-16 rounded-full bg-[#0E1F18] border border-green-500/20 flex items-center justify-center mx-auto text-emerald-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Your Rental Cart is Empty</h2>
        <p className="text-xs text-slate-400">Explore our pro equipment catalog and choose rental dates.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg glow-emerald hover:scale-105 transition-all"
        >
          Explore Equipment Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#07140F]">
      
      {/* ==================================================================== */}
      {/* EXCALIDRAW WIREFRAME TOP BREADCRUMB STEPPER */}
      {/* ==================================================================== */}
      <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-black">1</span>
            Add to Cart
          </span>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/checkout')}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center font-bold">2</span>
            Address
          </span>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 text-[10px] flex items-center justify-center font-bold">3</span>
            Payment
          </span>
        </div>

        <Link to="/catalog" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      {/* ==================================================================== */}
      {/* EXCALIDRAW WIREFRAME TWO-COLUMN LAYOUT */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ORDER SUMMARY (PRODUCT CARDS + QUANTITY STEPPERS) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight">Order Summary</h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {items.length} Equipment Item(s)
            </span>
          </div>

          {/* List of Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="glass-panel rounded-3xl p-5 border border-green-500/30 bg-[#0E1F18] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative group"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-green-500/20 shrink-0"
                  />

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{item.product.title}</h3>
                    <div className="text-xs font-black text-emerald-400 font-mono">
                      Rs {item.product.base_daily_rate} / day
                    </div>

                    {/* WIREFRAME "Date and time for which the product is rented" */}
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        {startDate} 09:00 AM to {endDate} 08:00 PM ({durationDays} Days)
                      </span>
                    </div>

                    {/* WIREFRAME "Remove" | "Save for Later" */}
                    <div className="flex items-center gap-3 pt-2 text-[11px]">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                      <span className="text-slate-600">|</span>
                      <button
                        onClick={() => {
                          const saved = JSON.parse(localStorage.getItem('rentflow_wishlist') || '[]');
                          if (!saved.includes(item.product.id)) {
                            localStorage.setItem('rentflow_wishlist', JSON.stringify([...saved, item.product.id]));
                          }
                          removeFromCart(item.product.id);
                        }}
                        className="text-slate-400 hover:text-emerald-400 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Bookmark className="w-3.5 h-3.5" /> Save for Later
                      </button>
                    </div>
                  </div>
                </div>

                {/* WIREFRAME RIGHT QUANTITY STEPPER CONTROLS [ - 1 + ] & PRICE */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-green-500/10 gap-3">
                  <span className="text-sm font-black text-white font-mono">
                    Rs {item.product.base_daily_rate * durationDays * item.quantity}
                  </span>

                  {/* Stepper [ - 1 + ] */}
                  <div className="flex items-center gap-2 bg-[#07140F] p-1.5 rounded-xl border border-green-500/30">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-[#0E1F18] border border-green-500/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-emerald-400 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-[#0E1F18] border border-green-500/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WIREFRAME BOTTOM BUTTON: "Continue Shopping >" */}
          <Link
            to="/catalog"
            className="w-full py-4 rounded-2xl bg-[#0E1F18] border border-green-500/30 text-white font-extrabold text-xs uppercase tracking-wider hover:border-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Continue Shopping</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </Link>

        </div>

        {/* RIGHT COLUMN: RENTAL PERIOD & CHECKOUT SUMMARY CARD */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="glass-panel rounded-3xl p-6 border border-green-500/30 space-y-6 shadow-2xl bg-[#0E1F18]">
            
            {/* WIREFRAME "Rental Period" DATE SELECTOR BOX */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Rental Period
              </h3>

              {/* Start Date & Time input with Calendar Icon */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">Start Date & Time</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={`${startDate}T09:00`}
                    onChange={(e) => updateDates(e.target.value.split('T')[0], endDate)}
                    className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                  <Calendar className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* End Date & Time input with Calendar Icon */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">End Date & Time</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={`${endDate}T20:00`}
                    onChange={(e) => updateDates(startDate, e.target.value.split('T')[0])}
                    className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                  <Calendar className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* WIREFRAME FINANCIAL BREAKDOWN */}
            <div className="space-y-3 pt-3 border-t border-green-500/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Delivery Charges</span>
                <span className="font-mono text-slate-400">- (Store Counter Pickup)</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Sub Total ({durationDays} Days Rent)</span>
                <span className="font-mono font-bold text-white">Rs {subtotalRent}</span>
              </div>

              <div className="flex justify-between text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Security Deposit Escrow Hold
                </span>
                <span className="font-mono font-extrabold">Rs {totalDeposit}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount (WELCOME10)</span>
                  <span>-Rs {discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-extrabold text-white pt-3 border-t border-green-500/20">
                <span>Total</span>
                <span className="text-2xl font-black gradient-emerald-text font-mono">
                  Rs {finalTotal}
                </span>
              </div>
            </div>

            {/* WIREFRAME ACTION BUTTONS */}
            <div className="space-y-3 pt-2 border-t border-green-500/20">
              
              {/* 1. APPLY COUPON BUTTON & INPUT */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. WELCOME10)"
                    className="flex-1 bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all cursor-pointer shadow"
                  >
                    Apply Coupon
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-400 font-semibold">✓ Coupon WELCOME10 applied! 10% discount subtracted.</p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 font-semibold">{couponError}</p>
                )}
              </div>

              {/* 2. PAY WITH SAVED CARD BUTTON */}
              <button
                type="button"
                onClick={() => setIsExpressModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#07140F] border border-green-500/30 text-emerald-400 font-bold text-xs hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <CreditCard className="w-4 h-4" /> Pay with Saved Card
              </button>

              {/* 3. CHECKOUT BUTTON */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:scale-102 transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* EXPRESS CHECKOUT POPUP BOX MODAL */}
      <ExpressCheckoutModal
        isOpen={isExpressModalOpen}
        onClose={() => setIsExpressModalOpen(false)}
        grandTotal={finalTotal}
      />

    </div>
  );
};
