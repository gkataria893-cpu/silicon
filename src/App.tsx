/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  Cpu,
  User,
  MapPin,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  WifiOff,
  X
} from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutPage from './components/CheckoutPage';
import ShopPage from './components/ShopPage';
import OfflineSimulator from './components/OfflineSimulator';
import AndroidProjectSection from './components/AndroidProjectSection';
import { Product, CartItem, Order, Address, Coupon } from './types';
import { PRODUCTS, CATEGORIES } from './data';

export default function App() {
  // Global App States
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [wishlist, setWishlist] = React.useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  
  // UI Panels Toggle States
  const [cartOpen, setCartOpen] = React.useState(false);
  const [wishlistOpen, setWishlistOpen] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'shop' | 'orders' | 'profile' | 'checkout'>('shop');
  const [isAndroidDocOpen, setIsAndroidDocOpen] = React.useState(false);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);

  // Authentication & Profile States
  const [user, setUser] = React.useState<{ name: string; email: string; phone: string; addresses: Address[] } | null>({
    name: 'Alex Mercer',
    email: 'alex.mercer@silicon.dev',
    phone: '+1 (555) 019-2831',
    addresses: [
      {
        id: '1',
        fullName: 'Alex Mercer',
        street: '1204 Infinite Loop Drive, Tech Enclave',
        city: 'San Jose',
        state: 'CA',
        zipCode: '95112',
        country: 'United States',
        isDefault: true
      }
    ]
  });

  const [orders, setOrders] = React.useState<Order[]>([]);

  // Auth form states
  const [authEmail, setAuthEmail] = React.useState('');
  const [authPassword, setAuthPassword] = React.useState('');
  const [authName, setAuthName] = React.useState('');
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Load cart & wishlist from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('silicon_cart');
    const savedWishlist = localStorage.getItem('silicon_wishlist');
    const savedOrders = localStorage.getItem('silicon_orders');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save changes to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('silicon_cart', JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist: Product[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('silicon_wishlist', JSON.stringify(newWishlist));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('silicon_orders', JSON.stringify(newOrders));
  };

  // Cart operations
  const handleAddToCart = (product: Product, color?: string) => {
    const chosenColor = color || product.colors[0];
    const existingIdx = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedColor === chosenColor
    );

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity: 1, selectedColor: chosenColor }]);
    }
  };

  const handleUpdateCartQty = (productId: string, quantity: number, color?: string) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId && item.selectedColor === color) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveFromCart = (productId: string, color?: string) => {
    const filtered = cart.filter(
      (item) => !(item.product.id === productId && item.selectedColor === color)
    );
    saveCart(filtered);
  };

  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      const filtered = wishlist.filter((item) => item.id !== product.id);
      saveWishlist(filtered);
    } else {
      saveWishlist([...wishlist, product]);
    }
  };

  const handleAddAddress = (newAddr: Address) => {
    if (!user) return;
    const updatedAddresses = [...user.addresses, newAddr];
    setUser({ ...user, addresses: updatedAddresses });
  };

  // Handle Auth submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    setUser({
      name: authName || authEmail.split('@')[0],
      email: authEmail,
      phone: '+1 (555) 000-0000',
      addresses: [
        {
          id: Math.random().toString(),
          fullName: authName || authEmail.split('@')[0],
          street: '123 Silicon Blvd',
          city: 'Tech Valley',
          state: 'CA',
          zipCode: '94043',
          country: 'United States',
          isDefault: true
        }
      ]
    });
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setIsAuthOpen(false);
  };

  // Filter Products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(product.specs).some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] font-sans antialiased selection:bg-[#2563EB] selection:text-white flex flex-col justify-between">
      
      {/* Offline Page Overlay */}
      <OfflineSimulator isOffline={isOffline} setIsOffline={setIsOffline} />

      <div>
        {/* Navigation Header */}
        <Header
          cart={cart}
          wishlist={wishlist}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCart={() => setCartOpen(true)}
          onOpenWishlist={() => setWishlistOpen(true)}
          onOpenAndroidDoc={() => setIsAndroidDocOpen(true)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={CATEGORIES}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsAndroidDocOpen(false);
          }}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Android Document Browser Screen */}
        {isAndroidDocOpen ? (
          <AndroidProjectSection />
        ) : (
          <main className="pb-16 pt-6">
            
            {/* View Tab Switcher */}
            {activeTab === 'shop' && (
              <ShopPage
                products={PRODUCTS}
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                wishlist={wishlist}
                orders={orders}
                cart={cart}
                user={user}
                onViewProduct={(prod) => setSelectedProduct(prod)}
                onAddToCart={(prod) => handleAddToCart(prod)}
                onToggleWishlist={handleToggleWishlist}
                setWishlistOpen={setWishlistOpen}
                setCartOpen={setCartOpen}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'orders' && (
              <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase tracking-tight text-[#111827]">Silicon Order Tracking</h2>
                  <p className="text-gray-500 text-xs font-semibold">Real-time status of your active silicon deployments</p>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white border border-[#111827] rounded-[2rem] p-10 text-center space-y-4 py-12 shadow-sm">
                    <Clock className="w-10 h-10 text-[#2563EB] mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#111827]">No active deployments found</p>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Please proceed to checkout with hardware from our catalog to launch secure tracking streams.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-sm"
                    >
                      Open Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white border border-[#111827] rounded-[2rem] p-6 space-y-4 shadow-sm text-[#111827]">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold tracking-wider block">DEPLOYMENT NODE</span>
                            <span className="text-sm font-bold font-mono text-[#111827]">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold tracking-wider block">SHIPMENT AIRBILL</span>
                            <span className="text-xs font-mono text-gray-600">{order.trackingNo}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold tracking-wider block">STATUS</span>
                            <span className="text-xs bg-blue-50 text-[#2563EB] px-2.5 py-1 rounded-lg border border-[#2563EB]/20 font-bold">
                              ACTIVE TRANSIT DIAGNOSTICS
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-gray-700 font-semibold truncate max-w-[280px]">
                                {item.product.name} {item.selectedColor ? `(${item.selectedColor})` : ''}
                              </span>
                              <span className="font-mono text-gray-500 font-bold">Qty {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="h-[1px] bg-gray-100" />

                        {/* Quick Telemetry Summary */}
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="text-gray-400 font-bold font-mono">Node Weight Value:</span>
                          <span className="font-black text-[#2563EB] text-sm">₹{order.total.toLocaleString()}</span>
                        </div>

                        <button
                          onClick={() => {
                            // Re-open checkout on completed view to see full logs
                            setCart([{ product: order.items[0].product, quantity: order.items[0].quantity }]);
                            setActiveTab('checkout');
                          }}
                          className="w-full bg-[#111827] hover:bg-[#2563EB] text-xs font-bold uppercase tracking-wider text-white py-3 rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          Launch Custom Shell Tracking UI
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && user && (
              <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                <div className="bg-[#111827] text-white border border-[#111827] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB] blur-[100px] opacity-20 pointer-events-none" />
                  
                  <div className="h-20 w-20 bg-[#2563EB] rounded-full flex items-center justify-center text-3xl font-black text-white border-2 border-blue-400 shadow-xl shadow-blue-600/10 font-sans">
                    {user.name.charAt(0)}
                  </div>

                  <div className="space-y-1 text-center sm:text-left relative z-10">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">{user.name}</h2>
                    <p className="text-xs text-blue-300 font-mono font-bold uppercase tracking-wider">{user.email}</p>
                    <p className="text-xs text-gray-400 font-mono">Enclave Link: {user.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Addresses */}
                  <div className="bg-white border border-[#111827] rounded-[2rem] p-6 space-y-4 shadow-sm text-[#111827]">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h4 className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase">SAVED DELIVERY ENCLAVES</h4>
                      <span className="text-[10px] bg-gray-50 text-gray-500 px-2.5 py-0.5 rounded border border-gray-100 font-bold uppercase">
                        {user.addresses.length} Configured
                      </span>
                    </div>

                    <div className="space-y-3">
                      {user.addresses.map((address) => (
                        <div key={address.id} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs space-y-1 leading-relaxed">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-[#111827]">{address.fullName}</span>
                            {address.isDefault && (
                              <span className="text-[9px] bg-[#2563EB]/10 text-[#2563EB] px-2 py-0.5 rounded font-bold uppercase">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 font-semibold">{address.street}</p>
                          <p className="text-gray-600 font-semibold">{address.city}, {address.state} {address.zipCode}</p>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{address.country}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Panel */}
                  <div className="bg-white border border-[#111827] rounded-[2rem] p-6 space-y-4 shadow-sm text-[#111827]">
                    <h4 className="text-xs font-extrabold tracking-widest text-[#2563EB] uppercase border-b border-gray-100 pb-3">
                      ENCLAVE CREDENTIALS & SECURITY
                    </h4>

                    <div className="space-y-3 text-xs leading-relaxed">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center font-bold">
                        <span className="text-gray-500">SSL Safe Browsing:</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          ENABLED
                        </span>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center font-bold">
                        <span className="text-gray-500">WebView Provider:</span>
                        <span className="text-[#2563EB]">com.siliconproduct.app</span>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center font-bold">
                        <span className="text-gray-500">Session Keys:</span>
                        <span className="text-gray-700">EPHEMERAL (Local Cache)</span>
                      </div>

                      <button
                        onClick={() => {
                          setUser(null);
                          setOrders([]);
                          saveOrders([]);
                          saveCart([]);
                          saveWishlist([]);
                          setActiveTab('shop');
                        }}
                        className="w-full bg-rose-50 hover:bg-rose-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm border border-[#111827]"
                      >
                        Wipe Ephemeral Cache Session
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'checkout' && (
              <CheckoutPage
                cart={cart}
                appliedCoupon={appliedCoupon}
                onOrderCompleted={(order) => {
                  saveOrders([order, ...orders]);
                }}
                clearCart={() => {
                  saveCart([]);
                  setAppliedCoupon(null);
                }}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                }}
              />
            )}

          </main>
        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-[#111827] border-t border-[#111827] py-12 text-gray-400 text-xs font-mono text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2563EB]" />
            <span className="text-white font-sans font-black tracking-widest uppercase text-sm">SILICON PRODUCT</span>
            <span className="text-gray-500 font-bold">• HUB</span>
          </div>

          <div className="flex gap-6 font-bold uppercase tracking-wider text-[11px]">
            <button onClick={() => { setActiveTab('shop'); setIsAndroidDocOpen(false); }} className="hover:text-white transition">Catalog</button>
            <button onClick={() => setIsAndroidDocOpen(true)} className="hover:text-white transition">Android Codebase</button>
            <button onClick={() => { setActiveTab('orders'); }} className="hover:text-white transition">Tracking Node</button>
          </div>

          <div className="text-gray-500">
            <span>© 2026 Silicon Product Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* DRAWERS & MODALS */}

      {/* Product Inspect Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(prod, col) => {
            handleAddToCart(prod, col);
            setSelectedProduct(null);
            setCartOpen(true);
          }}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some((w) => w.id === selectedProduct.id)}
          relatedProducts={PRODUCTS.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)}
          onViewRelated={(prod) => setSelectedProduct(prod)}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setActiveTab('checkout');
        }}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
      />

      {/* Wishlist Sidebar / Modal overlay */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setWishlistOpen(false)} />
          <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-900 text-white flex flex-col h-full shadow-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-current" />
                <h3 className="text-lg font-bold">Your Tech Wishlist</h3>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {wishlist.length === 0 ? (
                <p className="text-xs text-neutral-500 font-mono text-center py-12">Wishlist is currently empty.</p>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-neutral-900/40 border border-neutral-900 rounded-2xl items-center">
                    <img src={item.images[0]} alt="" referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-xl bg-neutral-950" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-neutral-200 truncate">{item.name}</h4>
                      <span className="text-xs font-mono font-bold text-neutral-400">${item.price}</span>
                    </div>
                    <button
                      onClick={() => handleToggleWishlist(item)}
                      className="text-neutral-500 hover:text-rose-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Sign In / Sign Up Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl text-white relative p-6 sm:p-8 space-y-5">
            
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-900 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="mx-auto w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-2">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">
                {isRegistering ? 'Register Enclave Profile' : 'Authenticate Session'}
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono uppercase">Secure Direct login</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="text-[9px] text-neutral-500 font-mono uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[9px] text-neutral-500 font-mono uppercase block mb-1">Email Enclave</label>
                <input
                  type="email"
                  required
                  placeholder="alex.mercer@silicon.dev"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[9px] text-neutral-500 font-mono uppercase block mb-1">Secure Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs transition"
              >
                {isRegistering ? 'Create Profile Sequence' : 'Establish Enclave Link'}
              </button>
            </form>

            <p className="text-center text-[11px] text-neutral-500">
              {isRegistering ? 'Already linked?' : "Don't have a profile link yet?"}{' '}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-blue-400 hover:underline font-bold"
              >
                {isRegistering ? 'Sign In' : 'Register Here'}
              </button>
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
