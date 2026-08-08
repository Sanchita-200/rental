import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Sparkles, QrCode, ArrowRight, Package, CheckCircle2, Star,
  TrendingUp, Award, Zap, Camera, Gamepad2, Wrench, Volume2, Tent, Heart, ShoppingBag
} from 'lucide-react';
import { catalogApi } from '../../api/catalog.api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    catalogApi.getProducts().then((res) => {
      setFeaturedProducts(res.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#07140F] text-slate-100 space-y-16 pb-16">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E1F18] via-[#13271F] to-[#07140F] pt-12 pb-20 border-b border-green-500/10">
        
        {/* Floating Abstract Green Blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-blob-1 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-blob-2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Next-Gen AI Rental Marketplace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Rent Pro Gear with <span className="gradient-emerald-text">Instant Digital QR Passes</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Access cinema cameras, gaming consoles, DJ audio setups, and power tools. 100% security deposit escrow, zero paperwork, and zero-wait counter check-ins.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/catalog"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <span>Browse Rental Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/signup"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#07140F] border border-green-500/30 text-emerald-400 font-bold text-xs hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Create Free Account
              </Link>
            </div>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-green-500/10 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Escrow Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Digital QR Pass</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Late Fee Rules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 AI Smart Assistant</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative">
            <div className="glass-panel p-6 rounded-3xl border border-green-500/30 shadow-2xl glow-emerald space-y-6">
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
                  alt="Featured Equipment"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                  Available Today
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Sony FX3 Full-Frame Cinema Package</h3>
                  <p className="text-xs text-slate-400">Includes 24-70mm GM Lens + 2x 160GB Tough CFexpress Cards</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400 block">₹2,500</span>
                  <span className="text-[10px] text-slate-400">/ day + ₹15,000 Deposit</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#07140F] border border-green-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Includes Instant QR Pass for Counter Pickup</span>
                </div>
                <span className="text-emerald-400 font-bold">In Stock</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW RENTFLOW WORKS (3-STEP WORKFLOW) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Simplified 3-Step Process</span>
          <h2 className="text-3xl font-black text-white">How RentFlow AI Works</h2>
          <p className="text-xs text-slate-400">Renting professional gear has never been faster or safer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-4 glow-emerald text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl font-black">
              1
            </div>
            <h3 className="text-base font-bold text-white">Select Gear & Rental Dates</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browse our catalog of verified equipment. Choose your exact pickup and return dates with transparent daily rates.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-4 glow-emerald text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto text-xl font-black">
              2
            </div>
            <h3 className="text-base font-bold text-white">Get Instant Digital QR Pass</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete checkout with 100% refundable deposit escrow protection. Receive an instant encrypted QR pass on your smartphone.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-4 glow-emerald text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl font-black">
              3
            </div>
            <h3 className="text-base font-bold text-white">Zero-Wait Store Pickup & Return</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scan your QR pass at the store counter for zero-wait pickup. Deposit escrow is automatically refunded upon return.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white">Explore Equipment Categories</h2>
            <p className="text-xs text-slate-400">Select a category to view available rental items</p>
          </div>

          <Link to="/catalog" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Cameras & Lenses', icon: Camera, color: 'text-emerald-400' },
            { title: 'Gaming & VR', icon: Gamepad2, color: 'text-cyan-400' },
            { title: 'Power Tools', icon: Wrench, color: 'text-amber-400' },
            { title: 'Audio & DJ Setup', icon: Volume2, color: 'text-purple-400' },
            { title: 'Camping & Outdoor', icon: Tent, color: 'text-rose-400' },
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to="/catalog"
                className="glass-panel p-5 rounded-3xl border border-green-500/20 text-center space-y-3 hover:border-emerald-400 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-[#07140F] border border-green-500/20 flex items-center justify-center mx-auto ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white block">{cat.title}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. TOP FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white">Popular Equipment for Rent</h2>
            <p className="text-xs text-slate-400">High-demand items ready for instant counter pickup</p>
          </div>

          <Link to="/catalog" className="text-xs font-bold text-emerald-400 hover:underline">
            Browse Full Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div
                key={product.id}
                className="glass-panel rounded-3xl p-5 border border-green-500/20 flex flex-col justify-between space-y-4 glow-emerald group hover:border-emerald-400 transition-colors"
              >
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden h-44 bg-[#07140F]">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                      In Stock
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{product.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-green-500/10">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-emerald-400">₹{product.base_daily_rate}</span>
                      <span className="text-[10px] text-slate-400"> / day</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">₹{product.security_deposit_amount} Deposit</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="py-2 rounded-xl bg-[#07140F] border border-green-500/30 text-emerald-400 font-bold text-[11px] text-center hover:bg-green-500/10 transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center gap-1 shadow-lg glow-emerald"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Rent
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel p-5 rounded-3xl border border-green-500/20 space-y-4 animate-pulse">
                <div className="w-full h-44 bg-[#07140F] rounded-2xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="p-10 rounded-3xl glass-panel border border-green-500/30 bg-gradient-to-r from-[#13271F] via-[#0E1F18] to-[#07140F] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 glow-emerald">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black text-white">Ready to Rent Premium Equipment?</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Create an account now to access thousands of gear items with instant QR counter pickup and 100% deposit escrow security.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/catalog"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald"
            >
              Start Renting Now →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
