import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  ShoppingBag,
  Building2,
  Settings,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  MessageCircle,
  Printer,
  ChevronRight,
  TrendingDown,
  RotateCcw,
  SlidersHorizontal,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, WholesaleInquiry } from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    wholesaleInquiries,
    settings,
    updateProduct,
    addProduct,
    deleteProduct,
    updateDailyPrices,
    triggerAutoDailyPriceUpdate,
    availableMandiHubs,
    updateOrderStatus,
    updateWholesaleInquiryStatus,
    updateSettings,
    priceHistory,
    navigateTo,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'prices' | 'orders' | 'products' | 'wholesale' | 'settings'>('prices');
  const [searchOrder, setSearchOrder] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Daily Prices Quick-Update State
  const [priceEdits, setPriceEdits] = useState<Record<string, { retail: number; wholesale: number; stock: number }>>(() => {
    const map: Record<string, { retail: number; wholesale: number; stock: number }> = {};
    products.forEach((p) => {
      map[p.id] = { retail: p.retailPrice, wholesale: p.wholesalePrice, stock: p.stock };
    });
    return map;
  });
  const [priceSaveNotice, setPriceSaveNotice] = useState(false);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: categories[0]?.name || 'Root Vegetables',
    unit: 'kg',
    retailPrice: 5.0,
    wholesalePrice: 4.0,
    minWholesaleQty: 10,
    stock: 50,
    lowStockThreshold: 10,
    images: ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=800'],
    active: true,
  });

  // Settings edit state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [autoSyncSummary, setAutoSyncSummary] = useState<string | null>(null);

  // Sync edits state when products change
  const syncEditsFromProducts = (currentProds: Product[]) => {
    const map: Record<string, { retail: number; wholesale: number; stock: number }> = {};
    currentProds.forEach((p) => {
      map[p.id] = { retail: p.retailPrice, wholesale: p.wholesalePrice, stock: p.stock };
    });
    setPriceEdits(map);
  };

  const handleTriggerAutoDailyPriceSync = (intensity: 'normal' | 'volatile' | 'surplus' = 'normal') => {
    setIsAutoSyncing(true);
    setTimeout(() => {
      const result = triggerAutoDailyPriceUpdate({
        sourceHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
        intensity,
        showToast: true,
      });
      syncEditsFromProducts(result.updatedProducts);
      setAutoSyncSummary(
        `✓ Mandi prices refreshed! ${result.summary.droppedCount} items dropped, ${result.summary.increasedCount} increased from ${result.summary.mandiSource}.`
      );
      setIsAutoSyncing(false);
      setTimeout(() => setAutoSyncSummary(null), 6000);
    }, 600);
  };

  // Handle price changes in quick table
  const handlePriceFieldChange = (id: string, field: 'retail' | 'wholesale' | 'stock', value: number) => {
    setPriceEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handlePublishDailyPrices = () => {
    const updates = Object.entries(priceEdits).map(([id, values]) => {
      const v = values as { retail: number; wholesale: number; stock: number };
      return {
        id,
        retailPrice: v.retail,
        wholesalePrice: v.wholesale,
      };
    });

    updateDailyPrices(updates);

    // Also update stocks
    Object.entries(priceEdits).forEach(([id, values]) => {
      const v = values as { retail: number; wholesale: number; stock: number };
      updateProduct(id, { stock: v.stock });
    });

    setPriceSaveNotice(true);
    setTimeout(() => setPriceSaveNotice(false), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    addProduct({
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      category: newProduct.category || 'Vegetables',
      arabicName: newProduct.arabicName,
      unit: newProduct.unit || 'kg',
      retailPrice: Number(newProduct.retailPrice) || 0,
      wholesalePrice: Number(newProduct.wholesalePrice) || 0,
      minWholesaleQty: Number(newProduct.minWholesaleQty) || 10,
      stock: Number(newProduct.stock) || 50,
      lowStockThreshold: Number(newProduct.lowStockThreshold) || 10,
      images: newProduct.images || ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=800'],
      origin: newProduct.origin || 'Direct Farm Partner',
      freshnessNotes: 'Harvested Today',
      description: newProduct.description,
      storageTips: newProduct.storageTips,
      active: true,
      priceUpdatedToday: true,
      lastPriceUpdate: '05:30 AM',
      priceChangeDirection: 'unchanged',
    });

    setShowAddProductModal(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase();
      return (
        o.orderNo.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Operations & Mandi Rate Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Adam Vegetables Store Manager
          </h1>
          <p className="text-xs text-stone-400">
            Current system timestamp: <strong>{settings.lastMarketPriceUpdateTimestamp}</strong> • {orders.length} total orders recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 transition-colors"
          >
            ← View Live Storefront
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prices'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Daily Price Master Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Dispatch ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wholesale')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'wholesale'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>B2B Inquiries ({wholesaleInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings & Contacts</span>
        </button>
      </div>

      {/* TAB 1: DAILY PRICE MASTER SHEET */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl font-black text-stone-900">
                  Morning Mandi Price Revision
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-xl">
                Edit prices quickly side-by-side. When ready, click "Publish Daily Rates". The system will automatically compute rate drops, tag products with "Price Updated Today", and log an audit trail.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleTriggerAutoDailyPriceSync('normal')}
                disabled={isAutoSyncing}
                className="px-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-emerald-300 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-500/30"
                title="Automatically update all prices based on live Kerala morning mandi rates"
              >
                <RefreshCw className={`w-4 h-4 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                <span>{isAutoSyncing ? 'Syncing Mandi...' : 'Auto-Update Market Prices'}</span>
              </button>

              <button
                onClick={handlePublishDailyPrices}
                className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Publish Daily Rates to Store</span>
              </button>
            </div>
          </div>

          {autoSyncSummary && (
            <div className="p-3.5 bg-emerald-900 text-emerald-100 text-xs font-bold rounded-2xl flex items-center justify-between border border-emerald-500/40 shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>{autoSyncSummary}</span>
              </div>
              <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded-full text-emerald-200">Live Updated</span>
            </div>
          )}

          {priceSaveNotice && (
            <div className="p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ All prices and stock levels published live! Timestamp updated to current session.</span>
            </div>
          )}

          {/* Quick Price Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-700 font-extrabold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Produce</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Retail Price ({settings.currencySymbol})</th>
                    <th className="py-3 px-4">Wholesale Price ({settings.currencySymbol})</th>
                    <th className="py-3 px-4">Stock Qty</th>
                    <th className="py-3 px-4">Trend Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const currentValues = priceEdits[p.id] || {
                      retail: p.retailPrice,
                      wholesale: p.wholesalePrice,
                      stock: p.stock,
                    };
                    const diff = currentValues.retail - p.retailPrice;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-4 font-bold text-stone-900 flex items-center gap-2">
                          <img src={p.images[0]} alt="" className="w-7 h-7 rounded-lg object-cover" />
                          <span>{p.name}</span>
                        </td>
                        <td className="py-2.5 px-4 text-stone-500">{p.category}</td>
                        <td className="py-2.5 px-4 font-bold text-stone-700">{p.unit}</td>

                        {/* Retail Input */}
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            step="0.05"
                            value={currentValues.retail}
                            onChange={(e) =>
                              handlePriceFieldChange(p.id, 'retail', Number(e.target.value))
                            }
                            className="w-24 p-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 bg-stone-50 focus:bg-white focus:border-emerald-600"
                          />
                        </td>

                        {/* Wholesale Input */}
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            step="0.05"
                            value={currentValues.wholesale}
                            onChange={(e) =>
                              handlePriceFieldChange(p.id, 'wholesale', Number(e.target.value))
                            }
                            className="w-24 p-1.5 border border-stone-300 rounded-lg text-xs font-bold text-emerald-800 bg-stone-50 focus:bg-white focus:border-emerald-600"
                          />
                        </td>

                        {/* Stock Input */}
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={currentValues.stock}
                            onChange={(e) =>
                              handlePriceFieldChange(p.id, 'stock', Number(e.target.value))
                            }
                            className="w-20 p-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 bg-stone-50 focus:bg-white focus:border-emerald-600"
                          />
                        </td>

                        {/* Trend preview */}
                        <td className="py-2.5 px-4">
                          {diff < 0 ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                              <TrendingDown className="w-3 h-3" /> Drops by {settings.currencySymbol}{Math.abs(diff).toFixed(2)}
                            </span>
                          ) : diff > 0 ? (
                            <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px]">
                              <TrendingUp className="w-3 h-3" /> Increases by {settings.currencySymbol}{diff.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Unchanged</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="Search by Order ID or phone..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Filter status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing / Packing</option>
                <option value="Ready">Ready</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-700 font-extrabold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Order No</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone / WhatsApp</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderNo} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-black text-stone-900">{order.orderNo}</td>
                      <td className="py-3 px-4 font-bold text-stone-800">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{order.customerPhone}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.customerType === 'wholesale' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'}`}>
                          {order.customerType.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-stone-900">
                        {settings.currencySymbol}{order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderNo, e.target.value as OrderStatus)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 font-bold text-[11px] focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing / QC</option>
                          <option value="Ready">Ready</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-stone-800 text-[11px]"
                        >
                          View Slip
                        </button>
                        <a
                          href={buildWhatsAppUrl(
                            order.customerWhatsApp || order.customerPhone,
                            `Hello ${order.customerName}! This is ${settings.shopName} regarding your produce order ${order.orderNo}. Current status: ${order.status}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#25D366] text-stone-950 rounded-lg font-black text-[11px] inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3 fill-stone-950" />
                          <span>Chat</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for Order Slip */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-lg font-black text-stone-900">
                    Order Slip #{selectedOrder.orderNo}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                  <p><strong>Destination:</strong> {selectedOrder.deliveryAddress}</p>
                  <p><strong>Slot:</strong> {selectedOrder.deliverySlot}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                </div>

                <div className="border-t border-b border-stone-100 py-3 space-y-2 text-xs">
                  <h4 className="font-bold text-stone-900">Produce Items:</h4>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity} {item.unit} × {item.productName}</span>
                      <span className="font-bold">{settings.currencySymbol}{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-black text-sm text-stone-900 border-t border-stone-100">
                    <span>Total:</span>
                    <span>{settings.currencySymbol}{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Packing Label</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRODUCTS & INVENTORY */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-stone-900">Produce Inventory Master</h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Produce Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-stone-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{p.category}</p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {settings.currencySymbol}{p.retailPrice.toFixed(2)} / {p.unit}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className={`font-bold ${p.stock < 15 ? 'text-amber-700' : 'text-stone-600'}`}>
                    Stock: {p.stock} {p.unit}
                  </span>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Product Modal */}
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateProduct}
                className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200"
              >
                <h3 className="text-lg font-black text-stone-900">Add New Fresh Produce</h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Produce Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Heirloom Organic Tomatoes"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Unit</label>
                    <select
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="500g">500 grams</option>
                      <option value="piece">Piece / Head</option>
                      <option value="bunch">Bunch</option>
                      <option value="crate">Crate (20kg)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Retail Price ({settings.currencySymbol})</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newProduct.retailPrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, retailPrice: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Wholesale Price ({settings.currencySymbol})</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newProduct.wholesalePrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, wholesalePrice: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Min Wholesale Qty</label>
                    <input
                      type="number"
                      value={newProduct.minWholesaleQty}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, minWholesaleQty: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Initial Stock Qty</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                  >
                    Save Produce
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WHOLESALE INQUIRIES */}
      {activeTab === 'wholesale' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-stone-900">Commercial Account Applications</h2>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-stone-100 text-xs">
              {wholesaleInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900 text-sm">{inq.companyName}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {inq.businessType}
                      </span>
                      {inq.status === 'Approved' && (
                        <span className="text-[10px] font-black text-emerald-700">✓ Approved</span>
                      )}
                    </div>
                    <p className="text-stone-600">
                      Contact: {inq.contactPerson} • {inq.phone} • Est: {inq.estimatedDailyVolumeKg}kg/day
                    </p>
                    {inq.notes && <p className="text-stone-400 italic">"{inq.notes}"</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    {inq.status !== 'Approved' && (
                      <button
                        onClick={() => updateWholesaleInquiryStatus(inq.id, 'Approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                      >
                        Approve Wholesale Tier
                      </button>
                    )}
                    <a
                      href={buildWhatsAppUrl(
                        inq.whatsapp || inq.phone,
                        `Hello ${inq.contactPerson}! Regarding your wholesale produce application for ${inq.companyName}...`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#25D366] text-stone-950 font-black text-xs flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 fill-stone-950" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STORE SETTINGS & PLACEHOLDERS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-black text-stone-900">
              Store Configuration & Business Placeholders
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Update phone numbers, WhatsApp numbers, depot address, and delivery thresholds.
            </p>
          </div>

          {settingsSavedNotice && (
            <div className="p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settingsForm.shopName}
                onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Primary Phone Number</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">WhatsApp Dispatch Number</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Physical Address / Depot Bay</label>
              <textarea
                rows={2}
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Notice Banner Text (Top of Storefront)</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            {/* Daily Market Price Automation Controls */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-xs sm:text-sm">
                    Automatic Daily Market Price Calibration
                  </h3>
                  <p className="text-[11px] text-stone-600">
                    Automatically adjusts vegetable retail & wholesale mandi rates each morning at dawn (05:30 AM IST).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.autoPriceUpdateEnabled ?? true}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, autoPriceUpdateEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-stone-800 text-[11px] mb-1">
                  Primary Kerala Mandi Benchmark Hub:
                </label>
                <select
                  value={settingsForm.activeMandiHub || 'Aluva Central Mandi Yard'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, activeMandiHub: e.target.value })}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-800"
                >
                  {availableMandiHubs.map((hub) => (
                    <option key={hub.mandiHub} value={hub.mandiHub}>
                      {hub.mandiHub} ({hub.district}) — {hub.auctionSession}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
            >
              Save Configuration Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
