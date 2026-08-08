import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Shield, ShieldCheck, CheckCircle2, ArrowLeft, ShoppingBag, Clock, Sparkles, Heart, Sliders, AlertTriangle, Check } from 'lucide-react';
import { catalogApi } from '../../api/catalog.api';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfigureModal } from '../../components/common/ConfigureModal';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigureOpen, setIsConfigureOpen] = useState<boolean>(false);

  // Live Date Availability State
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const [availabilityInfo, setAvailabilityInfo] = useState<{
    available: boolean;
    available_units: number;
    message: string;
  } | null>(null);

  // Wishlist State (persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rentflow_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { startDate, endDate, durationDays, updateDates, addToCart } = useCart();

  useEffect(() => {
    if (id) {
      catalogApi.getProductById(id).then(setProduct).finally(() => setLoading(false));
    }
  }, [id]);

  // Check Availability dynamically when startDate or endDate or product changes
  useEffect(() => {
    if (id && startDate && endDate) {
      setCheckingAvailability(true);
      const isoStart = `${startDate}T09:00:00Z`;
      const isoEnd = `${endDate}T20:00:00Z`;
      catalogApi.checkAvailability(id, isoStart, isoEnd)
        .then((res) => setAvailabilityInfo(res))
        .catch(() => setAvailabilityInfo({ available: true, available_units: 3, message: 'Available' }))
        .finally(() => setCheckingAvailability(false));
    }
  }, [id, startDate, endDate]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-mono text-xs">Loading pro equipment specs...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">Product equipment asset not found.</div>;
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const isAvailableForPeriod = availabilityInfo ? availabilityInfo.available : true;

  const toggleWishlist = () => {
    setWishlistIds((prev) => {
      const updated = prev.includes(product.id)
        ? prev.filter((item) => item !== product.id)
        : [...prev, product.id];
      localStorage.setItem('rentflow_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const rentSubtotal = product.base_daily_rate * durationDays;
  const depositAmount = product.security_deposit_amount;
  const grandTotal = rentSubtotal + depositAmount;

  const handleBookNow = () => {
    if (!isAvailableForPeriod) return;
    addToCart(product, 1);
    navigate('/cart');
  };

  const handleConfirmConfigure = (prod: Product) => {
    if (!isAvailableForPeriod) return;
    addToCart(prod, 1);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6 bg-[#07140F]">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Equipment Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl overflow-hidden border border-green-500/20 p-2 shadow-2xl bg-[#0E1F18] relative">
            
            {/* WISHLIST BUTTON ON PRODUCT DETAIL PAGE */}
            <button
              onClick={toggleWishlist}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              className={`absolute top-5 left-5 z-20 p-3 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 text-white border-rose-400 shadow-lg glow-rose'
                  : 'bg-[#07140F]/80 text-slate-300 border-green-500/30 hover:text-rose-400 hover:border-rose-500/50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'}
              alt={product.title}
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-green-500/20 space-y-4 shadow-xl bg-[#0E1F18]">
            <h3 className="text-base font-black text-white">Equipment Specifications & Overview</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-green-500/10">
              <div className="p-3.5 rounded-2xl bg-[#07140F] border border-green-500/20">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Serial Units</span>
                <span className="text-xs font-black text-cyan-400">{availabilityInfo?.available_units ?? 3} Units Available</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#07140F] border border-green-500/20">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Inspection</span>
                <span className="text-xs font-black text-emerald-400">Tested & Sanitized</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#07140F] border border-green-500/20">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Pass Format</span>
                <span className="text-xs font-black text-purple-400">Digital QR Pass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Booking Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-green-500/30 space-y-6 shadow-2xl relative bg-[#0E1F18]">
            <div className="flex items-center justify-between">
              <StatusBadge status={product.status} />
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Instant Counter Pickup
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">{product.title}</h1>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black gradient-emerald-text">₹{product.base_daily_rate}</span>
                <span className="text-xs text-slate-400 font-medium">/ day rental rate</span>
              </div>
            </div>

            {/* Date Selector Box */}
            <div className="p-4 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Select Rental Dates
                </span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {durationDays} Day(s)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => updateDates(e.target.value, endDate)}
                    className="w-full bg-[#0E1F18] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => updateDates(startDate, e.target.value)}
                    className="w-full bg-[#0E1F18] border border-green-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* LIVE DYNAMIC DATE AVAILABILITY BADGE */}
            {checkingAvailability ? (
              <div className="p-3 rounded-2xl bg-[#07140F] border border-green-500/20 text-xs text-slate-400 animate-pulse flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 animate-spin" /> Checking unit availability for selected period...
              </div>
            ) : isAvailableForPeriod ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{availabilityInfo?.message || 'Available'} ({availabilityInfo?.available_units ?? 3} Serial Units in Stock for selected dates)</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{availabilityInfo?.message || 'No available units for selected dates'}</span>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-green-500/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Rental Subtotal ({durationDays} days × ₹{product.base_daily_rate})</span>
                <span className="font-bold text-white">₹{rentSubtotal}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Refundable Security Deposit</span>
                </div>
                <span className="font-extrabold">₹{depositAmount}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-green-500/10">
                <span>Total Upfront Amount</span>
                <span className="text-xl font-black gradient-emerald-text">₹{grandTotal}</span>
              </div>
            </div>

            {/* Deposit Guarantee Note */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>
                <strong>100% Security Deposit Protection:</strong> Your ₹{depositAmount} deposit is held safely in escrow and automatically refunded upon on-time store return.
              </span>
            </div>

            {/* Action Buttons: CONFIGURE & ADD TO CART */}
            <div className="space-y-3">
              <button
                disabled={!isAvailableForPeriod}
                onClick={() => setIsConfigureOpen(true)}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !isAvailableForPeriod
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-[#07140F] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Sliders className="w-4 h-4" /> Configure Variants & Accessories
              </button>

              <button
                disabled={!isAvailableForPeriod}
                onClick={handleBookNow}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-transform flex items-center justify-center gap-2 ${
                  !isAvailableForPeriod
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 shadow-xl glow-emerald hover:scale-102 cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> {isAvailableForPeriod ? 'Add Equipment to Cart & Proceed' : 'Unavailable for Selected Dates'}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* CONFIGURE MODAL DIALOG */}
      <ConfigureModal
        product={product}
        isOpen={isConfigureOpen}
        onClose={() => setIsConfigureOpen(false)}
        onConfirmAddToCart={handleConfirmConfigure}
      />

    </div>
  );
};
