import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, ShieldCheck, CheckCircle2, CreditCard, QrCode, ArrowLeft,
  Truck, Building2, MapPin, Phone, User as UserIcon, Clock, AlertTriangle,
  Receipt, Sparkles, Check, Tag, Printer, Download, ArrowRight, Copy, ChevronRight, Edit2, Lock
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { rentalsApi } from '../../api/rentals.api';
import { useAuth } from '../../context/AuthContext';
import type { Rental } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { items, startDate, endDate, durationDays, subtotalRent, totalDeposit, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step Wizard State: 'ADDRESS' (Delivery Method & Delivery Address) or 'PAYMENT' (Card details & Address Review)
  const [checkoutStep, setCheckoutStep] = useState<'ADDRESS' | 'PAYMENT'>('ADDRESS');

  // Delivery Method State (Excalidraw: Standard Delivery vs Pick up from Store)
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'STORE_PICKUP'>('DELIVERY');

  // Address State (Excalidraw: Customer Name, Address lines, Main Address badge)
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    name: user?.full_name || 'Customer Name',
    street: 'Suite 402, Apex Tech Park, Cyber City',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400051',
    isMain: true
  });

  // Billing Address Toggle (Excalidraw: "If enabled, it will make Billing and Delivery address the same")
  const [isSameBillingAddress, setIsSameBillingAddress] = useState(true);

  // Card Payment Details State for Step 2
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [savePaymentDetails, setSavePaymentDetails] = useState(true);

  // Booking Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState<Rental | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if cart empty & no booking confirmed
  React.useEffect(() => {
    if (items.length === 0 && !confirmedBooking) {
      navigate('/catalog');
    }
  }, [items.length, confirmedBooking, navigate]);

  if (items.length === 0 && !confirmedBooking) {
    return null;
  }

  const deliveryFee = deliveryMethod === 'DELIVERY' ? 0 : 0; // Both listed as Free in mockup
  const finalPayable = grandTotal;

  const handlePayNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const itemsPayload = items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
      }));

      const booking = await rentalsApi.checkout({
        items: itemsPayload,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        payment_method: 'EXPRESS_CARD',
      });

      clearCart();
      setConfirmedBooking(booking);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Checkout transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyBookingCode = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.rental_code);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2500);
    }
  };

  // =========================================================================
  // RENDER CONFIRMATION SCREEN IF BOOKING IS CONFIRMED
  // =========================================================================
  if (confirmedBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-8 bg-[#07140F] animate-fade-in">
        
        {/* Success Header Box */}
        <div className="text-center space-y-3 glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0E2A1E] to-[#07140F] shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl glow-emerald">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-block">
            Booking Confirmed & Escrow Secured
          </span>

          <h1 className="text-3xl font-black text-white">Thank You, {user?.full_name || 'Valued Customer'}!</h1>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Your rental order has been placed and your refundable deposit is safely secured in escrow. Present your digital QR pass at the store counter.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400">Order Reference:</span>
            <div className="flex items-center gap-2 bg-[#07140F] px-4 py-1.5 rounded-xl border border-green-500/30 text-white font-mono font-bold text-sm">
              <span>{confirmedBooking.rental_code}</span>
              <button onClick={copyBookingCode} className="text-emerald-400 hover:text-emerald-300 cursor-pointer" title="Copy code">
                {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Digital Store Pass & Booking Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Digital QR Pass (Scan at Counter) */}
          <div className="md:col-span-6 glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-[#0B1A14] text-center space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">RentFlow Digital Store Pass</span>
              <h3 className="text-base font-black text-white">Store Counter Check-In</h3>
              <p className="text-[11px] text-slate-400">Show this QR code at Counter #4 for zero-wait equipment pickup.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl border-4 border-emerald-500/30 mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(confirmedBooking.qr_pass_token)}`}
                alt="Store QR Code Pass"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#07140F] border border-green-500/20 text-xs text-slate-300 space-y-1 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Building2 className="w-4 h-4" /> Collection Counter:
              </div>
              <p className="text-[11px] pl-6 text-slate-300">Central Hub Counter #4, BKC Cyber City, Mumbai</p>
            </div>
          </div>

          {/* Right Column: Order Details & Actions */}
          <div className="md:col-span-6 glass-panel rounded-3xl p-6 border border-green-500/30 bg-[#0E1F18] space-y-6 shadow-xl flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-green-500/20 pb-3">
                <h3 className="text-sm font-bold text-white">Rental Breakdown</h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">
                  {confirmedBooking.items.length} Item(s)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Start Date:</span>
                  <span className="font-bold text-white">{new Date(confirmedBooking.start_date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Return Deadline:</span>
                  <span className="font-bold text-white">{new Date(confirmedBooking.end_date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Equipment Rental Subtotal:</span>
                  <span className="font-bold text-white">₹{confirmedBooking.subtotal_rent_amount}</span>
                </div>

                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Refundable Deposit Escrow:
                  </span>
                  <span className="font-bold">₹{confirmedBooking.total_deposit_amount}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-black text-white pt-3 border-t border-green-500/20">
                  <span>Total Amount Paid:</span>
                  <span className="text-xl gradient-emerald-text font-mono">₹{confirmedBooking.grand_total}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full py-3 rounded-2xl bg-[#07140F] border border-green-500/30 hover:border-emerald-400 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow"
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>View & Print Official Tax Invoice</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/my-rentals"
                  className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider text-center shadow-lg glow-emerald"
                >
                  My Passes
                </Link>
                <Link
                  to="/catalog"
                  className="py-3 rounded-2xl bg-[#07140F] border border-green-500/30 text-slate-300 hover:text-white font-bold text-xs text-center"
                >
                  Catalog
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // MULTI-STEP WIZARD CHECKOUT (ADDRESS STEP & PAYMENT STEP)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#07140F]">
      
      {/* BREADCRUMB: Order > Address > Payment */}
      <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/cart" className="hover:text-emerald-400 transition-colors">Order</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          
          {/* Address Breadcrumb Status */}
          <button
            onClick={() => setCheckoutStep('ADDRESS')}
            className={`px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              checkoutStep === 'ADDRESS'
                ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border-emerald-500/30'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            Address
          </button>
          
          <ChevronRight className="w-4 h-4 text-slate-600" />
          
          {/* Payment Breadcrumb Status */}
          <span className={`px-3 py-1 rounded-full border text-xs font-bold transition-all ${
            checkoutStep === 'PAYMENT'
              ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border-emerald-500/30'
              : 'text-slate-500 border-transparent'
          }`}>
            Payment
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* TWO COLUMN GRID MATCHING WIREFRAMES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CHANGES DYNAMICALLY ACCORDING TO WIZARD STEP */}
        <div className="lg:col-span-7 space-y-8">
          
          {checkoutStep === 'ADDRESS' ? (
            /* =========================================================================
               STEP 1: ADDRESS & DELIVERY DETAILS (MOCKUP 1)
               ========================================================================= */
            <>
              {/* 1. Delivery Method */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white">Delivery Method</h2>

                <div className="glass-panel rounded-3xl p-5 border border-green-500/30 bg-[#0E1F18] shadow-xl space-y-3">
                  {/* Standard Delivery Free */}
                  <label
                    onClick={() => setDeliveryMethod('DELIVERY')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      deliveryMethod === 'DELIVERY'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow glow-emerald'
                        : 'bg-[#07140F] border-green-500/20 text-slate-300 hover:border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        deliveryMethod === 'DELIVERY' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-500'
                      }`}>
                        {deliveryMethod === 'DELIVERY' && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                      </div>
                      <span className="text-sm font-bold">Standard Delivery</span>
                    </div>
                    <span className="text-sm font-black text-emerald-400">Free</span>
                  </label>

                  {/* Pick up from Store Free */}
                  <label
                    onClick={() => setDeliveryMethod('STORE_PICKUP')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      deliveryMethod === 'STORE_PICKUP'
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow glow-emerald'
                        : 'bg-[#07140F] border-green-500/20 text-slate-300 hover:border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        deliveryMethod === 'STORE_PICKUP' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-500'
                      }`}>
                        {deliveryMethod === 'STORE_PICKUP' && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                      </div>
                      <span className="text-sm font-bold">Pick up from Store</span>
                    </div>
                    <span className="text-sm font-black text-emerald-400">Free</span>
                  </label>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white">Delivery Address</h2>

                <div className="glass-panel rounded-3xl p-6 border border-green-500/30 bg-[#0E1F18] shadow-xl space-y-4 relative">
                  {!isEditingAddress ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-white">{addressData.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-blue-600/30 border border-blue-500/50 text-blue-300 text-xs font-bold shadow">
                            Main Address
                          </span>
                          <button
                            onClick={() => setIsEditingAddress(true)}
                            className="p-2 rounded-xl bg-[#07140F] border border-green-500/30 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs font-mono text-slate-300 leading-relaxed">
                        {addressData.street}, {addressData.city}, {addressData.state} - {addressData.zipCode}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">Customer Name</label>
                          <input
                            type="text"
                            value={addressData.name}
                            onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                            className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">Street Address</label>
                          <input
                            type="text"
                            value={addressData.street}
                            onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                            className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">City</label>
                          <input
                            type="text"
                            value={addressData.city}
                            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                            className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">State</label>
                          <input
                            type="text"
                            value={addressData.state}
                            onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                            className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">Zip Code</label>
                          <input
                            type="text"
                            value={addressData.zipCode}
                            onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                            className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditingAddress(false)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-slate-950 font-black text-xs cursor-pointer shadow"
                      >
                        Save Address Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Billing Address */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-white">Billing Address</h2>

                <div className="glass-panel rounded-3xl p-5 border border-green-500/30 bg-[#0E1F18] shadow-xl flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSameBillingAddress(!isSameBillingAddress)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer relative ${
                      isSameBillingAddress ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      isSameBillingAddress ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>

                  <span className="text-xs font-semibold text-slate-300">
                    If enabled, it will make Billing and Delivery address the same.
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* =========================================================================
               STEP 2: PAYMENT METHOD & ADDRESS DETAILS REVIEW (MOCKUP 2)
               ========================================================================= */
            <>
              {/* 1. Payment Method Card details */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white">Payment Method</h2>

                <div className="glass-panel rounded-3xl p-6 border border-green-500/30 bg-[#0E1F18] shadow-xl space-y-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">Card</span>
                    <h3 className="text-base font-extrabold text-white">Payment Details</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Card Number Input matching Excalidraw */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="w-full bg-[#07140F] border border-green-500/30 rounded-xl pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono tracking-widest"
                        />
                        <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-emerald-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry */}
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                        />
                      </div>

                      {/* CVV */}
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={3}
                          className="w-full bg-[#07140F] border border-green-500/30 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                        />
                      </div>
                    </div>

                    {/* Checkbox for "Save my payment details" */}
                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={savePaymentDetails}
                        onChange={(e) => setSavePaymentDetails(e.target.checked)}
                        className="rounded border-green-500/30 text-emerald-500 focus:ring-emerald-400 focus:ring-opacity-25 w-4 h-4 bg-[#07140F]"
                      />
                      <span className="text-xs text-slate-300 select-none">Save my payment details</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. Delivery & Billing Address Review Card matching Mockup 2 */}
              <div className="space-y-4">
                <div className="glass-panel rounded-3xl p-6 border border-green-500/30 bg-[#0E1F18] shadow-xl relative">
                  
                  {/* Edit button to return to Address step */}
                  <button
                    onClick={() => setCheckoutStep('ADDRESS')}
                    className="absolute right-6 top-6 p-2 rounded-xl bg-[#07140F] border border-green-500/30 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-3">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold inline-block">
                      Delivery & Billing
                    </span>
                    <h3 className="text-lg font-black text-white">{addressData.name}</h3>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed">
                      {addressData.street}, {addressData.city}, {addressData.state} - {addressData.zipCode}
                    </p>
                  </div>

                </div>
              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN: ITEM SUMMARY, RENTAL PERIOD & SUB/TOTAL GRAND BREAKDOWN */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="glass-panel rounded-3xl p-6 border border-green-500/30 bg-[#0E1F18] shadow-2xl space-y-6">
            
            {/* ITEM PREVIEW */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-2xl bg-[#07140F] border border-green-500/20">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.title}
                    className="w-14 h-14 object-cover rounded-xl border border-green-500/20 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.product.title}</h4>
                    <span className="text-xs font-black text-emerald-400 font-mono">
                      ₹{item.product.base_daily_rate} / day
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-green-500/10 pt-4 space-y-4">
              
              {/* WIREFRAME "Rental Period" */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Rental Period</span>
                <p className="text-xs font-mono text-white font-bold bg-[#07140F] p-3 rounded-xl border border-green-500/20">
                  {startDate} 09:00 AM to {endDate} 08:00 PM ({durationDays} Days)
                </p>
              </div>

              {/* WIREFRAME FINANCIAL BREAKDOWN */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Delivery Charges</span>
                  <span className="font-mono text-slate-400">-</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Sub Total</span>
                  <span className="font-mono font-bold text-white">₹{subtotalRent}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <span>Refundable Deposit Escrow</span>
                  <span className="font-mono font-bold">₹{totalDeposit}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-black text-white pt-3 border-t border-green-500/20">
                  <span>Total</span>
                  <span className="text-2xl font-black gradient-emerald-text font-mono">
                    ₹{finalPayable}
                  </span>
                </div>
              </div>

            </div>

            {/* BUTTON DYNAMIC ACCORDING TO CURRENT WIZARD STEP */}
            {checkoutStep === 'ADDRESS' ? (
              <button
                type="button"
                onClick={() => setCheckoutStep('PAYMENT')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:scale-102 transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirmed</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handlePayNow}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl glow-emerald hover:scale-102 transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Processing Escrow Deposit...' : 'Pay Now'}
              </button>
            )}

            {/* WIREFRAME OR Divider */}
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest my-2">
              <div className="flex-1 h-[1px] bg-green-500/20" />
              <span>OR</span>
              <div className="flex-1 h-[1px] bg-green-500/20" />
            </div>

            {/* BACK ACTION LINK DYNAMIC TO WIZARD STEP */}
            {checkoutStep === 'ADDRESS' ? (
              <Link
                to="/cart"
                className="block text-center text-xs font-extrabold text-slate-400 hover:text-emerald-400 transition-colors"
              >
                &lt; Back to Cart
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setCheckoutStep('ADDRESS')}
                className="w-full text-center text-xs font-extrabold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none"
              >
                &lt; Back to Address
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
