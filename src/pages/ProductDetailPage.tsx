import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  TrendingDown,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Package,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { getProductEnquiryWhatsAppUrl, buildWhatsAppUrl } from '../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    activeProductId,
    addToCart,
    toggleFavorite,
    isFavorite,
    settings,
    navigateTo,
    priceHistory,
  } = useStore();

  const product = products.find((p) => p.id === activeProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isFav = isFavorite(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  // Dynamic Tier Calculation
  const isWholesaleApplied = quantity >= product.minWholesaleQty;
  const unitPrice = isWholesaleApplied ? product.wholesalePrice : product.retailPrice;
  const dynamicSubtotal = unitPrice * quantity;
  const retailSubtotal = product.retailPrice * quantity;
  const savings = retailSubtotal - dynamicSubtotal;

  const handleAddToCart = (instantBuy = false) => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
    if (instantBuy) {
      navigateTo('checkout');
    }
  };

  // WhatsApp direct product order message
  const handleWhatsAppOrder = () => {
    const message = `Hello ${settings.shopName}! 🥬\nI want to order *${product.name}*:\n- Quantity: ${quantity} ${product.unit}\n- Rate: ${settings.currencySymbol}${unitPrice.toFixed(2)} / ${product.unit} (${isWholesaleApplied ? 'Wholesale Tier' : 'Retail'})\n- Estimated Subtotal: ${settings.currencySymbol}${dynamicSubtotal.toFixed(2)}\n\nPlease confirm availability and delivery slot!`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, message);
    window.open(url, '_blank');
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Frequently bought together
  const frequentlyBought = products
    .filter((p) => p.id !== product.id && p.isFeatured)
    .slice(0, 2);

  // Product price history
  const productHistory = priceHistory.filter((h) => h.productId === product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => navigateTo('home')} className="hover:text-stone-800">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-stone-800">
          Produce Catalog
        </button>
        <span>/</span>
        <button
          onClick={() => navigateTo('shop', { categorySlug: product.category })}
          className="hover:text-stone-800"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-stone-800 font-bold truncate max-w-[150px] sm:max-w-none">
          {product.name}
        </span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Favorite heart button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFav
                  ? 'bg-rose-50 text-rose-500 shadow-md'
                  : 'bg-white/80 backdrop-blur-xs text-stone-600 hover:text-rose-500 shadow-xs'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            </button>

            {/* Price trend badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
              {product.priceUpdatedToday && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-xs text-emerald-200 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                  Price Updated Today ({product.lastPriceUpdate})
                </span>
              )}
              {product.priceChangeDirection === 'down' && (
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Rate Dropped
                </span>
              )}
              {product.priceChangeDirection === 'up' && (
                <span className="inline-flex items-center gap-1 bg-amber-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Rate Increased
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-emerald-700 ring-2 ring-emerald-200'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Pricing Flow */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                SKU: {product.id.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
              {product.name}
            </h1>
            {product.malayalamName && (
              <p className="text-lg font-bold text-emerald-800 mt-1">
                {product.malayalamName}
              </p>
            )}
            {product.arabicName && (
              <p className="text-sm text-emerald-700/80 font-medium mt-0.5" dir="rtl">
                {product.arabicName}
              </p>
            )}

            {product.altNames && product.altNames.length > 0 && (
              <p className="text-xs text-stone-500 mt-1">
                Common names: {product.altNames.join(', ')}
              </p>
            )}
          </div>

          {/* Primary Pricing Block */}
          <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 space-y-4">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs text-stone-500 font-medium">Retail Price: </span>
                <span className="text-2xl sm:text-3xl font-black text-stone-900">
                  {settings.currencySymbol}
                  {product.retailPrice.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-stone-600"> / {product.unit}</span>
              </div>

              {product.previousRetailPrice && product.previousRetailPrice !== product.retailPrice && (
                <div className="text-xs text-stone-400">
                  Previous: <span className="line-through">{settings.currencySymbol}{product.previousRetailPrice.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Wholesale Tier Breakdown Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Wholesale Bulk Tier
                </span>
                <span className="font-black text-emerald-800 text-sm">
                  {settings.currencySymbol}
                  {product.wholesalePrice.toFixed(2)} / {product.unit}
                </span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-tight">
                Order <strong>{product.minWholesaleQty}+ {product.unit}s</strong> to unlock wholesale commercial rate automatically at checkout.
              </p>

              {/* Tiers List */}
              {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
                <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  {product.wholesaleTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-center border ${
                        quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty)
                          ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs'
                          : 'bg-white text-stone-700 border-emerald-100'
                      }`}
                    >
                      <p className="font-semibold text-[10px]">
                        {tier.minQty}{tier.maxQty ? ` - ${tier.maxQty}` : '+'} {product.unit}
                      </p>
                      <p className="font-black text-xs">
                        {settings.currencySymbol}{tier.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Availability */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-stone-500">Stock Availability:</span>
              {isOutOfStock ? (
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Low Stock ({product.stock} {product.unit} left)
                </span>
              ) : (
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  In Stock ({product.stock} {product.unit})
                </span>
              )}
            </div>
          </div>

          {/* Interactive Quantity Selector & Dynamic Subtotal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Choose Quantity ({product.unit}):</span>
              <span className="text-emerald-800">
                {isWholesaleApplied ? '🎉 Wholesale Tier Active' : `Add ${product.minWholesaleQty - quantity} more for wholesale price`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-200 rounded-2xl bg-white p-1 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock > 0 ? product.stock : 999}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 text-center font-black text-stone-900 focus:outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic subtotal display */}
              <div className="flex-1 bg-stone-100 rounded-2xl p-3 text-right">
                <p className="text-[11px] text-stone-500">Calculated Subtotal</p>
                <p className="text-xl font-black text-stone-900">
                  {settings.currencySymbol}
                  {dynamicSubtotal.toFixed(2)}
                </p>
                {savings > 0 && (
                  <p className="text-[10px] text-emerald-700 font-bold">
                    You save {settings.currencySymbol}{savings.toFixed(2)}!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart, Buy Now, Order via WhatsApp */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* WhatsApp Order Action */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-101 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>Order this Item via WhatsApp</span>
            </button>

            {addedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center animate-in fade-in">
                ✓ Added {quantity} {product.unit} of {product.name} to cart!
              </div>
            )}
          </div>

          {/* Produce Specs & Details Grid */}
          <div className="border-t border-stone-200 pt-6 space-y-4 text-xs text-stone-700">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="text-[11px] text-stone-400 font-medium">Farm Origin</p>
                <p className="font-bold text-stone-900 mt-0.5">{product.origin || 'Regional Co-op'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="text-[11px] text-stone-400 font-medium">Freshness Batch</p>
                <p className="font-bold text-stone-900 mt-0.5">{product.freshnessNotes || 'Inspected Today'}</p>
              </div>
            </div>

            {product.description && (
              <div>
                <h4 className="font-bold text-stone-900 mb-1 text-sm">Product Description</h4>
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.storageTips && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                <h5 className="font-bold text-xs flex items-center gap-1.5 mb-1">
                  <span>💡 Chef & Storage Tips</span>
                </h5>
                <p className="text-xs leading-relaxed">{product.storageTips}</p>
              </div>
            )}

            {/* Price Audit trail preview */}
            {productHistory.length > 0 && (
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700">
                <h5 className="font-bold text-xs mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Recent Market Price Changes</span>
                </h5>
                <div className="space-y-1.5">
                  {productHistory.slice(0, 3).map((hist) => (
                    <div key={hist.id} className="flex items-center justify-between text-[11px] text-stone-600">
                      <span>{hist.effectiveAt.split(' ')[0]} ({hist.reason || 'Market adjustment'})</span>
                      <span className="font-semibold">
                        {settings.currencySymbol}{hist.oldPrice.toFixed(2)} → <strong className="text-emerald-800">{settings.currencySymbol}{hist.newPrice.toFixed(2)}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      {frequentlyBought.length > 0 && (
        <section className="pt-8 border-t border-stone-200">
          <h3 className="text-xl font-black text-stone-900 mb-4">
            Frequently Bought Together
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {frequentlyBought.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Related Products in this category */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-stone-900">
              More Fresh {product.category}
            </h3>
            <button
              onClick={() => navigateTo('shop', { categorySlug: product.category })}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              View Department →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
