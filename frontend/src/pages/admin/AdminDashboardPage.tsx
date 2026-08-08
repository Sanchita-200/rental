import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, DollarSign, Calendar, Users,
  Truck, ArrowLeftRight, ShieldCheck, AlertTriangle, FileText, Receipt,
  BarChart3, Settings, User, LogOut, Search, Bell, Plus,
  Sparkles, TrendingUp, Clock, Eye, QrCode, Filter, RefreshCw,
  Shield, ChevronRight, X, LayoutGrid, List, CheckSquare, Download,
  Save, Check, AlertCircle, Edit3, Trash2, Sliders, Layers, Tag, SlidersHorizontal,
  Upload, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

// Mock Data strictly matching Excalidraw Wireframe diagram
interface RentalOrderWireframe {
  id: string;
  orderRef: string;
  customer: string;
  product: string;
  pickupDate: string;
  returnDate: string;
  totalAmount: number;
  status: 'Reserved' | 'Picked Up' | 'Late pickup' | 'Quotation' | 'Cancelled' | 'Late Return';
  invoiceStatus: 'Quotation Sent' | 'Sale order Confirmed' | 'Invoiced' | 'Nothing to Invoice';
  durationDays: number;
}

const WIREFRAME_ORDERS: RentalOrderWireframe[] = [
  { id: '1', orderRef: 'S00001', customer: 'Mark Wood', product: 'Sony 4K OLED TV 65"', pickupDate: 'Jul 6, 6:30pm', returnDate: 'Jul 10, 6:30pm', totalAmount: 1520, status: 'Reserved', invoiceStatus: 'Invoiced', durationDays: 4 },
  { id: '2', orderRef: 'S00005', customer: 'Smith', product: 'HP LaserJet Enterprise Printer', pickupDate: 'Jul 10, 9:30pm', returnDate: 'Jul 15, 9:30pm', totalAmount: 1520, status: 'Picked Up', invoiceStatus: 'Sale order Confirmed', durationDays: 5 },
  { id: '3', orderRef: 'S00010', customer: 'John', product: 'Projector Epson 4K Pro', pickupDate: 'Jul 6, 6:30pm', returnDate: 'Jul 10, 6:30pm', totalAmount: 1520, status: 'Late pickup', invoiceStatus: 'Invoiced', durationDays: 4 },
  { id: '4', orderRef: 'S00012', customer: 'Alex', product: 'Tesla Model 3 Rental', pickupDate: 'Jul 2, 9:00pm', returnDate: 'Jul 11, 9:00pm', totalAmount: 1520, status: 'Quotation', invoiceStatus: 'Quotation Sent', durationDays: 9 },
  { id: '5', orderRef: 'S00020', customer: 'Rose', product: 'PlayStation 5 Console VR2', pickupDate: 'Jul 3, 9:00pm', returnDate: 'Jul 11, 9:00pm', totalAmount: 1520, status: 'Cancelled', invoiceStatus: 'Nothing to Invoice', durationDays: 8 },
  { id: '6', orderRef: 'S00008', customer: 'Alex', product: 'Car Audi A6', pickupDate: 'Jul 4, 10:00am', returnDate: 'Jul 8, 10:00am', totalAmount: 775, status: 'Quotation', invoiceStatus: 'Quotation Sent', durationDays: 4 },
  { id: '7', orderRef: 'S00011', customer: 'Mark wood', product: 'Printer Canon', pickupDate: 'Jul 5, 2:00pm', returnDate: 'Jul 9, 2:00pm', totalAmount: 150, status: 'Reserved', invoiceStatus: 'Sale order Confirmed', durationDays: 4 },
  { id: '8', orderRef: 'S00013', customer: 'Smith', product: 'Games PS5 Disk Bundle', pickupDate: 'Jul 1, 4:00pm', returnDate: 'Jul 5, 4:00pm', totalAmount: 85, status: 'Late Return', invoiceStatus: 'Invoiced', durationDays: 4 },
];

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  // Navigation Tabs: Orders, Schedule, Products, Reports, Settings
  const [activeTab, setActiveTab] = useState<'Orders' | 'Schedule' | 'Products' | 'Reports' | 'Settings'>('Orders');
  
  // Orders Sub-segments: Orders, Invoices, Customers
  const [ordersSegment, setOrdersSegment] = useState<'all-orders' | 'invoices' | 'customers'>('all-orders');

  // Products Sub-segments: Product, Price List, Attribute, Rental Period
  const [productsSegment, setProductsSegment] = useState<'products' | 'price-list' | 'attribute' | 'rental-period'>('products');

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TODAY' | 'PICKUP' | 'RETURN' | 'LATE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Settings State matching Excalidraw Wireframe
  const [enableLateFee, setEnableLateFee] = useState(true);
  const [lateFeePerHour, setLateFeePerHour] = useState(15);
  const [enableAttributes, setEnableAttributes] = useState(true);
  const [enablePriceList, setEnablePriceList] = useState(true);

  // Settings User Profile State
  const [adminName, setAdminName] = useState(user?.full_name || 'Admin User');
  const [adminEmail] = useState(user?.email || 'admin@rentflow.com');
  const [adminPhone, setAdminPhone] = useState('+91 98765 43210');
  const [adminCompany, setAdminCompany] = useState('RentFlow AI Corporate');
  const [adminGst, setAdminGst] = useState('27AAAAA0000A1Z5');
  const [adminAddress, setAddress] = useState('Tech Park Cyber City, Suite 402, Mumbai');
  const [adminRoleSelect, setAdminRoleSelect] = useState<'Admin' | 'Vendor' | 'Customer'>('Admin');
  const [settingSubTab, setSettingSubTab] = useState<'work' | 'security'>('work');
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Checkbox State for Orders List View
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === WIREFRAME_ORDERS.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(WIREFRAME_ORDERS.map((o) => o.id));
    }
  };

  // Filter Orders based on search & active filter pill
  const filteredOrders = WIREFRAME_ORDERS.filter((order) => {
    const matchesSearch =
      order.orderRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'TODAY') return order.status === 'Reserved' || order.pickupDate.includes('Jul 6');
    if (activeFilter === 'PICKUP') return order.status === 'Picked Up' || order.status === 'Late pickup';
    if (activeFilter === 'RETURN') return order.status === 'Reserved';
    if (activeFilter === 'LATE') return order.status === 'Late pickup' || order.status === 'Late Return';

    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07140F] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* ==================================================================== */}
      {/* UNIFIED TOP HEADER MENU NAVIGATION */}
      {/* ==================================================================== */}
      <header className="bg-[#0B1A14] border-b border-green-500/20 px-6 py-3 flex items-center justify-between shadow-xl relative z-30">
        
        {/* Brand Logo & Interactive Top Nav Tabs */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center shadow-lg glow-emerald">
              <Shield className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-base font-black gradient-emerald-text">RentFlow AI</span>
          </Link>

          {/* Interactive Navigation Links: Orders, Schedule, Products, Reports, Settings */}
          <nav className="hidden md:flex items-center gap-2 font-medium text-xs">
            {(['Orders', 'Schedule', 'Products', 'Reports', 'Settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-slate-950 font-black shadow-lg glow-emerald'
                    : 'text-slate-300 hover:text-white hover:bg-[#13251D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Side: Initials Badges & Profile Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Circular Initial Badges (E, T, I, T, P, I, C, E) from Excalidraw Wireframe */}
          <div className="hidden xl:flex items-center gap-1">
            {['E', 'T', 'I', 'T', 'P', 'I', 'C', 'E'].map((letter, idx) => (
              <span
                key={idx}
                className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] flex items-center justify-center shadow-sm"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* User Profile Bubble & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13251D] border border-green-500/30 hover:border-emerald-400 transition-colors"
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover border border-emerald-400"
              />
              <span className="text-xs font-bold text-white hidden sm:inline">{user?.full_name?.split(' ')[0] || 'Admin'}</span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl p-2 border border-green-500/30 shadow-2xl space-y-1 z-50 animate-scale-up">
                <div className="p-2 border-b border-green-500/10">
                  <span className="text-xs font-bold text-white block truncate">{user?.full_name || 'Admin User'}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">{user?.role || 'ADMIN'} ACCOUNT</span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4 text-emerald-400" /> Profile
                </Link>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logout();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-green-500/10 mt-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* ==================================================================== */}
      {/* SUB-SEGMENTS BAR (UNDER ORDERS & PRODUCTS) */}
      {/* ==================================================================== */}
      <div className="bg-[#07140F] border-b border-green-500/10 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Sub-Segments Pills when Orders Tab is Active */}
          {activeTab === 'Orders' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider">Orders Segments:</span>
              <button
                onClick={() => setOrdersSegment('all-orders')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  ordersSegment === 'all-orders'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-[#0B1A14] text-slate-400 hover:text-white border border-green-500/20'
                }`}
              >
                Rental Orders
              </button>
              <button
                onClick={() => setOrdersSegment('invoices')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  ordersSegment === 'invoices'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[#0B1A14] text-slate-400 hover:text-white border border-green-500/20'
                }`}
              >
                Invoices & Billing
              </button>
              <button
                onClick={() => setOrdersSegment('customers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  ordersSegment === 'customers'
                    ? 'bg-emerald-600 text-slate-950 font-black shadow'
                    : 'bg-[#0B1A14] text-slate-400 hover:text-white border border-green-500/20'
                }`}
              >
                Customers Directory
              </button>
            </div>
          )}

          {/* Sub-Segments Pills when Products Tab is Active */}
          {activeTab === 'Products' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider">Products Segments:</span>
              <button
                onClick={() => setProductsSegment('products')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  productsSegment === 'products'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-[#0B1A14] text-slate-400 hover:text-white border border-green-500/20'
                }`}
              >
                Products Catalog
              </button>
              <button
                onClick={() => setProductsSegment('price-list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  productsSegment === 'price-list'
                    ? 'bg-emerald-600 text-slate-950 font-black shadow'
                    : 'bg-[#0B1A14] text-slate-400 hover:text-white border border-green-500/20'
                }`}
              >
                Price Lists
              </button>
              <button
                onClick={() => setProductsSegment('attribute')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  productsSegment === 'attribute'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-[#0B1A14] text-slate-400 hover:text-white border border-green-500/20'
                }`}
              >
                Attributes & Specs
              </button>
              <button
                onClick={() => setProductsSegment('rental-period')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  productsSegment === 'rental-period'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-[#0B1A14] text-slate-400 hover:text-white border border-green-500/20'
                }`}
              >
                Rental Duration Rules
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN VIEW CONTENT CONTROLLER */}
      {/* ==================================================================== */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* ==================================================================== */}
        {/* TAB 1: ORDERS TAB */}
        {/* ==================================================================== */}
        {activeTab === 'Orders' && (
          <div className="space-y-6 animate-fade-in">
            {ordersSegment === 'all-orders' && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1A14] p-5 rounded-2xl border border-green-500/20 shadow-xl">
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-white tracking-tight">Rental Order</h1>
                    <button
                      onClick={() => setShowQuickCreate(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg glow-purple transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> New
                    </button>
                  </div>

                  <div className="flex-1 max-w-sm relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by Order ID, Customer, or Product..."
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-400 mr-1">View Switcher:</span>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl border transition-colors ${
                          viewMode === 'list'
                            ? 'bg-emerald-600 border-emerald-400 text-slate-950 shadow font-bold'
                            : 'bg-[#07140F] border-green-500/20 text-slate-400 hover:text-white'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('kanban')}
                        className={`p-2 rounded-xl border transition-colors ${
                          viewMode === 'kanban'
                            ? 'bg-purple-600 border-purple-400 text-white shadow font-bold'
                            : 'bg-[#07140F] border-green-500/20 text-slate-400 hover:text-white'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 text-xs font-mono border-l border-green-500/20 pl-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Sales</span>
                        <strong className="text-emerald-400 font-bold">$1440</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Late Fees</span>
                        <strong className="text-amber-400 font-bold">$235</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Deposit</span>
                        <strong className="text-cyan-400 font-bold">$710</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveFilter('TODAY')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                        activeFilter === 'TODAY'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      2 Today
                    </button>
                    <button
                      onClick={() => setActiveFilter('PICKUP')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                        activeFilter === 'PICKUP'
                          ? 'bg-purple-600 text-white border-purple-400 shadow'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                      }`}
                    >
                      3 Pickup
                    </button>
                    <button
                      onClick={() => setActiveFilter('RETURN')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                        activeFilter === 'RETURN'
                          ? 'bg-purple-600 text-white border-purple-400 shadow'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                      }`}
                    >
                      3 Return
                    </button>
                    <button
                      onClick={() => setActiveFilter('LATE')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                        activeFilter === 'LATE'
                          ? 'bg-rose-600 text-white border-rose-400 shadow'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                    >
                      1 Late
                    </button>
                    {activeFilter !== 'ALL' && (
                      <button onClick={() => setActiveFilter('ALL')} className="text-xs text-slate-400 hover:text-white underline ml-2">
                        Clear Filter
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <input type="checkbox" defaultChecked className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500" />
                    <span>Last 7 Days</span>
                  </div>
                </div>

                {viewMode === 'list' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="glass-panel p-5 rounded-2xl border border-green-500/20 space-y-3 h-fit">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-green-500/10 pb-2">
                        Invoice Status Legend
                      </h3>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3.5 h-3.5 rounded bg-purple-600 shrink-0" />
                          <span className="text-slate-300 font-medium">Quotation Sent</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0" />
                          <span className="text-slate-300 font-medium">Sale order Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-3.5 h-3.5 rounded bg-blue-500 shrink-0" />
                          <span className="text-slate-300 font-medium">Invoiced</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-3.5 h-3.5 rounded bg-slate-600 shrink-0" />
                          <span className="text-slate-300 font-medium">Nothing to Invoice</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 glass-panel rounded-2xl p-4 border border-green-500/20 shadow-xl overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-green-500/20 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-2 w-8">
                              <input
                                type="checkbox"
                                checked={selectedOrders.length === WIREFRAME_ORDERS.length}
                                onChange={toggleSelectAll}
                                className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500"
                              />
                            </th>
                            <th className="py-3 px-3">Order Reference</th>
                            <th className="py-3 px-3">Customer</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3">Pickup Date</th>
                            <th className="py-3 px-3">Return Date</th>
                            <th className="py-3 px-3">Total</th>
                            <th className="py-3 px-3">Invoice Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-green-500/10">
                          {filteredOrders.map((order) => {
                            const isChecked = selectedOrders.includes(order.id);
                            return (
                              <tr key={order.id} className={`hover:bg-emerald-500/5 transition-colors ${isChecked ? 'bg-emerald-500/10' : ''}`}>
                                <td className="py-3 px-2">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleSelectOrder(order.id)}
                                    className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500"
                                  />
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-emerald-400">{order.orderRef}</td>
                                <td className="py-3 px-3 font-bold text-white">{order.customer}</td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                      order.status === 'Reserved'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : order.status === 'Picked Up'
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : order.status === 'Late pickup' || order.status === 'Late Return'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        : order.status === 'Quotation'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-mono text-slate-300">{order.pickupDate}</td>
                                <td className="py-3 px-3 font-mono text-slate-300">{order.returnDate}</td>
                                <td className="py-3 px-3 font-bold text-white">${order.totalAmount}</td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-white shadow-sm inline-block ${
                                      order.invoiceStatus === 'Quotation Sent'
                                        ? 'bg-purple-600'
                                        : order.invoiceStatus === 'Sale order Confirmed'
                                        ? 'bg-emerald-500 text-slate-950'
                                        : order.invoiceStatus === 'Invoiced'
                                        ? 'bg-blue-500'
                                        : 'bg-slate-600'
                                    }`}
                                  >
                                    {order.invoiceStatus}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="glass-panel p-5 rounded-2xl border border-green-500/20 space-y-4 hover:border-emerald-400 transition-colors shadow-lg"
                      >
                        <div className="flex items-center justify-between border-b border-green-500/10 pb-3">
                          <div>
                            <h4 className="text-sm font-black text-white">{order.customer}</h4>
                            <span className="text-xs font-mono font-bold text-emerald-400">{order.orderRef}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block font-medium">{order.product}</span>
                            <span className="text-sm font-black text-white">${order.totalAmount}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Rental Duration:</span>
                            <span className="text-xs font-bold text-slate-200">{order.durationDays} Days</span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
                              order.status === 'Late Return' || order.status === 'Late pickup'
                                ? 'bg-rose-500 text-white shadow'
                                : order.status === 'Reserved'
                                ? 'bg-emerald-500 text-slate-950 font-black shadow'
                                : order.status === 'Picked Up'
                                ? 'bg-amber-500 text-slate-950 shadow font-bold'
                                : order.status === 'Quotation'
                                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {ordersSegment === 'invoices' && (
              <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-green-500/10 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-blue-400" /> Invoices & Billing Management
                    </h2>
                    <p className="text-xs text-slate-400">Track paid invoices, pending billing, and deposit escrow release receipts</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-green-500/20 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Invoice #</th>
                        <th className="py-3 px-3">Order Ref</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Billing Amount</th>
                        <th className="py-3 px-3">Escrow Status</th>
                        <th className="py-3 px-3">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-500/10">
                      {[
                        { inv: 'INV-2026-001', ref: 'S00001', name: 'Mark Wood', amount: '$1,520', escrow: '$1,000 HELD', status: 'PAID' },
                        { inv: 'INV-2026-002', ref: 'S00005', name: 'Smith', amount: '$1,520', escrow: '$800 HELD', status: 'PAID' },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-emerald-500/5 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-blue-400">{item.inv}</td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-400">{item.ref}</td>
                          <td className="py-3 px-3 font-bold text-white">{item.name}</td>
                          <td className="py-3 px-3 font-extrabold text-white">{item.amount}</td>
                          <td className="py-3 px-3 font-mono text-cyan-400 text-[10px] font-bold">{item.escrow}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {ordersSegment === 'customers' && (
              <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-green-500/10 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" /> Customer Profiles & Verified Directory
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Mark Wood', email: 'mark@example.com', rentals: '4 Completed Rentals', kyc: 'VERIFIED', rating: '5.0 ⭐' },
                    { name: 'Sophia Smith', email: 'smith@example.com', rentals: '6 Completed Rentals', kyc: 'VERIFIED', rating: '4.9 ⭐' },
                  ].map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-3">
                      <span className="text-xs font-bold text-white block">{c.name}</span>
                      <span className="text-xs text-slate-400 block font-mono">{c.email}</span>
                      <span className="text-xs text-emerald-400 font-bold">{c.rentals}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: SCHEDULE */}
        {/* ==================================================================== */}
        {activeTab === 'Schedule' && (
          <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-green-500/10 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" /> Equipment Dispatch & Pickup Schedule
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { ref: 'S00001', customer: 'Mark Wood', item: 'Sony 4K OLED TV 65"', start: 6, end: 10, status: 'Active Pickup' },
                { ref: 'S00005', customer: 'Smith', item: 'HP LaserJet Enterprise Printer', start: 10, end: 15, status: 'Staged' },
              ].map((row, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#07140F] border border-green-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{row.customer} ({row.ref})</span>
                    <span className="text-[11px] text-slate-400">{row.item}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">Jul {row.start} - Jul {row.end}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PRODUCTS TAB */}
        {/* ==================================================================== */}
        {activeTab === 'Products' && (
          <div className="space-y-6 animate-fade-in">
            {productsSegment === 'products' && (
              <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" /> Rental Inventory & Stock Control
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Sony FX3 Cinema Camera Kit', rate: '$150/day', deposit: '$1,500', stock: '4 Units Available', sku: 'SKU-CAM-FX3' },
                    { name: 'PlayStation 5 Console VR2', rate: '$45/day', deposit: '$400', stock: '8 Units Available', sku: 'SKU-GAM-PS5' },
                  ].map((prod, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-3">
                      <span className="text-xs font-mono font-bold text-emerald-400">{prod.sku}</span>
                      <h3 className="text-sm font-bold text-white">{prod.name}</h3>
                      <span className="text-xs text-slate-300 block">{prod.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {productsSegment === 'price-list' && (
              <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl animate-fade-in">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" /> Tiered Price List Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Standard Daily Rate', discount: '0% Discount' },
                    { title: 'Weekly Pro Package', discount: '15% Off Total' },
                  ].map((p, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-2">
                      <h3 className="text-sm font-bold text-white">{p.title}</h3>
                      <span className="text-xs font-black text-emerald-400 block">{p.discount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {productsSegment === 'attribute' && (
              <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl animate-fade-in">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400" /> Product Attributes & Variant Tags
                </h2>
                <div className="space-y-3">
                  {[
                    { attr: 'Serial Number Format', values: 'SN-FX3-XXXX, SN-PS5-XXXX' },
                    { attr: 'Physical Condition', values: 'Mint 10/10, Normal Wear' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#07140F] border border-green-500/20 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.attr}</span>
                      <span className="text-[11px] text-slate-400">{item.values}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {productsSegment === 'rental-period' && (
              <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl animate-fade-in">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" /> Rental Duration Rules & Periods
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-2">
                    <span className="text-xs font-bold text-white block">Minimum Rental Period</span>
                    <span className="text-sm font-black text-emerald-400">1 Full Day (24 Hours)</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-2">
                    <span className="text-xs font-bold text-white block">Return Grace Period</span>
                    <span className="text-sm font-black text-purple-400">2 Hours Grace</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: REPORTS */}
        {/* ==================================================================== */}
        {activeTab === 'Reports' && (
          <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-6 animate-fade-in shadow-2xl">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" /> Financial Reports & Deposit Analytics
            </h2>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { date: 'Mon', revenue: 42000 },
                  { date: 'Tue', revenue: 58000 },
                  { date: 'Wed', revenue: 64000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Area type="monotone" dataKey="revenue" name="Rental Revenue" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: SETTINGS (STRICTLY IMPLEMENTING EXCALIDRAW WIREFRAME) */}
        {/* ==================================================================== */}
        {activeTab === 'Settings' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Action Bar: Title, Save (Purple), Discard */}
            <div className="flex items-center justify-between bg-[#0B1A14] p-5 rounded-2xl border border-green-500/20 shadow-xl">
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">Setting</h1>
                <p className="text-xs text-slate-400">Configure pickup penalty parameters, product links, and admin profile</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg glow-purple transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save
                </button>

                <button
                  type="button"
                  onClick={() => alert('Settings changes discarded')}
                  className="px-4 py-2.5 rounded-xl bg-[#07140F] border border-slate-600 text-slate-300 font-bold text-xs hover:text-white"
                >
                  Discard
                </button>
              </div>
            </div>

            {savedSettingsSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Settings saved successfully!
              </div>
            )}

            {/* CARD 1: PICKUP & RETURN SETTINGS (EXCALIDRAW WIREFRAME 1) */}
            <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-4 shadow-xl">
              <h2 className="text-sm font-extrabold text-white border-b border-green-500/10 pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Pickup & Return Settings
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableLateFee}
                    onChange={(e) => setEnableLateFee(e.target.checked)}
                    className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500 w-4 h-4"
                  />
                  <span>Late Fee / Overdue Penalty</span>
                </label>

                {/* Conditional Input: Visible ONLY when Late Fee checkbox is checked */}
                {enableLateFee && (
                  <div className="pl-6 pt-1 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-300 font-semibold">Late Fee: $</span>
                      <input
                        type="number"
                        value={lateFeePerHour}
                        onChange={(e) => setLateFeePerHour(parseFloat(e.target.value))}
                        className="w-24 bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
                      />
                      <span className="text-slate-400 font-medium">per hour late</span>
                    </div>

                    {/* Excalidraw Wireframe Notes */}
                    <div className="p-3 rounded-xl bg-[#07140F] border border-green-500/10 space-y-1 text-[11px] text-slate-400 leading-relaxed font-mono">
                      <p>• Whatever the amount is mentioned here will be applied on all the products by default.</p>
                      <p>• If somebody wants to apply the late fee on a particular product then that can be set from here or the product page under tab.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: PRODUCT SETTINGS WITH REDIRECT ARROWS (EXCALIDRAW WIREFRAME 2) */}
            <div className="glass-panel p-6 rounded-3xl border border-green-500/20 space-y-4 shadow-xl">
              <h2 className="text-sm font-extrabold text-white border-b border-green-500/10 pb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" /> Product Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Attributes Checkbox & Arrow Link */}
                <div className="p-4 rounded-2xl bg-[#07140F] border border-green-500/10 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableAttributes}
                      onChange={(e) => setEnableAttributes(e.target.checked)}
                      className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500 w-4 h-4"
                    />
                    <span>Attributes</span>
                  </label>

                  {enableAttributes && (
                    <button
                      onClick={() => {
                        setActiveTab('Products');
                        setProductsSegment('attribute');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline pt-1"
                    >
                      <span>Attributes Page</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Price List Checkbox & Arrow Link */}
                <div className="p-4 rounded-2xl bg-[#07140F] border border-green-500/10 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enablePriceList}
                      onChange={(e) => setEnablePriceList(e.target.checked)}
                      className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500 w-4 h-4"
                    />
                    <span>Price List</span>
                  </label>

                  {enablePriceList && (
                    <button
                      onClick={() => {
                        setActiveTab('Products');
                        setProductsSegment('price-list');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline pt-1"
                    >
                      <span>Price List Page</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

              {/* Excalidraw Wireframe Note */}
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono p-3 rounded-xl bg-[#07140F] border border-green-500/10">
                • Enable this option once the above checkbox is check marked and one user click on the attributes redirect to the attributes page. Keep the same for the Price list.
              </p>
            </div>

            {/* CARD 3: USER & COMPANY INFORMATION (EXCALIDRAW WIREFRAME 3) */}
            <div className="glass-panel p-8 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-green-500/10 pb-4">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" /> Admin User & Company Profile Information
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  ADMIN ONLY
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Name</label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                    <input
                      type="email"
                      value={adminEmail}
                      disabled
                      className="w-full bg-[#07140F]/50 border border-green-500/10 rounded-xl px-3 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone</label>
                    <input
                      type="tel"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
                    <input
                      type="text"
                      value={adminCompany}
                      onChange={(e) => setAdminCompany(e.target.value)}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Right Column Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Company Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#07140F] border border-green-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        LOGO
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Logo upload triggered')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-500 flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" /> Upload
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">GST IN</label>
                    <input
                      type="text"
                      value={adminGst}
                      onChange={(e) => setAdminGst(e.target.value)}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Address</label>
                    <textarea
                      rows={2}
                      value={adminAddress}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

              </div>

              {/* Sub-Tabs: Work Information | Security */}
              <div className="pt-4 border-t border-green-500/10 space-y-4">
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSettingSubTab('work')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      settingSubTab === 'work'
                        ? 'bg-emerald-600 text-slate-950 shadow'
                        : 'bg-[#07140F] text-slate-400 border border-green-500/20'
                    }`}
                  >
                    Work Information
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingSubTab('security')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      settingSubTab === 'security'
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#07140F] text-slate-400 border border-green-500/20'
                    }`}
                  >
                    Security
                  </button>
                </div>

                {settingSubTab === 'work' && (
                  <div className="p-4 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-3">
                    <span className="text-xs font-bold text-white block">Role Selector:</span>
                    <div className="flex items-center gap-6 text-xs text-slate-300 font-semibold">
                      {(['Admin', 'Vendor', 'Customer'] as const).map((r) => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="roleRadio"
                            checked={adminRoleSelect === r}
                            onChange={() => setAdminRoleSelect(r)}
                            className="accent-emerald-500 w-4 h-4"
                          />
                          <span>{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {settingSubTab === 'security' && (
                  <div className="p-4 rounded-2xl bg-[#07140F] border border-green-500/20 space-y-3">
                    <span className="text-xs font-bold text-white block">Change Password:</span>
                    <button
                      type="button"
                      onClick={() => alert('Password update link sent to email')}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow hover:bg-purple-500"
                    >
                      Change Password
                    </button>
                  </div>
                )}

              </div>

              {/* Excalidraw Wireframe Note Card */}
              <div className="p-4 rounded-2xl bg-[#07140F] border border-purple-500/30 space-y-1 text-xs text-slate-300 font-mono">
                <span className="text-purple-400 font-bold block uppercase tracking-wider">📌 Wireframe Access Governance Note:</span>
                <p>• Settings should only be visible to Admin user.</p>
                <p>• For all the non-admin users, this user information page should only be visible under profile section.</p>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ==================================================================== */}
      {/* QUICK CREATE MODAL */}
      {/* ==================================================================== */}
      {showQuickCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-scale-up">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-green-500/30 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-green-500/20 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" /> Create New Rental Order
              </h3>
              <button
                onClick={() => setShowQuickCreate(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="Mark Wood"
                  className="w-full bg-[#07140F] border border-green-500/20 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Product Equipment</label>
                <input
                  type="text"
                  placeholder="Sony 4K OLED TV 65"
                  className="w-full bg-[#07140F] border border-green-500/20 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Total Amount ($)</label>
                  <input type="number" defaultValue={1520} className="w-full bg-[#07140F] border border-green-500/20 rounded-xl p-2.5 text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Invoice Status</label>
                  <select className="w-full bg-[#07140F] border border-green-500/20 rounded-xl p-2.5 text-white focus:outline-none">
                    <option>Quotation Sent</option>
                    <option>Sale order Confirmed</option>
                    <option>Invoiced</option>
                    <option>Nothing to Invoice</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('New Rental Order created successfully!');
                setShowQuickCreate(false);
              }}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg glow-purple"
            >
              Confirm Order Creation
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
