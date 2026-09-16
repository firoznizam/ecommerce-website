import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  MessageCircle,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const OrderTrackingPage: React.FC = () => {
  const { orders, activeOrderNo, products, addToCart, settings, navigateTo } = useStore();

  const [searchQuery, setSearchQuery] = useState(activeOrderNo || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Automatically find active order if navigated with activeOrderNo
  useEffect(() => {
    if (activeOrderNo) {
      const match = orders.find((o) => o.orderNo.toLowerCase() === activeOrderNo.toLowerCase());
      if (match) {
        setSearchedOrder(match);
        setHasSearched(true);
        setSearchQuery(match.orderNo);
      }
    } else if (orders.length > 0 && !searchedOrder) {
      // Default to latest order for preview
      setSearchedOrder(orders[0]);
    }
  }, [activeOrderNo, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchedOrder(null);
      return;
    }

    const found = orders.find(
      (o) =>
        o.orderNo.toLowerCase() === query ||
        o.customerPhone.includes(query) ||
        (o.customerWhatsApp && o.customerWhatsApp.includes(query))
    );

    setSearchedOrder(found || null);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const existingProduct = products.find((p) => p.id === item.productId);
      if (existingProduct) {
        addToCart(existingProduct, item.quantity);
      } else {
        addToCart(
          {
            id: item.productId,
            name: item.productName,
            slug: item.productId,
            category: 'Vegetables',
            unit: item.unit,
            retailPrice: item.unitPrice,
            wholesalePrice: item.unitPrice * 0.85,
            minWholesaleQty: 10,
            stock: 99,
            lowStockThreshold: 5,
            images: [item.productImage],
            active: true,
            priceUpdatedToday: true,
            lastPriceUpdate: '05:30 AM',
            priceChangeDirection: 'unchanged',
          },
          item.quantity
        );
      }
    });
    navigateTo('cart');
  };

  // Status index mapping
  const statusSequence: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepStatus = (currentStatus: OrderStatus, step: OrderStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    const currentIndex = statusSequence.indexOf(currentStatus);
    const stepIndex = statusSequence.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  const displayOrder = searchedOrder || (orders.length > 0 ? orders[0] : null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          Track Your Produce Delivery
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Enter your Order Number (e.g. <strong>{orders[0]?.orderNo || 'AV-2026-9041'}</strong>) or contact phone to check dawn packing and dispatch status.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. AV-2026-9041 or phone number..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-xs font-bold text-stone-900 shadow-xs focus:outline-none focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            Track
          </button>
        </form>
      </div>

      {/* No Order Found */}
      {hasSearched && !searchedOrder && (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-3 max-w-md mx-auto shadow-xs">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="font-bold text-stone-900">No order matches that query</h3>
          <p className="text-xs text-stone-500">
            Please check the Order ID format in your SMS/WhatsApp receipt or search with the phone number used during checkout.
          </p>
        </div>
      )}

      {/* Order Details View */}
      {displayOrder && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
          {/* Top Order Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  Status: {displayOrder.status}
                </span>
                <span className="text-xs text-stone-400">
                  Placed {displayOrder.createdAt ? new Date(displayOrder.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-stone-900 mt-1">
                Order #{displayOrder.orderNo}
              </h2>
              <p className="text-xs text-stone-500">
                Recipient: <strong>{displayOrder.customerName}</strong> • {displayOrder.customerPhone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={buildWhatsAppUrl(
                  settings.whatsappNumber,
                  `Hello Adam Vegetables! I am checking on my delivery for Order #${displayOrder.orderNo}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950" />
                <span>WhatsApp Driver</span>
              </a>
              <button
                onClick={() => handleReorder(displayOrder)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reorder Items</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Delivery Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { status: 'Pending' as OrderStatus, label: 'Received', icon: Clock },
                { status: 'Confirmed' as OrderStatus, label: 'Confirmed', icon: CheckCircle2 },
                { status: 'Preparing' as OrderStatus, label: 'Cold-Packed', icon: Package },
                { status: 'Out for Delivery' as OrderStatus, label: 'Out for Run', icon: Truck },
                { status: 'Delivered' as OrderStatus, label: 'Delivered', icon: ShieldCheck },
              ].map((step, idx) => {
                const stepState = getStepStatus(displayOrder.status, step.status);
                const Icon = step.icon;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                      stepState === 'completed'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : stepState === 'active'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-200'
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto ${stepState === 'active' ? 'text-white' : ''}`} />
                    <p className="text-[11px] font-black">{step.label}</p>
                    <p className="text-[10px] opacity-80">
                      {stepState === 'completed' ? 'Done' : stepState === 'active' ? 'Current' : 'Waiting'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Notes */}
          {displayOrder.statusTimeline && displayOrder.statusTimeline.length > 0 && (
            <div className="p-4 rounded-2xl bg-stone-50 space-y-2 border border-stone-100">
              <h4 className="text-xs font-bold text-stone-700">Dispatch Audit Log:</h4>
              <div className="space-y-1.5 text-xs text-stone-600">
                {displayOrder.statusTimeline.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2">
                    <span className="font-bold text-stone-800">{item.status}: {item.note || 'Status updated'}</span>
                    <span className="text-[10px] text-stone-400 whitespace-nowrap">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destination & Slot Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 space-y-1">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Drop Location</span>
              <p className="font-bold text-stone-900">{displayOrder.deliveryAddress}</p>
              {displayOrder.notes && (
                <p className="text-[11px] text-stone-500 italic">Notes: "{displayOrder.notes}"</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 space-y-1">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Scheduled Slot</span>
              <p className="font-bold text-stone-900">{displayOrder.deliverySlot}</p>
              <p className="text-[11px] text-stone-500">Date: {displayOrder.preferredDeliveryDate}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Order Items ({displayOrder.items.length})
            </h4>
            <div className="divide-y divide-stone-100 text-xs">
              {displayOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-stone-900">{item.productName}</p>
                      <p className="text-[10px] text-stone-500">
                        {item.quantity} {item.unit} × {settings.currencySymbol}{item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    {settings.currencySymbol}{item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between font-black text-sm text-stone-900">
              <span>Total Paid / Due on Delivery:</span>
              <span>{settings.currencySymbol}{displayOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
