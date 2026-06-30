import React from 'react';
import { ShieldCheck, MapPin, CreditCard, ShoppingBag, Sparkles, Truck, CheckCircle, Hourglass, ArrowLeft, ArrowRight, ClipboardCheck } from 'lucide-react';
import { CartItem, Address, Order, Coupon } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  onOrderCompleted: (order: Order) => void;
  clearCart: () => void;
  onNavigateToTab: (tab: 'shop' | 'orders' | 'profile') => void;
}

export default function CheckoutPage({
  cart,
  appliedCoupon,
  onOrderCompleted,
  clearCart,
  onNavigateToTab
}: CheckoutPageProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);

  // Address State
  const [fullName, setFullName] = React.useState('Alex Mercer');
  const [street, setStreet] = React.useState('1204 Infinite Loop Drive, Tech Enclave');
  const [city, setCity] = React.useState('San Jose');
  const [state, setState] = React.useState('CA');
  const [zipCode, setZipCode] = React.useState('95112');
  const [country, setCountry] = React.useState('United States');

  // Payment State
  const [cardName, setCardName] = React.useState('Alex Mercer');
  const [cardNumber, setCardNumber] = React.useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = React.useState('12/28');
  const [cardCvv, setCardCvv] = React.useState('424');

  // Completed Order State for Live Tracking
  const [completedOrder, setCompletedOrder] = React.useState<Order | null>(null);
  const [trackingStatusIdx, setTrackingStatusIdx] = React.useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal > 500 || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const shippingCost = isFreeShipping ? 0 : 15;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // Live Tracking Stages
  const trackingStages = [
    { label: 'Silicon Order Confirmed', desc: 'Secure blockchain receipt issued', time: 'Just now' },
    { label: 'Silicon Core Allocated', desc: 'Slicing processors from cleanroom enclaves', time: 'In progress' },
    { label: 'Laboratory Diagnostics', desc: 'Undergoing custom stress-tests & diagnostic safety loops', time: 'Pending' },
    { label: 'Dispatched for Priority Air Courier', desc: 'Package assigned to express courier handler', time: 'Pending' }
  ];

  // Increment tracking index automatically for demo
  React.useEffect(() => {
    if (step === 3 && trackingStatusIdx < trackingStages.length - 1) {
      const interval = setInterval(() => {
        setTrackingStatusIdx((prev) => prev + 1);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [step, trackingStatusIdx]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Create completed order
      const mockAddress: Address = {
        id: Math.random().toString(),
        fullName,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: true
      };

      const newOrder: Order = {
        id: `SP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
          selectedColor: item.selectedColor
        })),
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        total: grandTotal,
        trackingNo: `TRACK-SL-${Math.floor(10000000 + Math.random() * 90000000)}`,
        shippingAddress: mockAddress,
        paymentMethod: 'Secure Silicon Token'
      };

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);
      setStep(3);
    }
  };

  const handleDone = () => {
    clearCart();
    onNavigateToTab('orders');
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto border border-gray-200 text-[#2563EB]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase text-[#111827]">Your cart is empty</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
            You cannot checkout without hardware in your cart. Choose from our catalog first.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('shop')}
          className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-sm"
        >
          Browse Hardware Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Catalog Breadcrumb / Tab Switcher */}
      {step !== 3 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateToTab('shop')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#111827] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hardware Catalog
          </button>
          
          {/* Stepper indicator */}
          <div className="flex items-center gap-4 bg-white px-5 py-2.5 border border-gray-200 rounded-2xl text-xs font-bold shadow-sm">
            <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#2563EB]' : 'text-gray-400'}`}>
              <MapPin className="w-3.5 h-3.5" />
              1. Delivery
            </span>
            <span className="text-gray-300">/</span>
            <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#2563EB]' : 'text-gray-400'}`}>
              <CreditCard className="w-3.5 h-3.5" />
              2. Secure Payment
            </span>
          </div>
        </div>
      )}

      {step === 3 && completedOrder ? (
        /* Full-page Success Tracking Screen */
        <div className="max-w-3xl mx-auto bg-white border border-[#111827] rounded-[2rem] p-8 sm:p-12 space-y-8 shadow-sm text-[#111827]">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
              <Sparkles className="w-8 h-8 text-[#2563EB] animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-3xl font-black uppercase tracking-tight">Silicon Sequence Initiated</h2>
              <p className="text-xs text-gray-500 font-mono font-bold">
                Order Node: <span className="text-[#2563EB] font-black">{completedOrder.id}</span> • System: com.siliconproduct.app
              </p>
            </div>
          </div>

          {/* Dynamic Progress indicator bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
              <span className="uppercase tracking-wider">Sequence Progression</span>
              <span className="font-mono text-[#2563EB]">{Math.round(((trackingStatusIdx + 1) / trackingStages.length) * 100)}%</span>
            </div>
            <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
              <div
                className="absolute h-full bg-gradient-to-r from-[#2563EB] to-[#F59E0B] transition-all duration-1000 ease-out"
                style={{ width: `${((trackingStatusIdx + 1) / trackingStages.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Status Log Stack */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest block border-b border-gray-200 pb-2">
              TELEMETRY LOGS (SECURE SHELL)
            </span>
            
            <div className="space-y-4">
              {trackingStages.map((stage, idx) => {
                const isPassed = trackingStatusIdx >= idx;
                const isCurrent = trackingStatusIdx === idx;

                return (
                  <div key={idx} className="flex gap-4 items-start text-xs leading-relaxed">
                    <div className="pt-0.5 shrink-0">
                      {isPassed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Hourglass className="w-4 h-4 text-[#F59E0B] animate-spin" />
                      ) : (
                        <Hourglass className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className={`font-bold uppercase tracking-tight text-sm ${isPassed ? 'text-[#111827]' : isCurrent ? 'text-[#F59E0B]' : 'text-gray-400'}`}>
                        {stage.label}
                      </h5>
                      <p className={`text-[11px] font-medium ${isPassed ? 'text-gray-500 font-semibold' : 'text-gray-400'}`}>
                        {stage.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 shrink-0 uppercase tracking-wider">
                      {isPassed ? (idx === trackingStatusIdx ? 'Real-time' : 'Completed') : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipment Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white border border-gray-200 rounded-2xl text-xs text-gray-600">
            <div className="space-y-1.5">
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Consignee Enclave</p>
              <p className="font-bold text-[#111827]">{completedOrder.shippingAddress.fullName}</p>
              <p className="font-semibold leading-relaxed">
                {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} {completedOrder.shippingAddress.zipCode}
              </p>
            </div>
            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5 flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Express Airbill Tracking ID</p>
                <p className="font-mono font-bold text-[#111827] text-sm mt-0.5">{completedOrder.trackingNo}</p>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
                <ClipboardCheck className="w-3.5 h-3.5" />
                SECURE RECORD GENERATED
              </p>
            </div>
          </div>

          <button
            onClick={handleDone}
            className="w-full bg-[#111827] hover:bg-[#2563EB] text-white py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            Go to My Active Deployments
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Dual Column Checkout Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Form Panel */}
          <div className="lg:col-span-7 bg-white border border-[#111827] rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#111827] flex items-center gap-2">
                <ShieldCheck className="w-5.5 h-5.5 text-[#2563EB]" />
                {step === 1 ? '1. Secure Enclave Shipping' : '2. Secure Gateway Payment'}
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                {step === 1 ? 'Provide physical delivery coordinates' : 'Enter PCI-DSS encrypted card credentials'}
              </p>
            </div>

            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                        placeholder="Alex Mercer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Country</label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      placeholder="1204 Infinite Loop Drive"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                        placeholder="San Jose"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                        placeholder="CA"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Zip Code / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-mono font-bold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      placeholder="95112"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 mt-6 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('shop')}
                    className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#111827] hover:border-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#111827] hover:bg-[#2563EB] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Secure Gateway
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-5">
                {/* Gateway Status Header */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-[#2563EB] border border-[#2563EB]/10">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#111827] uppercase tracking-wide">Encrypted Gateway Active</h5>
                      <p className="text-[10px] text-gray-400 font-mono font-bold uppercase">PCI-DSS Level 1 Cryptographic Node</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100 font-bold uppercase font-mono">
                    AES-256
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      placeholder="Alex Mercer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Silicon Encrypted Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-mono font-bold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expiration Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-mono font-bold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Security Code (CVV)</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#111827] font-mono font-bold focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 mt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#111827] hover:border-gray-400 transition flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#111827] hover:bg-[#2563EB] text-white py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2.5 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    Authorize Transmit of ₹{grandTotal.toLocaleString()}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary & Review Block */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-[#111827] rounded-[2rem] p-6 space-y-5 shadow-sm text-[#111827]">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#2563EB] border-b border-gray-100 pb-3">
                Order Configuration Overview
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#111827] truncate uppercase">{item.product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {item.selectedColor ? `Finish: ${item.selectedColor}` : 'Standard Config'} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#111827] shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Block Info */}
              {appliedCoupon && (
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Coupon: {appliedCoupon.code}</span>
                  </div>
                  <span className="text-emerald-700 font-black font-mono">
                    -{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`}
                  </span>
                </div>
              )}

              {/* Calculation List */}
              <div className="space-y-2 text-xs pt-3 border-t border-gray-100 text-gray-500 font-semibold font-mono">
                <div className="flex justify-between">
                  <span className="uppercase tracking-wider">Subtotal Value:</span>
                  <span className="text-gray-700 font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="uppercase tracking-wider">Discount Deduction:</span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="uppercase tracking-wider">Priority Transit:</span>
                  <span className="text-gray-700 font-bold">
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-[#111827] border-t border-gray-100 pt-3 text-sm font-black font-sans">
                  <span className="uppercase tracking-widest text-[#2563EB] text-xs font-extrabold">Final Grand Total:</span>
                  <span className="text-base font-mono text-[#2563EB]">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Core Warranty / Secure Badge Box */}
            <div className="bg-[#111827] text-white rounded-2xl p-5 border border-[#111827] flex items-start gap-3 shadow-sm">
              <Truck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Certified Carrier Dispatch</p>
                <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                  Orders exceeding ₹500 unlock complimentary express cleanroom shipping. Custom micro-architectures undergo premium stress diagnostics before airbill release.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
