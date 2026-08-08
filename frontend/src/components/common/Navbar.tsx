import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Shield, QrCode, LayoutDashboard, Package, BarChart2,
  LogOut, Search, Heart, Home, FileText, Info, Mail, User, ChevronDown,
  Truck, Building2, Receipt, CalendarCheck, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isActive = (path: string) => location.pathname === path;

  // If on admin routes, let the dedicated Admin Dashboard taskbar handle navigation
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isAdminOrVendor = user && (user.role === 'ADMIN' || user.role === 'VENDOR');
  const isCustomer = user && user.role === 'CUSTOMER';

  return (
    <nav className="sticky top-0 z-40 bg-[#0E1F18]/95 backdrop-blur-md border-b border-green-500/20 px-4 lg:px-8 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Sticky Logo */}
        <Link
          to={isAdminOrVendor ? "/admin/dashboard" : isCustomer ? "/catalog" : "/"}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center shadow-lg glow-emerald group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-lg font-black gradient-emerald-text tracking-tight">RentFlow AI</span>
            <span className="block text-[9px] uppercase font-extrabold text-emerald-400 tracking-widest">
              {isAdminOrVendor
                ? (user?.role === 'VENDOR' ? 'Vendor Portal' : 'Admin Operations')
                : isCustomer
                ? 'Customer Portal'
                : 'Enterprise Suite'}
            </span>
          </div>
        </Link>

        {/* Global Search Bar (for customers & visitors browsing equipment) */}
        {!isAdminOrVendor && (
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search rental equipment..."
              className="w-full bg-[#07140F] border border-green-500/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE-AWARE TOP NAVIGATION BAR */}
        {/* ==================================================================== */}
        {isAdminOrVendor ? (
          /* 1. Admin / Vendor Workspace Navigation */
          <div className="hidden md:flex items-center gap-1.5 bg-[#07140F] p-1 rounded-xl border border-emerald-500/30">
            <Link
              to="/admin/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isActive('/admin/dashboard') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Link>

            <Link
              to="/admin/pickup-return"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isActive('/admin/pickup-return') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Pickup & Return Ops
            </Link>

            <Link
              to="/admin/analytics"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isActive('/admin/analytics') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Analytics & AI
            </Link>
          </div>
        ) : isCustomer ? (
          /* 2. Logged-in Customer Exclusive Portal Navigation */
          <div className="hidden md:flex items-center gap-1.5 bg-[#07140F] p-1 rounded-xl border border-emerald-500/30 shadow-inner">
            <Link
              to="/catalog"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/catalog') ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Explore Equipment
            </Link>

            <Link
              to="/my-rentals"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/my-rentals') ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald' : 'text-slate-300 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" /> My Rentals & Passes
            </Link>

            <Link
              to="/my-rentals?tab=invoices"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                location.search.includes('tab=invoices') ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> Invoices
            </Link>

            <Link
              to="/profile"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/profile') ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow glow-emerald' : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Profile & Addresses
            </Link>
          </div>
        ) : (
          /* 3. Public Visitor Marketing Navigation */
          <div className="hidden md:flex items-center gap-1 bg-[#07140F] p-1 rounded-xl border border-green-500/20">
            <Link
              to="/"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                isActive('/') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </Link>

            <Link
              to="/catalog"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                isActive('/catalog') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Products
            </Link>

            <Link
              to="/about"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                isActive('/about') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" /> About Us
            </Link>

            <Link
              to="/terms"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                isActive('/terms') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Terms
            </Link>

            <Link
              to="/contact"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                isActive('/contact') ? 'bg-emerald-600 text-slate-950 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Contact Us
            </Link>
          </div>
        )}

        {/* Right Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          
          {user ? (
            <>
              {/* Only show Wishlist and Cart for Customer accounts */}
              {!isAdminOrVendor && (
                <>
                  {/* Wishlist Icon */}
                  <Link
                    to="/wishlist"
                    title="Wishlist"
                    className="relative p-2 rounded-xl bg-[#07140F] border border-green-500/20 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-rose-400" />
                  </Link>

                  {/* Shopping Cart Icon */}
                  <Link
                    to="/cart"
                    title="Rental Cart"
                    className="relative p-2 rounded-xl bg-[#07140F] border border-green-500/20 text-slate-300 hover:text-white hover:border-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    {cartCount > 0 && (
                      <span className="bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Admin/Vendor badge */}
              {isAdminOrVendor && (
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg glow-emerald"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Cockpit</span>
                </Link>
              )}

              {/* User Profile Section Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#07140F] border border-green-500/30 hover:border-emerald-400 transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                  />
                  <span className="text-xs font-bold text-white hidden lg:inline">{user.full_name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-60 glass-panel rounded-2xl p-2 border border-green-500/30 shadow-2xl space-y-1 z-50 animate-fade-in"
                  >
                    <div className="p-2 border-b border-green-500/10">
                      <span className="text-xs font-bold text-white block truncate">{user.full_name}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">{user.role} ACCOUNT</span>
                    </div>

                    {isAdminOrVendor ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Cockpit
                        </Link>
                        <Link
                          to="/admin/pickup-return"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
                        >
                          <Truck className="w-4 h-4 text-emerald-400" /> Pickup & Return Ops
                        </Link>
                        <Link
                          to="/admin/analytics"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
                        >
                          <BarChart2 className="w-4 h-4 text-emerald-400" /> Analytics & AI
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
                        >
                          <User className="w-4 h-4 text-emerald-400" /> My Account / My Profile
                        </Link>

                        <Link
                          to="/my-rentals"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
                        >
                          <CalendarCheck className="w-4 h-4 text-emerald-400" /> My Orders
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-emerald-400" /> Settings
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-green-500/10 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Vendor / Admin Registration Button */}
              <Link
                to="/vendor-register"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#13251D] hover:bg-[#1B362A] text-emerald-300 border border-emerald-500/30 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vendor Register</span>
              </Link>

              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 shadow-lg glow-emerald hover:opacity-95 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
};
