import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  ShoppingCart,
  MessageCircle,
  Sparkles,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { getBulkQuickOrderWhatsAppUrl } from '../utils/whatsapp';

export const WholesaleQuickOrderPage: React.FC = () => {
  const { products, categories, settings, addToCart, navigateTo, customer, smartReorderItems } = useStore();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  // Filter products
  const displayProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.altNames?.some((a) => a.toLowerCase().includes(q));
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleQtyChange = (id: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, val),
    }));
  };

  // Calculate totals for selected items
  const selectedSummary = useMemo(() => {
    let totalItems = 0;
    let totalUnits = 0;
    let totalEstimatedAmount = 0;
    const selectedList: { product: Product; quantity: number }[] = [];

    products.forEach((p) => {
      const qty = quantities[p.id] || 0;
      if (qty > 0) {
        totalItems += 1;
        totalUnits += qty;
        const rate = qty >= p.minWholesaleQty ? p.wholesalePrice : p.retailPrice;
        totalEstimatedAmount += qty * rate;
        selectedList.push({ product: p, quantity: qty });
      }
    });

    return { totalItems, totalUnits, totalEstimatedAmount, selectedList };
  }, [products, quantities]);

  const handleAddAllToCart = () => {
    if (selectedSummary.selectedList.length === 0) return;

    selectedSummary.selectedList.forEach((item) => {
      addToCart(item.product, item.quantity);
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleSendViaWhatsApp = () => {
    if (selectedSummary.selectedList.length === 0) return;
    const url = getBulkQuickOrderWhatsAppUrl(
      selectedSummary.selectedList,
      customer?.companyName || customer?.name || 'Commercial Client',
      settings
    );
    window.open(url, '_blank');
  };

  const handleReset = () => {
    setQuantities({});
  };

  // Pre-fill with typical kitchen bundle
  const handleLoadTemplate = () => {
    const template: Record<string, number> = {};
    products.forEach((p) => {
      if (p.slug.includes('onion')) template[p.id] = 20;
      if (p.slug.includes('tomato')) template[p.id] = 20;
      if (p.slug.includes('potato')) template[p.id] = 30;
      if (p.slug.includes('spinach')) template[p.id] = 15;
      if (p.slug.includes('ginger')) template[p.id] = 5;
      if (p.slug.includes('garlic')) template[p.id] = 10;
    });
    setQuantities(template);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Commercial Rapid Order Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Wholesale Quick Order Sheet
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
              Designed for chefs, purchasing managers, and grocery store stockists. Rapidly key in bulk quantities for multiple items and submit directly to cart or WhatsApp in a single click.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLoadTemplate}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
            >
              Load Standard Bistro Template
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Quantities</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search produce..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Items
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.name
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rapid Bulk Grid Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-700 font-extrabold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Item & Department</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4">Retail Rate</th>
                <th className="py-3.5 px-4">Wholesale Rate</th>
                <th className="py-3.5 px-4">Wholesale Min</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4 w-40 text-center">Order Quantity</th>
                <th className="py-3.5 px-4 text-right">Line Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayProducts.map((product) => {
                const qty = quantities[product.id] || 0;
                const isWholesale = qty >= product.minWholesaleQty;
                const appliedRate = isWholesale ? product.wholesalePrice : product.retailPrice;
                const lineTotal = qty * appliedRate;

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${qty > 0 ? 'bg-emerald-50/60' : 'hover:bg-stone-50'}`}
                  >
                    {/* Item name & thumb */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-xs">{product.name}</p>
                          <span className="text-[10px] text-stone-500">{product.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-700">{product.unit}</td>

                    <td className="py-3 px-4 text-stone-600">
                      {settings.currencySymbol}{product.retailPrice.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-800">
                        {settings.currencySymbol}{product.wholesalePrice.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-500">
                      {product.minWholesaleQty} {product.unit}s
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold ${product.stock < 20 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>

                    {/* Numeric Input */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          min="0"
                          max={product.stock}
                          value={qty === 0 ? '' : qty}
                          onChange={(e) => handleQtyChange(product.id, Number(e.target.value))}
                          placeholder="0"
                          className="w-24 text-center py-2 px-2 border border-stone-300 rounded-xl font-black text-sm text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-white"
                        />
                      </div>
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-4 text-right font-black text-stone-900">
                      {qty > 0 ? (
                        <div>
                          <p className="text-sm">
                            {settings.currencySymbol}{lineTotal.toFixed(2)}
                          </p>
                          {isWholesale && (
                            <span className="text-[10px] text-emerald-700 font-bold">
                              Wholesale Rate
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Summary & Sticky Checkout Bar */}
      <div className="sticky bottom-16 md:bottom-4 z-30 bg-stone-950 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-stone-800 animate-in slide-in-from-bottom-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-stone-400 text-[11px]">Selected Products</p>
              <p className="font-extrabold text-white text-base">
                {selectedSummary.totalItems} items ({selectedSummary.totalUnits} total units)
              </p>
            </div>
            <div className="h-8 w-px bg-stone-800"></div>
            <div>
              <p className="text-stone-400 text-[11px]">Estimated Crate Total</p>
              <p className="text-xl font-black text-emerald-400">
                {settings.currencySymbol}{selectedSummary.totalEstimatedAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSendViaWhatsApp}
              disabled={selectedSummary.selectedList.length === 0}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>Send Wholesale Quote via WhatsApp</span>
            </button>

            <button
              onClick={handleAddAllToCart}
              disabled={selectedSummary.selectedList.length === 0}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add All to Cart</span>
            </button>
          </div>
        </div>

        {addedNotice && (
          <div className="mt-3 p-2 bg-emerald-900/90 text-emerald-200 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Added {selectedSummary.totalItems} produce items to cart!</span>
            <button
              onClick={() => navigateTo('cart')}
              className="underline font-black text-white ml-2"
            >
              Go to Cart →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
