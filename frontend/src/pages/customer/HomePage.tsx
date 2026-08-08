import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-[#07140F] text-slate-100 space-y-16 pb-16 overflow-hidden">
      
      {/* 1. HERO BANNER SECTION WITH SIDE SLIDING MOTION & PICTURE TRANSITION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E1F18] via-[#13271F] to-[#07140F] pt-12 pb-20 border-b border-green-500/10">
        
        {/* Floating Abstract Green Blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-blob-1 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-blob-2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN: TEXT SLIDES SMOOTHLY FROM THE LEFT */}
          <div className="space-y-6 text-center lg:text-left">
            
            {/* Badge Fade Down */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4" /> Next-Gen AI Rental Marketplace
            </motion.div>

            {/* Main Headline Slide From Left */}
            <motion.h1
              initial={{ opacity: 0, x: -90 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
            >
              Rent Pro Gear with <span className="gradient-emerald-text">Instant Digital QR Passes</span>
            </motion.h1>

            {/* Paragraph Subtitle Slide From Left */}
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
              className="text-sm text-slate-300 leading-relaxed max-w-xl"
            >
              Access cinema cameras, gaming consoles, DJ audio setups, and power tools. 100% security deposit escrow, zero paperwork, and zero-wait counter check-ins.
            </motion.p>

            {/* Action Buttons Slide Up */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/catalog"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Rental Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/signup"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#07140F] border border-green-500/30 text-emerald-400 font-bold text-xs hover:bg-green-500/10 hover:border-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Create Free Account
              </Link>
            </motion.div>

            {/* Bullet Highlights Slide From Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
              className="grid grid-cols-2 gap-3 pt-4 border-t border-green-500/10 text-xs font-medium text-slate-300"
            >
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
            </motion.div>
          </div>

          {/* RIGHT COLUMN: HERO PICTURE CARD SLIDES SMOOTHLY FROM THE RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 90, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative"
          >
            <div className="glass-panel p-6 rounded-3xl border border-green-500/30 shadow-2xl glow-emerald space-y-6 animate-float">
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
                  alt="Featured Equipment"
                  className="w-full h-64 object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase shadow-lg">
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
          </motion.div>

        </div>
      </section>

      {/* 2. HOW RENTFLOW WORKS (3-STEP WORKFLOW WITH STAGGERED SCROLL ENTRANCE) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 max-w-2xl mx-auto"
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Simplified 3-Step Process</span>
          <h2 className="text-3xl font-black text-white">How RentFlow AI Works</h2>
          <p className="text-xs text-slate-400">Renting professional gear has never been faster or safer</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: 1, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', title: 'Select Gear & Rental Dates', desc: 'Browse our catalog of verified equipment. Choose your exact pickup and return dates with transparent daily rates.' },
            { step: 2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', title: 'Get Instant Digital QR Pass', desc: 'Complete checkout with 100% refundable deposit escrow protection. Receive an instant encrypted QR pass on your smartphone.' },
            { step: 3, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', title: 'Zero-Wait Store Pickup & Return', desc: 'Scan your QR pass at the store counter for zero-wait pickup. Deposit escrow is automatically refunded upon return.' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-4 glow-emerald text-center hover:scale-105 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto text-xl font-black ${item.color}`}>
                {item.step}
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES GRID WITH SCROLL SLIDE ENTRANCE */}
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
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link
                  to="/catalog"
                  className="glass-panel p-5 rounded-3xl border border-green-500/20 text-center space-y-3 hover:border-emerald-400 transition-all block group hover:scale-105"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-[#07140F] border border-green-500/20 flex items-center justify-center mx-auto ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white block">{cat.title}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. TOP FEATURED PRODUCTS SHOWCASE WITH MOTION CARDS */}
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
            featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="glass-panel rounded-3xl p-5 border border-green-500/20 flex flex-col justify-between space-y-4 glow-emerald group hover:border-emerald-400 transition-all hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden h-44 bg-[#07140F]">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
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
                      className="py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center gap-1 shadow-lg glow-emerald hover:scale-102 transition-transform"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Rent
                    </button>
                  </div>
                </div>
              </motion.div>
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

      {/* 5. CALL TO ACTION BANNER WITH MOTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-10 rounded-3xl glass-panel border border-green-500/30 bg-gradient-to-r from-[#13271F] via-[#0E1F18] to-[#07140F] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 glow-emerald"
        >
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black text-white">Ready to Rent Premium Equipment?</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Create an account now to access thousands of gear items with instant QR counter pickup and 100% deposit escrow security.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/catalog"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:scale-105 transition-all"
            >
              Start Renting Now →
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
