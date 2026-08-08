import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, Layers, Sliders } from 'lucide-react';
import type { Product } from '../../types';

interface ConfigureModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAddToCart: (product: Product, selectedVariant: string, selectedAddons: string[]) => void;
}

export const ConfigureModal: React.FC<ConfigureModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmAddToCart
}) => {
  if (!isOpen || !product) return null;

  // Determine variants dynamically based on product title
  const isTV = product.title.toLowerCase().includes('tv');
  const isSofa = product.title.toLowerCase().includes('sofa');
  const isCamera = product.title.toLowerCase().includes('camera') || product.title.toLowerCase().includes('canon');

  const variantOptions = isTV
    ? [
        { id: '36', label: '36-inch 4K HDR Display', extra: 0 },
        { id: '42', label: '42-inch 4K OLED Gaming Display', extra: 200 },
        { id: '55', label: '55-inch Ultra HD Cinema Display', extra: 400 },
      ]
    : isSofa
    ? [
        { id: 'mustard', label: 'Mustard Velvet Finish (3-Seater)', extra: 0 },
        { id: 'blue', label: 'Deep Blue Velvet Finish (3-Seater)', extra: 50 },
        { id: 'emerald', label: 'Emerald Green Velvet Finish (3-Seater)', extra: 100 },
      ]
    : [
        { id: 'std', label: 'Standard Unit Package', extra: 0 },
        { id: 'pro', label: 'Pro Studio Unit + Heavy Duty Stand', extra: 250 },
      ];

  const addonOptions = isCamera
    ? [
        { id: 'battery', label: 'Extra Dual LP-E6NH Rechargeable Battery', price: 150 },
        { id: 'sd', label: 'SanDisk Extreme 256GB High-Speed SD Card', price: 100 },
        { id: 'insurance', label: 'Zero-Deductible Damage Protection Escrow', price: 200 },
      ]
    : [
        { id: 'case', label: 'Protective Hard Travel Flight Case', price: 100 },
        { id: 'cables', label: 'Pro Heavy-Duty Extension Cables & Adapters', price: 80 },
        { id: 'insurance', label: 'Zero-Deductible Damage Protection Escrow', price: 150 },
      ];

  const [selectedVariant, setSelectedVariant] = useState(variantOptions[0].id);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['insurance']);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirmAddToCart(product, selectedVariant, selectedAddons);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-6 bg-[#0E1F18] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Configure Product Options</h2>
              <p className="text-xs text-slate-400">Select variant & add-on accessories for {product.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#07140F] text-slate-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer border border-green-500/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview Bar */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#07140F] border border-green-500/20">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80'}
            alt={product.title}
            className="w-14 h-14 object-cover rounded-xl border border-green-500/20"
          />
          <div>
            <span className="text-xs font-bold text-white block line-clamp-1">{product.title}</span>
            <span className="text-xs font-black text-emerald-400 font-mono">₹{product.base_daily_rate} / day base rate</span>
          </div>
        </div>

        {/* Section 1: Variant Radio Options */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-slate-200 block uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" /> 1. Select Variant / Size
          </span>
          <div className="space-y-2">
            {variantOptions.map((v) => {
              const isChecked = selectedVariant === v.id;
              return (
                <label
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow glow-emerald'
                      : 'bg-[#07140F] border-green-500/20 text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="variant"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-emerald-500"
                    />
                    <span className="text-xs font-bold">{v.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {v.extra > 0 ? `+₹${v.extra}/day` : 'Included'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 2: Add-on Checkbox Accessories */}
        <div className="space-y-3 border-t border-green-500/10 pt-4">
          <span className="text-xs font-extrabold text-slate-200 block uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" /> 2. Add-on Protection & Accessories
          </span>
          <div className="space-y-2">
            {addonOptions.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <label
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow'
                      : 'bg-[#07140F] border-green-500/20 text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded border-green-500/30 bg-[#07140F] accent-emerald-500"
                    />
                    <span className="text-xs font-semibold">{addon.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">+₹{addon.price}/day</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Buttons matching Wireframe */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-green-500/20">
          <button
            onClick={onClose}
            className="py-3 rounded-2xl bg-[#07140F] border border-green-500/20 text-slate-400 font-bold text-xs hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg glow-emerald hover:scale-102 transition-transform cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Configure & Add
          </button>
        </div>

      </div>
    </div>
  );
};
