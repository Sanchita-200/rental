import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, ShieldCheck, Sparkles, Filter, Package, Check, ChevronLeft, ChevronRight, X, SlidersHorizontal, ShoppingBag, Heart, Sliders } from 'lucide-react';
import { catalogApi } from '../../api/catalog.api';
import type { Product, Category } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfigureModal } from '../../components/common/ConfigureModal';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set());

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

  // Wireframe Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('All Duration');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const BRANDS = ['Sony', 'Canon', 'Apple', 'Bose', 'Bosch', 'Epson', 'PlayStation', 'DJI'];
  const COLOR_SWATCHES = [
    { name: 'Blue', color: '#2563eb' },
    { name: 'Mustard', color: '#d97706' },
    { name: 'Purple', color: '#9333ea' },
    { name: 'Orange', color: '#ea580c' },
    { name: 'Brown', color: '#78350f' },
    { name: 'Black', color: '#171717' },
  ];
  const DURATIONS = ['All Duration', 'Per Hour', 'Per Day', '1 Month', '6 Month', '1 Year', '2 Years', '3 Years'];

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

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleRentClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    if (product.status !== 'AVAILABLE') return;

    if (!user) {
      navigate('/signup', { state: { message: 'Please sign up or log in to rent products.' } });
      return;
    }

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

  const handleConfirmAddToCartModal = (product: Product) => {
    if (!user) {
      navigate('/signup', { state: { message: 'Please sign up or log in to rent products.' } });
      return;
    }
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

  // Filter products by Wireframe Sidebar Filters
  const filteredProducts = products.filter((p) => {
    if (selectedBrands.length > 0) {
      const matchesBrand = selectedBrands.some((b) =>
        p.title.toLowerCase().includes(b.toLowerCase()) || p.description.toLowerCase().includes(b.toLowerCase())
      );
      if (!matchesBrand) return false;
    }
    if (p.base_daily_rate > maxPrice) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#07140F]">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-green-500/20 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {user ? 'Customer Portal' : 'Public Rental Catalog'}
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Equipment & Products Catalog</h1>
          <p className="text-xs text-slate-400">Select products, configure variants & add-ons, and get instant counter QR passes</p>
        </div>

        {/* Search Bar matching Wireframe Header */}
        <div className="relative min-w-[280px] w-full md:w-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment, tools, tech..."
            className="w-full bg-[#0E1F18] border border-green-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
      </div>

      {/* Main Layout: Wireframe Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================================================================== */}
        {/* EXCALIDRAW WIREFRAME LEFT SIDEBAR FILTERS */}
        {/* ==================================================================== */}
        <aside className="lg:col-span-3 glass-panel rounded-3xl p-6 border border-green-500/30 space-y-6 shadow-xl bg-[#0E1F18]">
          <div className="flex items-center justify-between border-b border-green-500/20 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Filter Equipment
            </h3>
            {(selectedBrands.length > 0 || selectedColor || selectedCategory || maxPrice < 20000) && (
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedColor(null);
                  setSelectedCategory('');
                  setMaxPrice(20000);
                }}
                className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* 1. BRAND FILTER */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-200 block uppercase tracking-wider">Brand</span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {BRANDS.map((brand) => {
                const checked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer py-1 px-2 rounded-lg hover:bg-[#07140F] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500"
                      />
                      <span>{brand}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. COLOR SWATCHES FILTER */}
          <div className="space-y-2.5 border-t border-green-500/10 pt-4">
            <span className="text-xs font-bold text-slate-200 block uppercase tracking-wider">Color Swatch</span>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_SWATCHES.map((swatch) => {
                const isSelected = selectedColor === swatch.name;
                return (
                  <button
                    key={swatch.name}
                    onClick={() => setSelectedColor(isSelected ? null : swatch.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative ${
                      isSelected ? 'scale-110 border-emerald-400 ring-2 ring-emerald-400/40' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.color }}
                    title={swatch.name}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. DURATION FREQUENCY FILTER */}
          <div className="space-y-2.5 border-t border-green-500/10 pt-4">
            <span className="text-xs font-bold text-slate-200 block uppercase tracking-wider">Duration</span>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d} className="bg-[#07140F] text-white">{d}</option>
              ))}
            </select>
          </div>

          {/* 4. PRICE RANGE SLIDER */}
          <div className="space-y-2.5 border-t border-green-500/10 pt-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-200 uppercase tracking-wider">Price Range</span>
              <span className="text-emerald-400 font-mono">Up to ₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-[#07140F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹10</span>
              <span>₹20,000+</span>
            </div>
          </div>

        </aside>

        {/* ==================================================================== */}
        {/* EXCALIDRAW WIREFRAME MAIN PRODUCT GRID & CARDS */}
        {/* ==================================================================== */}
        <main className="lg:col-span-9 space-y-6">

          {/* Category Pills Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald'
                  : 'bg-[#0E1F18] border border-green-500/20 text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald'
                    : 'bg-[#0E1F18] border border-green-500/20 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 glass-panel rounded-3xl animate-pulse p-4 border border-green-500/10" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-green-500/20 space-y-3">
              <Package className="w-12 h-12 text-emerald-500/40 mx-auto" />
              <h3 className="text-base font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400">Try adjusting your sidebar brand, color, or price filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isAdded = addedItemIds.has(product.id);
                const isWishlisted = wishlistIds.includes(product.id);
                const isOutOfStock = product.status !== 'AVAILABLE';

                return (
                  <div
                    key={product.id}
                    className={`glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border border-green-500/20 hover:border-emerald-400 transition-all group shadow-xl bg-[#0E1F18] relative ${
                      isOutOfStock ? 'opacity-85' : ''
                    }`}
                  >
                    {/* WISHLIST BUTTON ON EVERY PRODUCT CARD */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      className={`absolute top-3 left-3 z-20 p-2 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500 text-white border-rose-400 shadow-lg glow-rose'
                          : 'bg-[#07140F]/80 text-slate-300 border-green-500/30 hover:text-rose-400 hover:border-rose-500/50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>

                    {/* Product Image Link */}
                    <Link
                      to={`/product/${product.id}`}
                      className="relative h-52 bg-[#07140F] overflow-hidden block cursor-pointer"
                    >
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* WIREFRAME "Out of stock" Overlay */}
                      {isOutOfStock ? (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-xs uppercase tracking-widest border border-rose-400 shadow-2xl">
                            Out of Stock
                          </span>
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 z-10">
                          <StatusBadge status={product.status} />
                        </div>
                      )}

                      {/* Deposit tag */}
                      <div className="absolute bottom-3 left-3 bg-[#07140F]/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-green-500/20 text-[10px] text-amber-400 font-bold z-10">
                        Deposit: ₹{product.security_deposit_amount}
                      </div>
                    </Link>

                    {/* WIREFRAME COLOR SWATCH TAGS & VARIANT INFO */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* CLICKABLE PRODUCT TITLE */}
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                        </Link>

                        {/* Wireframe Color Swatches Under Image */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white/20 shadow-sm" title="Blue Variant" />
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white/20 shadow-sm" title="Mustard Variant" />
                            <span className="text-[10px] text-slate-400 font-mono ml-1">
                              {product.title.toLowerCase().includes('tv') ? '36, 42 & 55 inch TV' : 'Multi-Variant'}
                            </span>
                          </div>

                          {/* WIREFRAME CONFIGURE BUTTON */}
                          <button
                            onClick={() => setConfiguringProduct(product)}
                            className="px-2.5 py-1 rounded-xl bg-[#07140F] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Sliders className="w-3 h-3" /> Configure
                          </button>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* WIREFRAME RATE DISPLAY (Rs xx / per day / per hour / per month) */}
                      <div className="pt-3 border-t border-green-500/10 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Rate</span>
                          <span className="text-base font-black text-emerald-400">₹{product.base_daily_rate}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {selectedDuration === 'Per Hour' ? ' / per hour' : selectedDuration.includes('Month') ? ' / per month' : ' / per day'}
                          </span>
                        </div>

                        <button
                          disabled={isOutOfStock}
                          onClick={(e) => handleRentClick(product, e)}
                          className={`px-3 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isOutOfStock
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                              : isAdded
                              ? 'bg-emerald-600 text-slate-950 shadow'
                              : 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald hover:scale-105'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" /> Rent Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================================================================== */}
          {/* EXCALIDRAW WIREFRAME BOTTOM PAGINATION CONTROLS */}
          {/* ==================================================================== */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-[#0E1F18] border border-green-500/20 text-slate-300 hover:text-emerald-400 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald'
                    : 'bg-[#0E1F18] border border-green-500/20 text-slate-300 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2.5 rounded-xl bg-[#0E1F18] border border-green-500/20 text-slate-300 hover:text-emerald-400 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </main>
      </div>

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
