import React from 'react';
import { X, Star, ShieldCheck, Heart, ShoppingBag, Send, AlertCircle } from 'lucide-react';
import { Product, Review } from '../types';
import { REVIEWS } from '../data';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  relatedProducts: Product[];
  onViewRelated: (product: Product) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  relatedProducts,
  onViewRelated
}: ProductDetailsModalProps) {
  const [activeImage, setActiveImage] = React.useState(product.images[0]);
  const [selectedColor, setSelectedColor] = React.useState(product.colors[0]);
  const [zoomStyle, setZoomStyle] = React.useState<React.CSSProperties>({});
  const [reviewsList, setReviewsList] = React.useState<Review[]>(REVIEWS[product.id] || []);

  // Review Form state
  const [newName, setNewName] = React.useState('');
  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState('');
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Sync active image when product changes
  React.useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedColor(product.colors[0]);
    setReviewsList(REVIEWS[product.id] || []);
    setSubmitSuccess(false);
  }, [product]);

  // Dynamic Hover Zoom feature for Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
    });
  };

  // Submit dynamic review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newReview: Review = {
      id: Math.random().toString(),
      userName: newName,
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment: newComment,
      verified: true
    };

    setReviewsList([newReview, ...reviewsList]);
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#111827] rounded-[2rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-[#111827] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-white text-[#111827] hover:bg-gray-100 border border-[#111827] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Image switcher & zoom stage (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Main Stage with Zoom */}
            <div
              className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 border border-[#111827]/10 cursor-zoom-in shadow-sm"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-100 ease-out"
                style={zoomStyle}
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-[#111827]/80 text-white px-2.5 py-1 rounded-lg backdrop-blur-md pointer-events-none uppercase tracking-wider">
                Hover to Zoom Tech
              </span>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 transition-all shrink-0 ${
                    activeImage === img ? 'border-[#2563EB] scale-95' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="h-[1px] bg-gray-100 my-2" />

            {/* Specifications Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">TECHNICAL OVERVIEW</h4>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-2.5 shadow-sm">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs font-mono border-b border-gray-200/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">{key}</span>
                    <span className="text-gray-800 text-right font-sans font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Descriptions & Interactive Review Form (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-[10px] bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full border border-[#2563EB]/20 font-bold uppercase tracking-wider">
                {product.category} Section
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#111827] mt-2">{product.name}</h2>
              
              {/* Stars & Reviews summary */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-500 font-mono">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-500 font-bold">
                  {reviewsList.length + (REVIEWS[product.id]?.length || 0)} Certified Engineers reviewed
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#111827] font-mono">₹{product.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">VAT and Import Enclave included</span>
            </div>

            {/* Custom Description */}
            <p className="text-gray-600 text-sm leading-relaxed font-semibold">
              {product.description}
            </p>

            {/* Color Configurator */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Select Core Finish: <span className="text-[#111827] font-black">{selectedColor}</span>
              </span>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                      selectedColor === color
                        ? 'bg-[#2563EB] border-[#111827] text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:text-[#111827] hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Action Panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onAddToCart(product, selectedColor)}
                disabled={!product.inStock}
                className="flex-1 bg-[#111827] hover:bg-[#2563EB] disabled:bg-gray-100 disabled:text-gray-400 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition text-white"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.inStock ? `Add Custom Config to Bag` : 'Unavailable In Stock'}
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-center gap-2 border-[#111827] ${
                  isWishlisted
                    ? 'bg-[#F59E0B] text-[#111827]'
                    : 'bg-white hover:bg-gray-50 text-gray-500 hover:text-[#111827]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                <span className="sm:hidden font-bold text-xs uppercase tracking-wider">Save item</span>
              </button>
            </div>

            {/* Quality badge banner */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Full 2-Year Silicon Warranty & secure delivery.</span>
            </div>

            <div className="h-[1px] bg-gray-100 my-6" />

            {/* Dynamic Interactive reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-[#111827]">Silicon Engineer Reviews</h3>

              {/* Add review form */}
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 shadow-sm">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">WRITE CODES & EXPERIENCES</span>
                
                {submitSuccess && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Review uploaded successfully.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g., Linus T.)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB] font-bold"
                  />
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rating:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="bg-transparent border-none text-xs text-amber-500 font-black focus:outline-none cursor-pointer"
                    >
                      <option value="5" className="text-[#111827]">5 Stars</option>
                      <option value="4" className="text-[#111827]">4 Stars</option>
                      <option value="3" className="text-[#111827]">3 Stars</option>
                      <option value="2" className="text-[#111827]">2 Stars</option>
                      <option value="1" className="text-[#111827]">1 Star</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    required
                    placeholder="Share your compiler benchmark or structural build reviews..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#2563EB] resize-none font-semibold"
                  />
                  <button
                    type="submit"
                    className="absolute bottom-3 right-3 p-1.5 bg-[#111827] hover:bg-[#2563EB] text-white rounded-lg transition-colors"
                    title="Publish Review"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Reviews Stack */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {reviewsList.length === 0 ? (
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider py-2">No hardware reviews yet. Be the first!</p>
                ) : (
                  reviewsList.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 text-[#111827]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#111827]">{review.userName}</span>
                        <span className="text-[10px] text-gray-400 font-mono font-bold">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 my-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">
                            VERIFIED silicon BUYER
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed font-semibold">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 my-6" />

            {/* Related recommendations section */}
            {relatedProducts.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  RECOMMENDED COMPLEMENTS
                </h3>
                <div className="grid grid-cols-2 gap-3.5">
                  {relatedProducts.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onViewRelated(item)}
                      className="bg-white p-2.5 rounded-2xl border border-gray-200 hover:border-[#111827] transition cursor-pointer flex gap-3 items-center group text-left"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100 group-hover:scale-95 transition"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-[#111827] group-hover:text-[#2563EB] transition truncate uppercase">
                          {item.name}
                        </h4>
                        <span className="text-xs font-mono text-gray-500 font-bold">₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
