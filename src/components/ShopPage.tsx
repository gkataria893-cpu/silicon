import React from 'react';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { Product, CartItem, Order, Address } from '../types';
import ProductCard from './ProductCard';

interface ShopPageProps {
  products: Product[];
  categories: { id: string; name: string }[];
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlist: Product[];
  orders: Order[];
  cart: CartItem[];
  user: { name: string; email: string; phone: string; addresses: Address[] } | null;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  setWishlistOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setActiveTab: (tab: 'shop' | 'orders' | 'profile' | 'checkout') => void;
}

export default function ShopPage({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  wishlist,
  orders,
  cart,
  user,
  onViewProduct,
  onAddToCart,
  onToggleWishlist,
  setWishlistOpen,
  setCartOpen,
  setActiveTab
}: ShopPageProps) {
  
  // Filter products based on search and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(product.specs).some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Dynamic Bento Grid Dashboard Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Category Filter Bento Block (col-span-1 row-span-2) */}
        <div className="md:col-span-1 md:row-span-2 bg-white border border-[#111827] rounded-[2rem] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-5">Categories</h3>
            <ul className="space-y-4">
              <li 
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center justify-between group cursor-pointer transition ${
                  selectedCategory === 'all' ? 'text-[#2563EB] font-black' : 'text-[#111827] hover:text-[#2563EB] font-semibold'
                }`}
              >
                <span className="text-sm">All Architectural Cores</span>
                <span className={`transition-all ${selectedCategory === 'all' ? 'opacity-100 translate-x-1' : 'opacity-30 group-hover:opacity-100'}`}>→</span>
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between group cursor-pointer transition ${
                    selectedCategory === cat.id ? 'text-[#2563EB] font-black' : 'text-[#111827] hover:text-[#2563EB] font-semibold'
                  }`}
                >
                  <span className="text-sm">{cat.name}</span>
                  <span className={`transition-all ${selectedCategory === cat.id ? 'opacity-100 translate-x-1' : 'opacity-30 group-hover:opacity-100'}`}>→</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-6 border-t border-gray-100 mt-6">
            <div className="p-4 bg-[#111827] rounded-2xl text-white">
              <p className="text-[9px] font-bold uppercase opacity-60 tracking-wider mb-1">PRO MEMBERSHIP</p>
              <p className="text-xs font-bold">Unlock developer enclave free delivery</p>
            </div>
          </div>
        </div>

        {/* Featured Core Hero Bento Block (col-span-2 row-span-2) */}
        <div className="md:col-span-2 md:row-span-2 bg-[#111827] text-white rounded-[2rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-center border border-[#111827] shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB] blur-[120px] opacity-30 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex">
              <span className="px-3 py-1 bg-[#2563EB] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-blue-400/30">
                FEATURED DROP
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tighter">
              SILICON<br />ULTRA M3
            </h2>
            <p className="text-gray-400 max-w-sm text-sm sm:text-base leading-relaxed">
              Next-generation compute architecture. Redefined silicon efficiency for high-performance professional enclaves.
            </p>
            <div className="pt-4 flex items-center gap-6">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white text-[#111827] font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-[#F59E0B] transition-colors shadow-sm"
              >
                Shop Featured Core
              </button>
              <span className="text-white font-mono text-xl sm:text-2xl font-black">₹1,299.00</span>
            </div>
          </div>
        </div>

        {/* Saved Items Bento Block (col-span-1 row-span-1) */}
        <div 
          onClick={() => setWishlistOpen(true)}
          className="col-span-1 bg-[#F59E0B] border border-[#111827] rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-transform shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-white rounded-xl border border-[#111827] text-[#111827]">
              <Heart className="w-5 h-5 fill-current text-rose-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#111827] bg-white/20 px-2 py-0.5 rounded-full border border-black/10">Saved</span>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tighter text-[#111827] uppercase">{wishlist.length} ITEMS</div>
            <p className="text-xs text-[#111827]/70 font-mono mt-1 group-hover:underline">Open tech wishlist →</p>
          </div>
        </div>

        {/* Shipping / Node Location Bento Block (col-span-1 row-span-1) */}
        <div className="col-span-1 bg-white border border-[#111827] rounded-[2rem] p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 text-[#111827]">
              <MapPin className="w-5 h-5 text-[#2563EB]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Node Destination</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Default Delivery Enclave</p>
            <p className="text-sm font-black text-[#111827] truncate">
              {user?.addresses.find(a => a.isDefault)?.street || "452 Silicon Valley, CA"}
            </p>
          </div>
        </div>

        {/* Active Orders Count Bento Block (col-span-1 row-span-1) */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="col-span-1 bg-[#2563EB] text-white rounded-[2rem] p-6 flex flex-col justify-center cursor-pointer group hover:scale-[1.02] transition-transform border border-[#111827] shadow-sm"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider opacity-85">Active Orders</h4>
          <p className="text-5xl font-black mt-1">{String(orders.length).padStart(2, '0')}</p>
          <p className="text-[9px] mt-2 font-mono uppercase text-blue-100 group-hover:underline">
            {orders.length > 0 ? "Transit: Live diagnostics tracking" : "No active deployments"}
          </p>
        </div>

        {/* Cart Session Status Bento Block (col-span-2 row-span-1) */}
        <div className="md:col-span-2 bg-white border border-[#111827] rounded-[2rem] p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex-1 w-full space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Ecosystem Cart Status</h4>
            <p className="text-xs text-gray-600 font-semibold">
              {cart.length === 0 ? "Active cart session is empty" : `${cart.reduce((a, b) => a + b.quantity, 0)} silicon units registered`}
            </p>
            <div className="flex gap-2 pt-1 overflow-hidden">
              {cart.length === 0 ? (
                <div className="text-xs text-gray-400 italic font-mono">Fill cart from hardware catalog...</div>
              ) : (
                cart.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-1 shrink-0 relative" title={item.product.name}>
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                    <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {item.quantity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="h-full w-px bg-gray-100 hidden sm:block mx-1" />
          <div className="text-right w-full sm:w-auto shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Session Total</p>
              <p className="text-2xl font-black text-[#111827] font-mono">
                ₹{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString()}
              </p>
            </div>
            <button 
              onClick={() => {
                if (cart.length > 0) {
                  setActiveTab('checkout');
                } else {
                  setCartOpen(true);
                }
              }}
              className="px-4 py-2.5 bg-[#111827] hover:bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              Checkout
            </button>
          </div>
        </div>

        {/* Dev Lead Testimonial Bento Block (col-span-1 row-span-1) */}
        <div className="col-span-1 bg-[#111827] rounded-[2rem] p-6 flex flex-col justify-center items-center text-center text-white border border-[#111827] shadow-sm">
          <div className="flex mb-2">
            <span className="text-[#F59E0B] tracking-widest text-sm">★★★★★</span>
          </div>
          <p className="text-xs font-medium italic opacity-85 leading-relaxed text-gray-300">
            "Best hardware performance gear I've ever deployed in 10 years of dev."
          </p>
          <p className="text-[9px] mt-3 font-bold uppercase text-gray-500 tracking-wider">— Alex R., DevOps Lead</p>
        </div>

      </section>

      {/* Catalog Title & Filters */}
      <div className="space-y-8 pt-6" id="catalog-grid-anchor">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#111827]/10 pb-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#111827]">Silicon Hardware Catalog</h2>
            <p className="text-gray-500 text-xs font-semibold">Flagship developer workstations & audio acoustics</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            {[{ id: 'all', name: 'All' }, ...categories].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#2563EB] text-white border-[#111827] shadow-sm'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 space-y-4 bg-white rounded-[2rem] border border-[#111827]/15 shadow-sm">
            <p className="text-gray-500 text-sm font-bold">No architectural silicon units match your active query.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs text-[#2563EB] hover:underline font-bold uppercase tracking-wider"
            >
              Reset catalog filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={onViewProduct}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
