import React, { useState } from 'react';
import { Search, MapPin, CheckCircle2, AlertCircle, X, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DeliveryZone } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectZone?: (zone: DeliveryZone) => void;
}

export const DeliveryZoneCheckerModal: React.FC<Props> = ({ isOpen, onClose, onSelectZone }) => {
  const { deliveryZones, selectedDeliveryZone, setSelectedDeliveryZone, settings } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const matchedZones = query.trim()
    ? deliveryZones.filter(
        (z) =>
          z.name.toLowerCase().includes(query.toLowerCase()) ||
          z.areas.some((a) => a.toLowerCase().includes(query.toLowerCase()))
      )
    : deliveryZones;

  const handleSelect = (zone: DeliveryZone) => {
    setSelectedDeliveryZone(zone);
    if (onSelectZone) onSelectZone(zone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">Check Delivery Coverage</h3>
            <p className="text-xs text-stone-500">
              Enter your neighborhood, district, or postcode
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearched(true);
            }}
            placeholder="Search e.g. Downtown, Old Town, 1001..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            autoFocus
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Zones list */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {matchedZones.length > 0 ? (
            matchedZones.map((zone) => {
              const isSelected = selectedDeliveryZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => handleSelect(zone)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`} />
                      <h4 className="font-bold text-sm text-stone-900">{zone.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {settings.currencySymbol}{zone.fee.toFixed(2)} delivery
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mt-1 pl-6">
                    {zone.areas.join(' • ')}
                  </p>

                  <div className="mt-2.5 pl-6 flex flex-wrap items-center gap-3 text-[11px] text-stone-600">
                    <span>
                      Free over: <strong>{settings.currencySymbol}{zone.freeDeliveryThreshold}</strong>
                    </span>
                    <span>
                      Min Retail: <strong>{settings.currencySymbol}{zone.minOrderRetail}</strong>
                    </span>
                    <span className="text-emerald-700 font-medium">
                      ⏱ {zone.estimatedDeliveryWindow}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-stone-500 text-xs">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="font-semibold text-stone-800">No direct zone match found for "{query}"</p>
              <p className="mt-1">
                We still do custom commercial dispatch! Please contact our WhatsApp dispatch desk directly.
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
