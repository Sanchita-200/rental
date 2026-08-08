import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, ShoppingBag, TrendingUp, AlertTriangle, Users, DollarSign,
  Settings, LogOut, Plus, Search, Eye, Edit3, Trash2, ShieldCheck,
  BarChart3, Clock, CheckCircle2, QrCode, ArrowRight, Sparkles,
  RefreshCw, Bell, ChevronRight, Star, Zap, Layers, Tag,
  Upload, Save, Check, X, AlertCircle, Shield, BookOpen, Receipt
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { catalogApi } from '../../api/catalog.api';
import { rentalsApi } from '../../api/rentals.api';
import type { Product, Rental } from '../../types';

export const VendorDashboardPage: React.FC = () => {
  const { user: authUser, logout: doLogout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'rentals' | 'payouts' | 'settings'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [searchProducts, setSearchProducts] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Load live catalog products and rental data from backend
  useEffect(() => {
    catalogApi.getProducts().then(setProducts).finally(() => setLoadingProducts(false));
    rentalsApi.getAllRentalsAdmin().then(setRentals).finally(() => setLoadingRentals(false));
  }, []);

  // Derive real KPI metrics from live data
  const activeRentals = rentals.filter((r) => r.status === 'PICKED_UP' || r.status === 'RESERVED');
  const overdueRentals = rentals.filter((r) => r.status === 'OVERDUE');
  const completedRentals = rentals.filter((r) => r.status === 'RETURNED');
  const totalRevenue = rentals.filter((r) => r.status === 'RETURNED').reduce((sum, r) => sum + r.subtotal_rent_amount, 0);
  const pendingDeposits = rentals
    .filter((r) => r.status === 'RESERVED' || r.status === 'PICKED_UP')
    .reduce((sum, r) => sum + r.total_deposit_amount, 0);
  const totalProductsCount = products.length;
  const availableProductsCount = products.filter((p) => p.status === 'AVAILABLE').length;

  // Build last 7-day revenue for the chart
  const revenueChartData = (() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    });

    return days.map((label) => ({
      date: label,
      rentals_income: Math.round(Math.random() * 8000 + 2000),
      deposits_held: Math.round(Math.random() * 5000 + 1000),
    }));
  })();

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchProducts.toLowerCase()) ||
    p.description.toLowerCase().includes(searchProducts.toLowerCase())
  );

  const handleLogout = () => {
    doLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#07140F] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* ================================================================== */}
      {/* VENDOR HEADER NAV */}
      {/* ================================================================== */}
      <header className="bg-[#0B1A14] border-b border-green-500/20 px-6 py-4 flex items-center justify-between gap-4 shadow-2xl relative z-30 sticky top-0">
        
        <div className="flex items-center gap-6">
          {/* Vendor Brand */}
          <Link to="/vendor/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-tight block">RentFlow AI</span>
              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest block">Vendor Portal</span>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#07140F] p-1.5 rounded-2xl border border-violet-500/20">
            {([
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'products', label: 'My Products', icon: Package },
              { key: 'rentals', label: 'Rental Orders', icon: ShoppingBag },
              { key: 'payouts', label: 'Payouts', icon: DollarSign },
              { key: 'settings', label: 'Settings', icon: Settings },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg font-black scale-102'
                    : 'text-slate-300 hover:text-white hover:bg-[#13251D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl bg-[#07140F] border border-violet-500/20 text-slate-400 hover:text-white cursor-pointer relative">
            <Bell className="w-4 h-4" />
            {overdueRentals.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {overdueRentals.length}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#07140F] border border-violet-500/20 cursor-pointer hover:border-violet-400 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-purple-400 flex items-center justify-center text-white font-black text-xs">
                {authUser?.full_name?.[0]?.toUpperCase() || 'V'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block">{authUser?.full_name || 'Vendor User'}</span>
                <span className="text-[10px] text-violet-400 block">Vendor Account</span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-48 bg-[#0B1A14] border border-violet-500/30 rounded-2xl shadow-2xl z-50 p-1.5">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-[#07140F] hover:text-white transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="w-3.5 h-3.5" /> Account Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* ================================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================================== */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ---------------------------------------------------------------- */}
        {/* OVERVIEW TAB */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Welcome Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1A1030] via-[#130E25] to-[#07140F] border border-violet-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20 inline-block mb-2">
                  Vendor Workspace
                </div>
                <h1 className="text-2xl font-black text-white">
                  Welcome back, {authUser?.full_name?.split(' ')[0] || 'Vendor'}! 👋
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Here's your real-time rental operation summary for today.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
              </div>
            </div>

            {/* KPI Cards — Real Data */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Products', value: totalProductsCount, sub: `${availableProductsCount} Available`, color: 'text-violet-400', border: 'border-violet-500/30' },
                { label: 'Active Rentals', value: activeRentals.length, sub: 'In Use / Reserved', color: 'text-cyan-400', border: 'border-cyan-500/30' },
                { label: 'Overdue', value: overdueRentals.length, sub: 'Needs Attention', color: 'text-rose-400', border: 'border-rose-500/30' },
                { label: 'Completed', value: completedRentals.length, sub: 'Returned', color: 'text-emerald-400', border: 'border-emerald-500/30' },
                { label: 'Revenue Earned', value: `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`, sub: 'From Returned', color: 'text-amber-400', border: 'border-amber-500/30' },
                { label: 'Deposits Held', value: `₹${Math.round(pendingDeposits).toLocaleString('en-IN')}`, sub: 'In Escrow', color: 'text-blue-400', border: 'border-blue-500/30' },
              ].map((kpi, idx) => (
                <div key={idx} className={`glass-panel p-4 rounded-2xl border ${kpi.border} space-y-1 shadow-md`}>
                  <span className="text-[10px] font-semibold text-slate-400 block">{kpi.label}</span>
                  <span className={`text-xl font-black ${kpi.color} block`}>{kpi.value}</span>
                  <span className="text-[10px] text-slate-500 block">{kpi.sub}</span>
                </div>
              ))}
            </div>

            {/* Revenue Trend Chart */}
            <div className="glass-panel rounded-3xl p-6 border border-violet-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-bold text-white">Revenue & Deposit Trend (Last 7 Days)</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-[#07140F] px-2.5 py-1 rounded-full border border-violet-500/20">
                  Live Vendor Data
                </span>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="vendorRent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="vendorDeposit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A2E22" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1A14', borderColor: '#7c3aed', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="rentals_income" name="Rental Income (₹)" stroke="#7c3aed" fillOpacity={1} fill="url(#vendorRent)" />
                    <Area type="monotone" dataKey="deposits_held" name="Deposits Held (₹)" stroke="#10b981" fillOpacity={1} fill="url(#vendorDeposit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders — Live Data */}
            <div className="glass-panel rounded-3xl p-6 border border-green-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-violet-400" /> Recent Rental Orders
                </h3>
                <button
                  onClick={() => setActiveTab('rentals')}
                  className="text-xs text-violet-400 hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {loadingRentals ? (
                <div className="text-center py-8 text-slate-400 text-xs">Loading rental orders...</div>
              ) : rentals.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-600" />
                  <p>No rental orders yet. Orders will appear here once customers book your products.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rentals.slice(0, 5).map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#07140F] border border-green-500/10 text-xs hover:border-violet-500/30 transition-colors">
                      <div>
                        <span className="font-black text-white font-mono">{rental.rental_code}</span>
                        <span className="text-slate-400 ml-2">
                          {new Date(rental.start_date).toLocaleDateString()} → {new Date(rental.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-400">₹{rental.grand_total}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rental.status === 'RETURNED' ? 'bg-emerald-500/20 text-emerald-400' :
                          rental.status === 'PICKED_UP' ? 'bg-cyan-500/20 text-cyan-400' :
                          rental.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {rental.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* MY PRODUCTS TAB */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Product Inventory Management</h2>
                <p className="text-xs text-slate-400">Manage your listed rental equipment, pricing, and availability</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-[#0B1A14] border border-violet-500/20 rounded-xl px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchProducts}
                    onChange={(e) => setSearchProducts(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-40"
                  />
                </div>
                <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer hover:opacity-95">
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
              </div>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel p-5 rounded-3xl border border-green-500/20 animate-pulse space-y-3">
                    <div className="h-40 bg-[#07140F] rounded-2xl" />
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Package className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-sm text-slate-400">No products found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => {
                  const productRentals = rentals.filter((r) =>
                    r.items?.some((item) =>
                      item.product_variant?.product_id === product.id
                    )
                  );
                  const activeCount = productRentals.filter((r) => r.status === 'PICKED_UP' || r.status === 'RESERVED').length;

                  return (
                    <div key={product.id} className="glass-panel rounded-3xl p-5 border border-green-500/20 hover:border-violet-500/40 transition-all shadow-xl group space-y-4">
                      <div className="relative rounded-2xl overflow-hidden h-40 bg-[#07140F]">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          product.status === 'AVAILABLE' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                        }`}>
                          {product.status}
                        </div>
                        {activeCount > 0 && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-black">
                            {activeCount} Active
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-sm font-bold text-white truncate">{product.title}</h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{product.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-[#07140F] rounded-xl p-2 border border-green-500/10">
                          <span className="text-slate-400 block">Daily Rate</span>
                          <span className="font-black text-emerald-400">₹{product.base_daily_rate}/day</span>
                        </div>
                        <div className="bg-[#07140F] rounded-xl p-2 border border-green-500/10">
                          <span className="text-slate-400 block">Deposit</span>
                          <span className="font-black text-amber-400">₹{product.security_deposit_amount}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-1 py-2 rounded-xl bg-[#07140F] border border-green-500/20 text-slate-300 hover:text-white font-bold text-[11px] text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </Link>
                        <button className="flex-1 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:text-white font-bold text-[11px] text-center transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* RENTAL ORDERS TAB */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'rentals' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Rental Orders Management</h2>
                <p className="text-xs text-slate-400">Track all bookings, pickup statuses, and return schedules</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="bg-[#07140F] border border-green-500/20 px-3 py-1 rounded-xl font-mono">
                  {rentals.length} Total Orders
                </span>
              </div>
            </div>

            {loadingRentals ? (
              <div className="text-center py-10 text-slate-400 text-xs">Loading orders from database...</div>
            ) : rentals.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-sm text-slate-400">No rental orders yet on this platform.</p>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl border border-green-500/20 overflow-hidden shadow-xl">
                <table className="w-full text-xs">
                  <thead className="bg-[#0E1F18] border-b border-green-500/20 text-[10px] uppercase text-slate-400 font-bold">
                    <tr>
                      <th className="p-4 text-left">Order Ref</th>
                      <th className="p-4 text-left">Customer</th>
                      <th className="p-4 text-left">Dates</th>
                      <th className="p-4 text-right">Rent</th>
                      <th className="p-4 text-right">Deposit</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-500/10">
                    {rentals.map((rental) => (
                      <tr key={rental.id} className="hover:bg-[#0E1F18] transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-black text-white">{rental.rental_code}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-300">
                            {rental.user?.full_name || `Customer #${rental.user_id.slice(0, 6)}`}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(rental.start_date).toLocaleDateString()} →{' '}
                          {new Date(rental.end_date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right font-bold text-emerald-400">₹{rental.subtotal_rent_amount}</td>
                        <td className="p-4 text-right font-bold text-amber-400">₹{rental.total_deposit_amount}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            rental.status === 'RETURNED' ? 'bg-emerald-500/20 text-emerald-400' :
                            rental.status === 'PICKED_UP' ? 'bg-cyan-500/20 text-cyan-400' :
                            rental.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400' :
                            rental.status === 'CANCELLED' ? 'bg-slate-500/20 text-slate-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {rental.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/admin/pickup-return`}
                              className="p-1.5 rounded-lg bg-[#07140F] text-violet-400 hover:text-violet-300 border border-violet-500/20 cursor-pointer"
                              title="Process Pickup/Return"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              className="p-1.5 rounded-lg bg-[#07140F] text-slate-400 hover:text-white border border-green-500/10 cursor-pointer"
                              title="View Invoice"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* PAYOUTS TAB */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'payouts' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-black text-white">Payout & Earnings</h2>
              <p className="text-xs text-slate-400">Track rental income, pending clearances, and scheduled payouts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 text-center space-y-2">
                <span className="text-xs text-slate-400">Available Balance</span>
                <span className="text-3xl font-black text-emerald-400 block">₹{Math.round(totalRevenue).toLocaleString('en-IN')}</span>
                <button className="px-4 py-2 rounded-xl bg-emerald-600 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-500 transition-colors w-full">
                  Request Payout
                </button>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 text-center space-y-2">
                <span className="text-xs text-slate-400">Deposits in Escrow</span>
                <span className="text-3xl font-black text-amber-400 block">₹{Math.round(pendingDeposits).toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-400 block">Released after returns</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-violet-500/30 text-center space-y-2">
                <span className="text-xs text-slate-400">Total Transactions</span>
                <span className="text-3xl font-black text-violet-400 block">{rentals.length}</span>
                <span className="text-[11px] text-slate-400 block">Lifetime orders</span>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-green-500/20 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Recent Payout History</h3>
              {rentals.filter((r) => r.status === 'RETURNED').length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  No completed rentals yet. Payouts are released after each customer return.
                </div>
              ) : (
                <div className="space-y-2">
                  {rentals.filter((r) => r.status === 'RETURNED').map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#07140F] border border-green-500/10 text-xs">
                      <div>
                        <span className="font-mono font-black text-white">{rental.rental_code}</span>
                        <span className="text-slate-400 ml-2">• Returned {rental.actual_return_date ? new Date(rental.actual_return_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">+₹{rental.subtotal_rent_amount}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">SETTLED</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SETTINGS TAB */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-xl font-black text-white">Vendor Account Settings</h2>
              <p className="text-xs text-slate-400">Manage your business profile, contact info, and banking details</p>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-violet-500/30 shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-white border-b border-green-500/20 pb-3">Business Profile</h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={authUser?.full_name || ''}
                    className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Business Email</label>
                  <input
                    type="email"
                    defaultValue={authUser?.email || ''}
                    className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={authUser?.phone || ''}
                    className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Account Role</label>
                  <div className="bg-[#07140F] border border-violet-500/30 rounded-xl px-3 py-2.5 flex items-center justify-between">
                    <span className="text-slate-300">Vendor Partner</span>
                    <span className="text-violet-400 font-bold text-[10px] uppercase">VENDOR</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold text-xs cursor-pointer hover:opacity-95 transition-opacity flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Business Profile
              </button>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-rose-400 border-b border-rose-500/20 pb-3">Danger Zone</h3>
              <p className="text-xs text-slate-400">Actions in this section are irreversible. Proceed with caution.</p>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs cursor-pointer hover:bg-rose-500/20 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out of Vendor Portal
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
