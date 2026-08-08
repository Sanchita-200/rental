import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Sparkles, QrCode, ArrowRight, Package, CheckCircle2, Star,
  TrendingUp, Award, Zap, Camera, Gamepad2, Wrench, Volume2, Tent, Heart,
  ShoppingBag, Tag, Copy, Check, Gift, Sliders
} from 'lucide-react';
import { catalogApi } from '../../api/catalog.api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ConfigureModal } from '../../components/common/ConfigureModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const { addToCart } = useCart();

  // Wishlist State (persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rentflow_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Configure Modal State
  const [configuringProduct, setConfiguringProduct] = useState<Product | null>(null);

  useEffect(() => {
    catalogApi.getProducts().then((res) => {
      setFeaturedProducts(res.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistIds((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem('rentflow_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const handleConfirmAddToCartModal = (product: Product) => {
    if (!user) {
      navigate('/signup', { state: { message: 'Please sign up or log in to rent products.' } });
      return;
    }
    addToCart(product, 1);
  };

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

          {/* RIGHT COLUMN: HERO BANNER PICTURE WITH SLIDING IMAGE CAROUSEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 80 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="glass-panel p-4 rounded-3xl border border-green-500/30 glow-emerald shadow-2xl relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
                alt="Cinema Camera Rental Package"
                className="w-full h-[380px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#07140F] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-green-500/20 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">Canon EOS R6 Cinema Suite</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">₹1500 / day</span>
                </div>
                <span className="text-[11px] text-slate-300 block">Includes 24-105mm F4 Lens, Dual Batteries & Instant QR Pass</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. EXCALIDRAW WIREFRAME NEW SIGNUP COUPON WIDGET */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-[#0E2A1E] via-[#0E1F18] to-[#07140F] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 glow-emerald"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Gift className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 bg-emerald-400 px-2.5 py-0.5 rounded-full">
                  Excalidraw Exclusive Offer
                </span>
                <span className="text-xs text-emerald-300 font-bold">10% Off First Booking</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">For New Signup — Coupon Code: WELCOME10</h3>
              <p className="text-xs text-slate-300">Apply code <code className="text-emerald-400 font-bold font-mono">WELCOME10</code> at checkout to save 10% on your first rental subtotal.</p>
            </div>
          </div>

          <button
            onClick={handleCopyCoupon}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg glow-emerald hover:scale-105 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {copiedCoupon ? (
              <>
                <Check className="w-4 h-4" /> Code Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Coupon Code
              </>
            )}
          </button>
        </motion.div>
      </section>

      {/* 3. POPULAR FEATURED PRODUCTS SHOWCASE WITH CONFIGURE & WISHLIST BUTTONS */}
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
            featuredProducts.map((product, idx) => {
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="glass-panel rounded-3xl p-5 border border-green-500/20 flex flex-col justify-between space-y-4 glow-emerald group hover:border-emerald-400 transition-all hover:-translate-y-1 relative"
                >
                  {/* WISHLIST BUTTON ON EVERY FEATURED PRODUCT CARD */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    className={`absolute top-7 left-7 z-20 p-2 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-500 text-white border-rose-400 shadow-lg glow-rose'
                        : 'bg-[#07140F]/80 text-slate-300 border-green-500/30 hover:text-rose-400 hover:border-rose-500/50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>

                  <div className="space-y-3">
                    <Link to={`/product/${product.id}`} className="relative rounded-2xl overflow-hidden h-44 bg-[#07140F] block cursor-pointer">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                        In Stock
                      </div>
                    </Link>

                    <div>
                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
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
                      {/* WIREFRAME CONFIGURE BUTTON */}
                      <button
                        onClick={() => setConfiguringProduct(product)}
                        className="py-2.5 rounded-xl bg-[#07140F] border border-green-500/30 text-emerald-400 font-bold text-[11px] text-center hover:bg-green-500/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Configure
                      </button>

                      <button
                        onClick={() => {
                          if (!user) {
                            navigate('/signup', { state: { message: 'Please sign up or log in to rent products.' } });
                          } else {
                            addToCart(product);
                          }
                        }}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 shadow-lg glow-emerald hover:scale-102 transition-transform cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Rent
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
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

      {/* CONFIGURE MODAL DIALOG POPUP */}
      <ConfigureModal
        product={configuringProduct}
        isOpen={!!configuringProduct}
        onClose={() => setConfiguringProduct(null)}
        onConfirmAddToCart={handleConfirmAddToCartModal}
      />

    </div>
  );
};
