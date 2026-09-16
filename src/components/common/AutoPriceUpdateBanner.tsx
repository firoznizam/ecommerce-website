import React, { useState } from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AutoPriceUpdateBanner: React.FC = () => {
  const {
    autoPriceNotice,
    dismissAutoPriceNotice,
    triggerAutoDailyPriceUpdate,
    availableMandiHubs,
    settings,
    navigateTo,
  } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedHub, setSelectedHub] = useState(settings.activeMandiHub || 'Aluva Central Mandi Yard');
  const [marketCondition, setMarketCondition] = useState<'normal' | 'volatile' | 'surplus'>('normal');

  const handleManualTrigger = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      triggerAutoDailyPriceUpdate({
        sourceHub: selectedHub,
        intensity: marketCondition,
        showToast: true,
      });
      setIsRefreshing(false);
      setShowOptions(false);
    }, 600);
  };

  return (
    <>
      {/* Real-time Daily Price Update Toast Notification */}
      {autoPriceNotice && autoPriceNotice.visible && (
        <aside
          aria-label="Daily Market Rate Update Notification"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-stone-900/95 backdrop-blur-md text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 text-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Daily Market Price Updated
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {autoPriceNotice.timestamp}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                {autoPriceNotice.headline}
              </h4>

              <div className="flex items-center gap-3 pt-1 text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {autoPriceNotice.droppedCount} Price Drops
                </span>
                {autoPriceNotice.increasedCount > 0 && (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {autoPriceNotice.increasedCount} Price Rises
                  </span>
                )}
                <span className="text-stone-400 hidden sm:inline">• {autoPriceNotice.mandiSource.split(' ')[0]} Hub</span>
              </div>
            </div>

            <button
              onClick={dismissAutoPriceNotice}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between gap-2 text-xs">
            <button
              onClick={() => {
                dismissAutoPriceNotice();
                navigateTo('todays-prices');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline cursor-pointer text-[11px]"
            >
              <span>View Today's Rate Sheet</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setShowOptions(!showOptions)}
              className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sliders className="w-3 h-3 text-emerald-400" />
              <span>Rate Controls</span>
            </button>
          </div>
        </aside>
      )}

      {/* Floating Rate Calibration Trigger & Modal (Quick Access) */}
      {showOptions && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-sm">
                    Kerala Daily Wholesale Pricing Engine
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Automated dawn market calibration & rate benchmark
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOptions(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1 text-[11px]">
                  Primary Kerala Wholesale Hub Source:
                </label>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {availableMandiHubs.map((hub) => (
                    <option key={hub.mandiHub} value={hub.mandiHub}>
                      {hub.mandiHub} ({hub.district}) — {hub.sentiment}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 text-[11px]">
                  Market Arrival Volume:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMarketCondition('surplus')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                      marketCondition === 'surplus'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🌱 Surplus (Drops)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketCondition('normal')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                      marketCondition === 'normal'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    ⚖️ Balanced Market
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketCondition('volatile')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                      marketCondition === 'volatile'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🌧️ Monsoon Fluctuations
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1 text-[11px] text-stone-700">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automatic Background System</span>
                </div>
                <p>
                  The system automatically checks and synchronizes market rates every morning at dawn (05:30 AM IST) and whenever the day changes.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowOptions(false)}
                className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleManualTrigger}
                disabled={isRefreshing}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Recalibrating Market...' : 'Update Daily Prices Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
