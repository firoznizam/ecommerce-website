import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
  Bookmark,
  MessageCircle,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCartOrderWhatsAppUrl } from '../utils/whatsapp';

export const CartPage: React.FC = () => {
  const {
    cart,
    savedForLater,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedDeliveryZone,
    settings,
    navigateTo,
    customer,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleWhatsAppCheckout = () => {
    const url = getCartOrderWhatsAppUrl(
      cart,
      {
        name: customer?.name || 'Customer via Web Cart',
        phone: customer?.phone || 'To be confirmed on chat',
        address: customer?.address || `${selectedDeliveryZone.name}`,
        slot: 'Immediate / Next Available Slot',
      },
      cartSubtotal,
      deliveryFee,
      discountAmount,
      cartTotal,
      settings
    );
    window.open(url, '_blank');
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Your Basket is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Explore today's freshly updated farm harvest, wholesale potato & onion crates, and organic green herbs.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            Browse Produce Catalog
          </button>
          <button
            onClick={() => navigateTo('todays-prices')}
            className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-all"
          >
            Today's Mandi Rates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Produce Cart
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {cart.length} unique produce {cart.length === 1 ? 'item' : 'items'} in your basket
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Clear Basket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity }) => {
            const isWholesale = quantity >= product.minWholesaleQty || customer?.isWholesaleApproved;
            const appliedPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
            const lineTotal = appliedPrice * quantity;

            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base mt-1 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                      <span>Rate:</span>
                      <strong className="text-stone-900">
                        {settings.currencySymbol}{appliedPrice.toFixed(2)} / {product.unit}
                      </strong>
                      {isWholesale && (
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          Wholesale
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity + Subtotal + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-black text-xs text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <p className="font-black text-base text-stone-900">
                      {settings.currencySymbol}{lineTotal.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-stone-400 font-medium">
                      {quantity} {product.unit}s
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => saveForLater(product.id)}
                      title="Save for later"
                      className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      title="Remove from cart"
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">
                Saved for Later ({savedForLater.length})
              </h3>
              <div className="space-y-2">
                {savedForLater.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{product.name}</p>
                        <p className="text-stone-500">
                          {settings.currencySymbol}{product.retailPrice.toFixed(2)} / {product.unit}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => moveToCart(product.id)}
                      className="px-3 py-1.5 bg-white border border-stone-300 hover:border-emerald-600 text-emerald-800 font-bold rounded-lg transition-colors"
                    >
                      Move to Basket
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Checkout Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5 sticky top-36">
            <h3 className="font-black text-stone-900 text-lg pb-3 border-b border-stone-100">
              Order Summary
            </h3>

            {/* Subtotal breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Produce Subtotal:</span>
                <span className="font-bold text-stone-900">
                  {settings.currencySymbol}{cartSubtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated Delivery ({selectedDeliveryZone.name}):</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Free Delivery
                  </span>
                ) : (
                  <span className="font-bold text-stone-900">
                    {settings.currencySymbol}{deliveryFee.toFixed(2)}
                  </span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({appliedCoupon?.code}):</span>
                  <span>-{settings.currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Free delivery threshold progress */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                  <span>Free Delivery Threshold:</span>
                  <span>{settings.currencySymbol}{selectedDeliveryZone.freeDeliveryThreshold}</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (cartSubtotal / selectedDeliveryZone.freeDeliveryThreshold) * 100)}%`,
                    }}
                  ></div>
                </div>
                {cartSubtotal < selectedDeliveryZone.freeDeliveryThreshold && (
                  <p className="text-[10px] text-stone-400 mt-1">
                    Add {settings.currencySymbol}{(selectedDeliveryZone.freeDeliveryThreshold - cartSubtotal).toFixed(2)} more fresh produce for Free Delivery!
                  </p>
                )}
              </div>
            </div>

            {/* Coupon input */}
            <div className="pt-3 border-t border-stone-100">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    {appliedCoupon.code} Applied
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-600">
                    Promo or Wholesale Coupon
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. FRESH10 or BULK5"
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl uppercase font-bold focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponFeedback && (
                    <p
                      className={`text-[10px] font-medium ${
                        couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Total Payable
                </p>
                <p className="text-2xl font-black text-stone-900">
                  {settings.currencySymbol}{cartTotal.toFixed(2)}
                </p>
              </div>
              <span className="text-[11px] text-stone-400">Taxes Included</span>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950" />
                <span>Order this Basket via WhatsApp</span>
              </button>
            </div>

            {/* Trust note */}
            <div className="pt-2 text-center text-[10px] text-stone-400 space-y-0.5">
              <p>✓ Cash on Delivery & Direct Farm Pickup Accepted</p>
              <p>✓ 100% Crisp Vegetable Freshness Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
