import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  Printer,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const OrderConfirmationPage: React.FC = () => {
  const { orders, activeOrderNo, lastPlacedOrder, settings, navigateTo } = useStore();

  const order =
    (activeOrderNo ? orders.find((o) => o.orderNo === activeOrderNo) : null) ||
    lastPlacedOrder ||
    orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">No active order found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleWhatsAppChat = () => {
    const message = `Hello Adam Vegetables! I just placed order ${order.orderNo} for ${settings.currencySymbol}${order.total.toFixed(2)}. Please confirm receipt and packing schedule.`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, message);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Success Badge & Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          Thank you, {order.customerName}!
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Your fresh produce order <strong className="text-stone-900">{order.orderNo}</strong> has been received by our morning dispatch queue.
        </p>
      </div>

      {/* WhatsApp Dispatch Notice */}
      <div className="bg-[#25D366]/10 border border-[#25D366]/40 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-stone-950 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 fill-stone-950" />
          </div>
          <div>
            <h4 className="font-bold text-stone-950 text-sm">Real-Time WhatsApp Updates</h4>
            <p className="text-xs text-stone-600">
              We'll send packing and driver dispatch notices to {order.customerWhatsApp || order.customerPhone}.
            </p>
          </div>
        </div>

        <button
          onClick={handleWhatsAppChat}
          className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 text-xs font-black shrink-0 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4 fill-stone-950" />
          <span>Confirm on WhatsApp</span>
        </button>
      </div>

      {/* Order Summary Receipt Box */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Order Number</span>
            <p className="text-xl font-black text-stone-900">{order.orderNo}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Payment Preference</span>
            <p className="text-xs font-bold text-stone-800 capitalize">
              {order.paymentMethod.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900 font-bold mb-0.5">Delivery Destination</strong>
              <p className="text-stone-600 leading-relaxed">{order.deliveryAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900 font-bold mb-0.5">Scheduled Slot & Date</strong>
              <p className="text-stone-600">{order.preferredDeliveryDate} • {order.deliverySlot}</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
            Reserved Farm Items ({order.items.length})
          </h4>
          <div className="divide-y divide-stone-100 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-bold text-stone-900">{item.productName}</p>
                    <p className="text-[10px] text-stone-500">
                      {item.quantity} {item.unit} × {settings.currencySymbol}{item.unitPrice.toFixed(2)}
                      {item.isWholesalePriceApplied && (
                        <span className="ml-2 text-emerald-700 font-bold">Wholesale Tier</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-stone-900">
                  {settings.currencySymbol}{item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal:</span>
            <span className="font-bold text-stone-900">
              {settings.currencySymbol}{order.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery Fee:</span>
            <span className="font-bold text-stone-900">
              {order.deliveryFee === 0 ? 'Free' : `${settings.currencySymbol}${order.deliveryFee.toFixed(2)}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Discount ({order.couponCode || 'Promo'}):</span>
              <span>-{settings.currencySymbol}{order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-100">
            <span>Total Payable:</span>
            <span>{settings.currencySymbol}{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigateTo('order-tracking', { orderNo: order.orderNo })}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition-colors"
          >
            Live Tracking
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
