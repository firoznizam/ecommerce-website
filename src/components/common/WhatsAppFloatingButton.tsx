import React, { useState } from 'react';
import { MessageCircle, X, ChevronUp, FileSpreadsheet, Truck, Sparkles, Building2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  getGeneralEnquiryWhatsAppUrl,
  getWholesaleEnquiryWhatsAppUrl,
  getOrderTrackingWhatsAppUrl,
  buildWhatsAppUrl,
} from '../../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings, navigateTo } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const priceSheetMsg = `Hello ${settings.shopName}! 📄\nPlease send me your latest updated wholesale price list and morning auction arrival catalog.`;
  const priceSheetUrl = buildWhatsAppUrl(settings.whatsappNumber, priceSheetMsg);

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end">
      {/* Contextual Quick Menu Popover */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-emerald-800 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{settings.shopName} Support</h4>
                  <p className="text-[11px] text-emerald-200">Usually replies in &lt; 5 mins</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-emerald-100 mt-2 bg-emerald-900/50 p-2 rounded-lg leading-relaxed">
              Order fresh produce, request today's mandi sheet, or get immediate wholesale quotes.
            </p>
          </div>

          {/* Context Options */}
          <div className="p-3 space-y-2 bg-stone-50 text-xs">
            <a
              href={getGeneralEnquiryWhatsAppUrl(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl transition-colors font-medium text-stone-800 group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-xs">Chat with Adam Vegetables</p>
                <p className="text-[10px] text-stone-500">General retail & delivery questions</p>
              </div>
            </a>

            <a
              href={priceSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl transition-colors font-medium text-stone-800 group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-xs">Request Daily Price Sheet</p>
                <p className="text-[10px] text-stone-500">Get updated rate list via WhatsApp</p>
              </div>
            </a>

            <a
              href={getWholesaleEnquiryWhatsAppUrl('', 'Restaurant/Business', '100', settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl transition-colors font-medium text-stone-800 group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-xs">Wholesale / B2B Supply Quote</p>
                <p className="text-[10px] text-stone-500">For restaurants, hotels & grocers</p>
              </div>
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                navigateTo('track-order');
              }}
              className="w-full flex items-center gap-2.5 p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl transition-colors font-medium text-stone-800 group text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-xs">Track Existing Order Status</p>
                <p className="text-[10px] text-stone-500">Check driver location or slot time</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button Trigger */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <span className="hidden md:inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-bold text-stone-800 border border-stone-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Order on WhatsApp
          </span>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          aria-label="Contact via WhatsApp"
        >
          {isOpen ? (
            <ChevronUp className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7 fill-white stroke-[#25D366]" />
          )}
        </button>
      </div>
    </div>
  );
};
