import React from 'react';
import { X, Trash2, Plus, Minus, Ticket, Check, AlertCircle } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { COUPONS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, quantity: number, selectedColor?: string) => void;
  onRemoveItem: (productId: string, selectedColor?: string) => void;
  onCheckout: () => void;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  appliedCoupon,
  setAppliedCoupon
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Dynamic shipping: standard is $15, free if subtotal > $500 or if coupon 'FREESHIP' applied
  const isFreeShipping = subtotal > 500 || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const shippingCost = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 15);

  // Coupon calculations
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    const codeClean = couponInput.trim().toUpperCase();
    if (!codeClean) return;

    const coupon = COUPONS.find((c) => c.code === codeClean);
    if (!coupon) {
      setCouponError('Invalid cryptographic coupon code.');
      return;
    }

    if (subtotal < coupon.minSpend) {
      setCouponError(`Min spend to unlock is ₹${coupon.minSpend}.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(true);
    setCouponInput('');
    setTimeout(() => setCouponSuccess(false), 2500);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      {/* Click outside overlay to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-900 text-white flex flex-col justify-between h-full shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-lg font-bold font-sans tracking-tight">Silicon Shopping Bag</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="p-4 bg-neutral-900/60 rounded-full border border-neutral-800 text-neutral-500">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-300">Bag is currently empty</p>
                <p className="text-xs text-neutral-500 max-w-[240px]">
                  Browse our catalog and configure advanced premium custom silicon.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || idx}`}
                  className="flex gap-4 p-3.5 bg-neutral-900/40 border border-neutral-900 rounded-2xl items-center relative hover:border-neutral-800 transition"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-xl bg-neutral-950"
                  />

                  {/* Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-neutral-200 truncate">{item.product.name}</h4>
                    {item.selectedColor && (
                      <span className="text-[10px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800 font-mono">
                        {item.selectedColor}
                      </span>
                    )}
                    <div className="text-xs font-semibold font-mono text-neutral-300">₹{item.product.price}</div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                      className="text-neutral-500 hover:text-rose-400 transition"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs font-mono">
                      <button
                        onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1), item.selectedColor)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, item.quantity + 1, item.selectedColor)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area with Pricing Summaries */}
        {cart.length > 0 && (
          <div className="p-6 bg-neutral-950 border-t border-neutral-900 space-y-4">
            
            {/* Coupon Code Panel */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (SILICON10, TECHSAVER50)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError('');
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-neutral-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold px-4 rounded-xl border border-neutral-800 transition text-blue-400 shrink-0"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <div className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </div>
              )}

              {couponSuccess && (
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Cryptographic code authenticated successfully!
                </div>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs">
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    {appliedCoupon.code} Applied
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[10px] text-neutral-400 hover:text-white hover:underline uppercase font-mono font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            <div className="space-y-2 border-t border-neutral-900 pt-3 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Cryptographic Coupon</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-white border-t border-neutral-900 pt-2 font-sans">
                <span>Grand Total</span>
                <span className="font-mono text-lg text-blue-400">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-blue-600/20"
            >
              Initialize Secure Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
