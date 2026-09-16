import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Truck,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getGeneralEnquiryWhatsAppUrl } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  const { settings, navigateTo, currentAdmin } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Dawn Harvest Freshness</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Vegetables harvested at 4 AM, graded and dispatched direct from farms daily.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Wholesale B2B Supply</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Competitive tiered crate pricing for restaurants, catering kitchens, and grocers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Same-Day Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Temperature-controlled vans with morning and evening slots across Metro zones.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Transparent Daily Rates</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                No hidden markups. Live morning market price updates every single day.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-stone-800 text-xs">
          {/* Col 1: Brand & Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-lg">
                AV
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {settings.shopName}
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Your premier direct vegetable marketplace bridging regional farmers and buyers. Supplying fresh, hand-inspected greens and produce at honest daily wholesale rates.
            </p>

            <div className="space-y-2 text-stone-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-emerald-400">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-emerald-400">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={getGeneralEnquiryWhatsAppUrl(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] text-stone-950 font-bold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950" />
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            </div>
          </div>

          {/* Col 2: Customer Storefront */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px] text-emerald-400">
              Store & Catalog
            </h5>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">
                  All Vegetables & Fruits
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('categories')} className="hover:text-white transition-colors">
                  Produce Categories
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('todays-prices')} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Today's Daily Rates</span>
                  <span className="text-[9px] bg-emerald-700 text-white px-1 rounded font-bold">New</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('favorites')} className="hover:text-white transition-colors">
                  Saved Favorites
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track-order')} className="hover:text-white transition-colors">
                  Track Delivery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Wholesale B2B Services */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px] text-emerald-400">
              Wholesale & Business
            </h5>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => navigateTo('wholesale')} className="hover:text-white transition-colors">
                  Wholesale Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wholesale-quick-order')} className="hover:text-white transition-colors">
                  Quick Multi-Item Order Grid
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('delivery')} className="hover:text-white transition-colors">
                  Delivery Zones & Slots
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  About Adam Vegetables
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Store Location & Directions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">
                  FAQs & Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Policies & Admin */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px] text-emerald-400">
              Trust & Management
            </h5>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('refund')} className="hover:text-white transition-colors">
                  Freshness & Refund Policy
                </button>
              </li>
              <li className="pt-3 border-t border-stone-800">
                <button
                  onClick={() => navigateTo(currentAdmin ? 'admin-dashboard' : 'admin-login')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentAdmin ? 'Open Admin Dashboard' : 'Staff Admin Login'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
          <p>© {new Date().getFullYear()} {settings.shopName}. All rights reserved. High Quality Local Produce.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Cash on Delivery Supported
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Store Pickup Available
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Instant WhatsApp Order
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
