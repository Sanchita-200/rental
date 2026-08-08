import React, { useState } from 'react';
import { Plus, Printer, Send, CreditCard, Check, X, ArrowLeft, Trash2 } from 'lucide-react';

interface InvoiceLineItem {
  id: string;
  product: string;
  startDate: string;
  endDate: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxPercent: number;
}

interface InvoiceViewProps {
  invoiceNumber?: string;
  onBack?: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoiceNumber = 'INV/2026/0001',
  onBack,
}) => {
  // Top Action Bar state: Draft vs Posted
  const [status, setStatus] = useState<'Draft' | 'Posted'>('Posted');
  const [customer, setCustomer] = useState('Mark Wood');
  const [invoiceAddress, setInvoiceAddress] = useState('Tech Park Cyber City, Suite 402, Mumbai');
  const [deliveryAddress, setDeliveryAddress] = useState('Film City Studio 4, Goregaon East, Mumbai');
  const [invoiceDate, setInvoiceDate] = useState('2026-08-08');

  // Line items state
  const [lines, setLines] = useState<InvoiceLineItem[]>([
    {
      id: '1',
      product: 'Computers (High-Performance Workstations)',
      startDate: '2026-07-06',
      endDate: '2026-07-10',
      quantity: 20,
      unit: 'Units',
      unitPrice: 20000,
      taxPercent: 10,
    },
  ]);

  const [notes, setNotes] = useState<string[]>([
    'Rental includes 24/7 technical support and full equipment insurance coverage.',
  ]);

  const addLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: Date.now().toString(),
      product: 'Epson 4K Laser Projector Package',
      startDate: '2026-08-10',
      endDate: '2026-08-15',
      quantity: 2,
      unit: 'Units',
      unitPrice: 15000,
      taxPercent: 10,
    };
    setLines([...lines, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLines(lines.filter((line) => line.id !== id));
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setLines(
      lines.map((line) => (line.id === id ? { ...line, [field]: value } : line))
    );
  };

  const addNote = () => {
    setNotes([...notes, 'Security deposit held in escrow until inspection upon return.']);
  };

  // Financial Calculations
  const untaxedAmount = lines.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = lines.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice * item.taxPercent) / 100,
    0
  );
  const totalAmount = untaxedAmount + taxAmount;

  return (
    <div className="glass-panel p-8 rounded-3xl border border-green-500/20 space-y-6 shadow-2xl animate-fade-in max-w-6xl mx-auto text-slate-100">
      
      {/* Navigation Header */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices List
        </button>
      )}

      {/* TOP ACTION BAR (Matching Wireframe: New, Check/Cross, Send, Print, Pay, Draft/Posted toggle) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-green-500/20">
        
        {/* Left Actions: New, Status Icons, Send, Print, Pay */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => alert('Creating New Invoice draft...')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg glow-purple transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New
          </button>

          <div className="flex items-center gap-1 bg-[#07140F] border border-green-500/20 rounded-xl p-1">
            <span className="p-1 text-emerald-400 font-bold" title="Status Verified">
              <Check className="w-4 h-4" />
            </span>
            <span className="p-1 text-rose-400 font-bold" title="Cancel/Delete">
              <X className="w-4 h-4" />
            </span>
          </div>

          <button
            onClick={() => alert(`Invoice ${invoiceNumber} sent to customer!`)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#07140F] border border-slate-600 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          <button
            onClick={() => alert(`Processing payment for ${invoiceNumber}...`)}
            className="px-4 py-2 rounded-xl bg-[#07140F] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" /> Pay
          </button>
        </div>

        {/* Right Status Switcher: [ Draft ] | [ Posted ] */}
        <div className="flex items-center gap-1 bg-[#07140F] p-1 rounded-2xl border border-green-500/30">
          <button
            onClick={() => setStatus('Draft')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
              status === 'Draft'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Draft
          </button>

          <button
            onClick={() => setStatus('Posted')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
              status === 'Posted'
                ? 'bg-purple-600 text-white shadow glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Posted
          </button>
        </div>

      </div>

      {/* INVOICE TITLE & METADATA SECTION */}
      <div className="space-y-6 pt-2">
        <h1 className="text-3xl font-black text-white tracking-tight font-mono">
          {invoiceNumber}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Left Column: Customer, Invoice Address, Delivery Address */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Customer</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Invoice Address</label>
              <textarea
                rows={2}
                value={invoiceAddress}
                onChange={(e) => setInvoiceAddress(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Delivery Address</label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>
          </div>

          {/* Right Column: Invoice Date */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Invoice date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full bg-[#07140F] border border-green-500/20 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

        </div>
      </div>

      {/* TABBED SECTION: INVOICE LINES */}
      <div className="space-y-4 pt-4 border-t border-green-500/10">
        
        <div className="flex items-center gap-4 border-b border-green-500/20 pb-2">
          <button className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-black text-xs">
            Invoice Lines
          </button>
        </div>

        {/* INVOICE LINES TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-green-500/20 bg-[#07140F]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-green-500/20 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-[#0E1F18]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3">Unit Price</th>
                <th className="py-3 px-3">Taxes</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-500/10">
              {lines.map((line) => {
                const lineAmount = line.quantity * line.unitPrice;
                return (
                  <tr key={line.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={line.product}
                        onChange={(e) => updateLineItem(line.id, 'product', e.target.value)}
                        className="w-full bg-transparent text-white font-bold focus:outline-none"
                      />
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                        <span>[{line.startDate} ➔ {line.endDate}]</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => updateLineItem(line.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-16 bg-[#13251D] border border-green-500/20 rounded-lg px-2 py-1 text-white font-mono text-center"
                      />
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">{line.unit}</td>

                    <td className="py-3 px-3">
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => updateLineItem(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 bg-[#13251D] border border-green-500/20 rounded-lg px-2 py-1 text-white font-mono"
                      />
                    </td>

                    <td className="py-3 px-3 font-mono text-amber-400 font-bold">{line.taxPercent}%</td>

                    <td className="py-3 px-4 font-mono font-black text-emerald-400">
                      Rs {lineAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-2 text-right">
                      {lines.length > 1 && (
                        <button
                          onClick={() => removeLineItem(line.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ACTION LINKS: Add a Product / Add a note */}
        <div className="flex items-center gap-6 text-xs font-bold pt-2">
          <button
            onClick={addLineItem}
            className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
          >
            + Add a Product
          </button>
          <button
            onClick={addNote}
            className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
          >
            + Add a note
          </button>
        </div>

        {/* Notes list */}
        {notes.length > 0 && (
          <div className="space-y-2 pt-2">
            {notes.map((note, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#07140F] border border-green-500/10 text-xs text-slate-300 font-mono">
                📝 {note}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* SUMMARY TOTALS BOX (Bottom Right) */}
      <div className="flex justify-end pt-6 border-t border-green-500/20">
        <div className="w-full max-w-xs glass-panel p-5 rounded-2xl border border-green-500/30 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Untaxed Amount:</span>
            <span className="font-bold text-white">Rs {untaxedAmount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Taxes:</span>
            <span className="font-bold text-amber-400">Rs {taxAmount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm font-black text-emerald-400 border-t border-green-500/20 pt-2">
            <span>Total:</span>
            <span className="text-base">Rs {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
