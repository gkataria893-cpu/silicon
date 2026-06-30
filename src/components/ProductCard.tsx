import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  key?: React.Key;
}

export default function ProductCard({
  product,
  onView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="group bg-white border border-[#111827] rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges / Wishlist Icon */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isFeatured && (
          <span className="bg-[#2563EB] text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#111827]">
            Silicon Custom
          </span>
        )}
        {!product.inStock && (
          <span className="bg-rose-500 text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#111827]">
            Out of stock
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 border border-[#111827] ${
          isWishlisted
            ? 'bg-[#F59E0B] text-[#111827]'
            : 'bg-white text-gray-500 hover:text-[#111827] hover:bg-gray-100'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
      </button>

      {/* Product Image Stage */}
      <div
        className="relative pt-[90%] bg-gray-50 cursor-pointer overflow-hidden border-b border-[#111827]/10"
        onClick={() => onView(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Quick View Overlay on Desktop hover */}
        <div className="absolute inset-0 bg-[#111827]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-[#111827] border border-[#111827] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            Quick Inspect
          </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#2563EB] uppercase tracking-wider font-sans text-[11px]">{product.category}</span>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-[#111827]">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onView(product)}
            className="text-lg font-black text-[#111827] tracking-tight hover:text-[#2563EB] transition cursor-pointer line-clamp-1 uppercase"
          >
            {product.name}
          </h3>

          {/* Color Indicators */}
          <div className="flex gap-1.5 py-0.5">
            {product.colors.map((color, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                style={{
                  backgroundColor:
                    color.toLowerCase().includes('black') || color.toLowerCase().includes('carbon') || color.toLowerCase().includes('obsidian')
                      ? '#171717'
                      : color.toLowerCase().includes('silver') || color.toLowerCase().includes('gray') || color.toLowerCase().includes('titanium') || color.toLowerCase().includes('slate')
                      ? '#78716c'
                      : color.toLowerCase().includes('aurora') || color.toLowerCase().includes('green')
                      ? '#10b981'
                      : '#fafaf9',
                }}
                title={color}
              />
            ))}
          </div>

          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block font-mono font-bold uppercase">Value</span>
            <span className="text-xl font-black text-[#111827] font-mono">₹{product.price.toLocaleString()}</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border border-[#111827] ${
              product.inStock
                ? 'bg-[#111827] hover:bg-[#2563EB] active:bg-[#2563EB]/80 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
