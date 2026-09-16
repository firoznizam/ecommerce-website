import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  TrendingDown,
  TrendingUp,
  Download,
  Share2,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const TodaysPricesPage: React.FC = () => {
  const {
    products,
    categories,
    settings,
    navigateTo,
    addToCart,
    triggerAutoDailyPriceUpdate,
    availableMandiHubs,
  } = useStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceTypeFilter, setPriceTypeFilter] = useState<'all' | 'dropped' | 'increased'>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchAlt = p.altNames?.some((a) => a.toLowerCase().includes(q));
        if (!matchName && !matchAlt) return false;
      }
      if (priceTypeFilter === 'dropped' && p.priceChangeDirection !== 'down') return false;
      if (priceTypeFilter === 'increased' && p.priceChangeDirection !== 'up') return false;
      return true;
    });
  }, [products, selectedCategory, query, priceTypeFilter]);

  const handleCopyRates = () => {
    const text = `🥬 *${settings.shopName} — Today's Produce Rates (${settings.lastMarketPriceUpdateTimestamp})*\n` +
      filteredProducts
        .map(
          (p) =>
            `• ${p.name}: ${settings.currencySymbol}${p.retailPrice.toFixed(2)}/${p.unit} | Wholesale: ${settings.currencySymbol}${p.wholesalePrice.toFixed(2)}/${p.unit} (Min ${p.minWholesaleQty}${p.unit})`
        )
        .join('\n') +
      `\n\nOrder online or reply to order directly!`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const text = `Hello ${settings.shopName}! 📄\nI am viewing your Today's Price Sheet for ${settings.lastMarketPriceUpdateTimestamp}.\nCould you please confirm the crate availability for today?`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Market Rates • Updated {settings.lastMarketPriceUpdateTimestamp}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Today's Vegetable & Fruit Rates
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Official transparent morning auction rates for household buyers, restaurants, and catering services.
              All prices are benchmarked daily at dawn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setIsSyncing(true);
                setTimeout(() => {
                  const res = triggerAutoDailyPriceUpdate({ showToast: false });
                  setSyncNotice(`✓ Fresh Market Rates Applied! ${res.summary.droppedCount} items dropped today at ${res.summary.mandiSource.split(' ')[0]}.`);
                  setIsSyncing(false);
                  setTimeout(() => setSyncNotice(null), 5000);
                }, 500);
              }}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              title="Recalibrate live prices against morning Kerala market arrivals feed"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Rates...' : 'Auto-Sync Market Prices'}</span>
            </button>
            <button
              onClick={handleCopyRates}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Rate Sheet'}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>Ask on WhatsApp</span>
            </button>
          </div>
        </div>

        {syncNotice && (
          <div className="mt-4 p-3 bg-emerald-800/90 border border-emerald-500/50 rounded-2xl flex items-center justify-between text-xs text-white animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{syncNotice}</span>
            </div>
            <button
              onClick={() => setSyncNotice(null)}
              className="text-emerald-200 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vegetable or alternative names (e.g., Alu, Onion, Tamatar)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Select */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Departments ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trend filter */}
          <div className="md:col-span-3">
            <select
              value={priceTypeFilter}
              onChange={(e) => setPriceTypeFilter(e.target.value as any)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Trends</option>
              <option value="dropped">📉 Only Price Drops Today</option>
              <option value="increased">📈 Rate Increases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rates Table / Grid */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Produce Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4">Retail Rate</th>
                <th className="py-3.5 px-4">Wholesale Rate</th>
                <th className="py-3.5 px-4">Daily Trend</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const hasZeroPrice = p.retailPrice <= 0;
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-emerald-50/40 transition-colors cursor-pointer"
                    onClick={() => navigateTo('product-detail', { productId: p.id })}
                  >
                    {/* Produce name & thumb */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 hover:text-emerald-800">
                            {p.name}
                          </p>
                          {p.malayalamName && (
                            <p className="text-[11px] font-bold text-emerald-700">
                              {p.malayalamName}
                            </p>
                          )}
                          {p.altNames && p.altNames.length > 0 && (
                            <p className="text-[10px] text-stone-400">
                              {p.altNames.slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-600 font-medium">{p.category}</td>

                    <td className="py-3 px-4 text-stone-700 font-bold">{p.unit}</td>

                    {/* Retail rate */}
                    <td className="py-3 px-4">
                      {hasZeroPrice ? (
                        <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                          Contact for price
                        </span>
                      ) : (
                        <div>
                          <span className="font-black text-stone-900 text-sm">
                            {settings.currencySymbol}{p.retailPrice.toFixed(2)}
                          </span>
                          {p.previousRetailPrice && p.previousRetailPrice !== p.retailPrice && (
                            <span className="text-[10px] text-stone-400 line-through ml-1.5">
                              {settings.currencySymbol}{p.previousRetailPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Wholesale rate */}
                    <td className="py-3 px-4">
                      {p.wholesalePrice > 0 ? (
                        <div>
                          <span className="font-black text-emerald-800 text-sm">
                            {settings.currencySymbol}{p.wholesalePrice.toFixed(2)}
                          </span>
                          <p className="text-[10px] text-stone-500">
                            Min {p.minWholesaleQty} {p.unit}s
                          </p>
                        </div>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>

                    {/* Daily trend */}
                    <td className="py-3 px-4">
                      {p.priceChangeDirection === 'down' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                          <TrendingDown className="w-3 h-3" />
                          Rate Dropped
                        </span>
                      ) : p.priceChangeDirection === 'up' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-black bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                          <TrendingUp className="w-3 h-3" />
                          Rate Up
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px] font-medium">Unchanged</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {p.stock <= 0 ? (
                        <span className="text-rose-600 font-bold">Out of stock</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </td>

                    {/* Quick Order button */}
                    <td className="py-3 px-4 text-right">
                      {hasZeroPrice ? (
                        <a
                          href={buildWhatsAppUrl(settings.whatsappNumber, `Hello, what is today's rate for ${p.name}?`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold hover:bg-emerald-200"
                        >
                          Enquire
                        </a>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p, 1);
                          }}
                          disabled={p.stock <= 0}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          Add 1 {p.unit}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandi Transparency Notice */}
      <div className="p-6 rounded-3xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-2">
        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>Our Daily Pricing Policy</span>
        </h4>
        <p>
          Unlike conventional supermarkets that keep fixed inflated margins, Adam Vegetables operates with daily auction-linked pricing.
          Our prices are calibrated every morning at 05:30 AM based on regional harvest arrivals. If you are ordering in wholesale volumes (100kg+ or 10+ crates), please launch the <strong>Wholesale Quick Order sheet</strong> or contact our dispatch team via WhatsApp.
        </p>
      </div>
    </div>
  );
};
