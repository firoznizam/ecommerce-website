import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  MessageCircle,
  Clock,
  Sparkles,
  Info,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getProductEnquiryWhatsAppUrl } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const {
    addToCart,
    cart,
    updateQuantity,
    toggleFavorite,
    isFavorite,
    settings,
    navigateTo,
  } = useStore();

  const [localQty, setLocalQty] = useState(1);
  const isFav = isFavorite(product.id);

  // Check if item is currently in cart
  const inCartItem = cart.find((i) => i.product.id === product.id);
  const currentInCartQty = inCartItem ? inCartItem.quantity : 0;

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock <= 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on direct interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }
    if (onSelect) {
      onSelect(product);
    } else {
      navigateTo('product-detail', { productId: product.id });
    }
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, localQty);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFav
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 backdrop-blur-xs text-stone-600 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Price Update & Trend Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.priceUpdatedToday && (
            <span className="inline-flex items-center gap-1 bg-emerald-950/80 backdrop-blur-xs text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              <Clock className="w-2.5 h-2.5" />
              Price Updated Today
            </span>
          )}

          {product.priceChangeDirection === 'down' && (
            <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
              <TrendingDown className="w-3 h-3" />
              Rate Dropped
            </span>
          )}

          {product.priceChangeDirection === 'up' && (
            <span className="inline-flex items-center gap-0.5 bg-amber-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
              <TrendingUp className="w-3 h-3" />
              Rate Up
            </span>
          )}
        </div>

        {/* Category tag */}
        <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-stone-900/70 backdrop-blur-xs text-stone-100 px-2 py-0.5 rounded-md">
          {product.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-1">
                {product.name}
              </h3>
              {product.malayalamName && (
                <p className="text-xs font-bold text-emerald-700 tracking-wide mt-0.5">
                  {product.malayalamName}
                </p>
              )}
            </div>
          </div>

          {/* Alternative / local names */}
          {product.altNames && product.altNames.length > 0 && (
            <p className="text-[11px] text-stone-500 font-medium line-clamp-1 mb-2">
              Also known as: {product.altNames.slice(0, 3).join(', ')}
            </p>
          )}

          {/* Price Hierarchy Display */}
          <div className="bg-stone-50 rounded-xl p-2.5 mb-3 border border-stone-100">
            {/* Retail price */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium">Retail: </span>
                <span className="text-lg font-extrabold text-stone-900">
                  {settings.currencySymbol}
                  {product.retailPrice.toFixed(2)}
                </span>
                <span className="text-xs text-stone-600 font-medium"> / {product.unit}</span>
              </div>
              {product.previousRetailPrice && product.previousRetailPrice !== product.retailPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {settings.currencySymbol}
                  {product.previousRetailPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Wholesale price tier highlight */}
            {product.wholesalePrice > 0 && (
              <div className="mt-1 pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Wholesale ({product.minWholesaleQty}+ {product.unit}s):
                </span>
                <span className="font-bold text-emerald-800">
                  {settings.currencySymbol}
                  {product.wholesalePrice.toFixed(2)} / {product.unit}
                </span>
              </div>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-center justify-between text-xs mb-3">
            {isOutOfStock ? (
              <span className="font-semibold text-rose-600">Out of Stock</span>
            ) : isLowStock ? (
              <span className="font-semibold text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Low Stock ({product.stock} {product.unit} left)
              </span>
            ) : (
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                In Stock ({product.stock} {product.unit})
              </span>
            )}

            <span className="text-[11px] text-stone-500">{product.origin?.split('/')[0]}</span>
          </div>
        </div>

        {/* Actions & Direct Quantity Controls */}
        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
          {isOutOfStock ? (
            <a
              href={getProductEnquiryWhatsAppUrl(product, settings)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold text-xs transition-colors border border-stone-200"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Notify When Available
            </a>
          ) : currentInCartQty > 0 ? (
            /* Direct In-Cart Quantity Controls & Direct Checkout */
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, currentInCartQty - 1);
                  }}
                  className="w-7 h-7 rounded-lg bg-white text-emerald-800 font-bold flex items-center justify-center hover:bg-emerald-100 active:scale-90 transition-all shadow-xs"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="text-center">
                  <span className="font-black text-xs text-emerald-950">{currentInCartQty}</span>
                  <span className="text-[10px] text-emerald-800 font-semibold ml-1">
                    {product.unit} in cart
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, currentInCartQty + 1);
                  }}
                  className="w-7 h-7 rounded-lg bg-white text-emerald-800 font-bold flex items-center justify-center hover:bg-emerald-100 active:scale-90 transition-all shadow-xs"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('checkout');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Purchase Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* Quick Add with Qty Selector and Direct Buy Button */
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                    className="px-2 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-xs text-stone-900">
                    {localQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLocalQty(localQty + 1)}
                    className="px-2 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd();
                  }}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-800 font-bold text-xs border border-stone-200 transition-all active:scale-98"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>Add</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, localQty);
                    navigateTo('checkout');
                  }}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick WhatsApp Inquiry Link */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
            <button
              onClick={() => navigateTo('product-detail', { productId: product.id })}
              className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
            >
              <Info className="w-3 h-3" />
              View Tiers & Tips
            </button>
            <a
              href={getProductEnquiryWhatsAppUrl(product, settings)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-stone-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3 text-emerald-600" />
              Ask on WA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
