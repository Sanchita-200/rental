import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { catalogApi } from '../../api/catalog.api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

export const WishlistPage: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    catalogApi.getProducts().then((res) => {
      // Mock wishlist items from first 3 products
      setWishlistProducts(res.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlistProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-8 bg-[#07140F]">
      
      <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> My Saved Wishlist
          </h1>
          <p className="text-xs text-slate-400">Products saved for upcoming rental bookings</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          {wishlistProducts.length} Saved Equipment Items
        </span>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="glass-panel rounded-3xl p-5 border border-green-500/20 flex flex-col justify-between space-y-4 glow-emerald">
              <div className="space-y-3">
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                  alt={product.title}
                  className="w-full h-48 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{product.title}</h3>
                  <span className="text-xs font-extrabold text-emerald-400">₹{product.base_daily_rate} / day</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-green-500/10">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg glow-emerald"
                >
                  <ShoppingBag className="w-4 h-4" /> Rent Now
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-2 rounded-xl bg-[#07140F] border border-rose-500/30 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400">Explore our equipment catalog to save your favorite gear!</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg glow-emerald"
          >
            Browse Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
};
