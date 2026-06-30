import React from 'react';
import { ShoppingBag, Heart, Search, Cpu, User, Menu, X, Terminal, BookOpen } from 'lucide-react';
import { CartItem, Product } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlist: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAndroidDoc: () => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  categories: { id: string; name: string }[];
  activeTab: 'shop' | 'orders' | 'profile' | 'checkout';
  setActiveTab: (tab: 'shop' | 'orders' | 'profile' | 'checkout') => void;
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
}

export default function Header({
  cart,
  wishlist,
  searchQuery,
  setSearchQuery,
  onOpenCart,
  onOpenWishlist,
  onOpenAndroidDoc,
  selectedCategory,
  setSelectedCategory,
  categories,
  activeTab,
  setActiveTab,
  user,
  onOpenAuth
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#F3F4F6]/90 backdrop-blur-md pt-4 pb-2 text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 bg-white border border-[#111827] rounded-3xl p-4 shadow-sm gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('shop'); setSelectedCategory('all'); }}>
            <div className="bg-[#2563EB] p-2.5 rounded-xl text-white shadow-md shadow-[#2563EB]/20 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-sans font-black uppercase tracking-tighter text-lg sm:text-2xl text-[#111827]">
              SILICON <span className="text-[#2563EB] font-bold">PRODUCT</span>
            </span>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#111827] opacity-40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search flagship custom silicon, headsets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F4F6] border-none text-sm text-[#111827] rounded-2xl pl-11 pr-4 py-3 placeholder:text-[#111827]/40 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
            />
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => { setActiveTab('shop'); }}
              className={`text-sm font-bold uppercase tracking-wider transition ${activeTab === 'shop' ? 'text-[#2563EB]' : 'text-[#111827]/60 hover:text-[#111827]'}`}
            >
              Catalog
            </button>
            <button
              onClick={() => { setActiveTab('orders'); }}
              className={`text-sm font-bold uppercase tracking-wider transition ${activeTab === 'orders' ? 'text-[#2563EB]' : 'text-[#111827]/60 hover:text-[#111827]'}`}
            >
              Order Tracking
            </button>
            <button
              onClick={onOpenAndroidDoc}
              className="text-xs bg-[#F3F4F6] hover:bg-gray-100 border border-[#111827]/20 text-[#2563EB] font-bold uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              Android Project
            </button>
          </nav>

          {/* Quick Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Toggle (Mobile) */}
            <button className="p-2 text-[#111827]/60 hover:text-[#111827] hover:bg-gray-100 rounded-xl md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#111827] hover:text-[#2563EB] relative rounded-xl hover:bg-gray-100 transition"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-[#F59E0B] text-[#111827] text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="p-2 text-[#111827] hover:text-[#2563EB] relative rounded-xl hover:bg-gray-100 transition"
              title="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <button
                onClick={() => setActiveTab('profile')}
                className={`p-2 rounded-xl flex items-center gap-2 transition ${activeTab === 'profile' ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30' : 'text-[#111827] hover:bg-gray-100'}`}
                title="Account Dashboard"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold font-sans uppercase tracking-wider max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              className="p-2 text-[#111827] hover:text-[#2563EB] lg:hidden rounded-xl hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mx-4 mt-2 bg-white border border-[#111827] rounded-3xl p-4 space-y-4 shadow-md">
          {/* Mobile Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F4F6] text-sm text-[#111827] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('shop'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${activeTab === 'shop' ? 'bg-[#F3F4F6] text-[#2563EB]' : 'text-neutral-600'}`}
            >
              Catalog
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${activeTab === 'orders' ? 'bg-[#F3F4F6] text-[#2563EB]' : 'text-neutral-600'}`}
            >
              Order Tracking
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${activeTab === 'profile' ? 'bg-[#F3F4F6] text-[#2563EB]' : 'text-neutral-600'}`}
            >
              Customer Profile
            </button>
            
            <div className="h-[1px] bg-gray-100 my-2" />

            <button
              onClick={() => { onOpenAndroidDoc(); setMobileMenuOpen(false); }}
              className="w-full bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition border border-[#2563EB]/20 uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4" />
              Android Studio Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
