import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, ShieldCheck, Sparkles, Filter, Package, ArrowRight, Check } from 'lucide-react';
import { catalogApi } from '../../api/catalog.api';
import type { Product, Category } from '../../types';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set());

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsData, prodsData] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getProducts({ category_id: selectedCategory || undefined, search: searchQuery || undefined })
        ]);
        setCategories(catsData);
        setProducts(prodsData);
      } catch (err) {
        console.error('Failed to load catalog data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedItemIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItemIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl glass-panel p-8 sm:p-12 overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Upfront Deposit & Zero Overdue Hassle</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Rent Premium Gear with <span className="gradient-text">Complete Peace of Mind</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            Professional Cameras, Next-Gen Consoles, Audio Systems, and Power Tools available for daily rental. Transparent security deposits and instant digital QR passes.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Refundable Deposit Hold</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Instant QR Pass Pickup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg glow-indigo'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg glow-indigo'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cameras, consoles, tools..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 glass-panel rounded-2xl animate-pulse p-4" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No products found</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or search keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isAdded = addedItemIds.has(product.id);
            return (
              <div
                key={product.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={product.status} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-amber-400 font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Deposit: ₹{product.security_deposit_amount}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Daily Rent</span>
                      <span className="text-lg font-extrabold text-indigo-400">₹{product.base_daily_rate}</span>
                      <span className="text-[10px] text-slate-500"> / day</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg glow-indigo'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" /> Added
                          </>
                        ) : (
                          'Rent Now'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
