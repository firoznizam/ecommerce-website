import React, { useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Building2,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingDown,
  FileSpreadsheet,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { getGeneralEnquiryWhatsAppUrl, buildWhatsAppUrl } from '../utils/whatsapp';
import { DeliveryZoneCheckerModal } from '../components/common/DeliveryZoneCheckerModal';

export const HomePage: React.FC = () => {
  const { products, categories, settings, navigateTo } = useStore();
  const [showZoneChecker, setShowZoneChecker] = useState(false);

  // Fresh picks: featured products
  const freshPicks = products.filter((p) => p.isFeatured && p.active).slice(0, 8);
  // Leafy / seasonal picks
  const seasonalPicks = products.filter((p) => (p.isSeasonal || p.category === 'Leafy Greens & Cheera' || p.category === 'Leafy Vegetables') && p.active).slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-radial from-emerald-900 via-stone-900 to-stone-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Daily Market Price Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Market Rates Updated: {settings.lastMarketPriceUpdateTimestamp}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Fresh Vegetables. <br />
                <span className="text-emerald-400">Fair Prices.</span> Delivered.
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
                Direct from regional farm auctions to household kitchens, restaurants, and grocers.
                Transparent morning wholesale pricing, crisp harvest selection, and fast same-day delivery.
              </p>

              {/* 3 Prominent CTAs: Shop Retail, Wholesale Orders, WhatsApp */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-900/40 hover:scale-102 transition-all flex items-center gap-2 active:scale-98"
                >
                  <span>Shop Retail Produce</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('wholesale')}
                  className="px-6 py-3.5 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-white font-bold text-sm sm:text-base border border-stone-700 transition-all flex items-center gap-2 hover:scale-102 active:scale-98"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Wholesale / B2B</span>
                </button>

                <a
                  href={getGeneralEnquiryWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-extrabold text-sm sm:text-base transition-all flex items-center gap-2 shadow-lg hover:scale-102 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-stone-950" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800 text-xs text-stone-300">
                <div>
                  <p className="text-lg sm:text-xl font-black text-white">4:30 AM</p>
                  <p className="text-stone-400 text-[11px] mt-0.5">Daily Harvest Grading</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-emerald-400">Zero</p>
                  <p className="text-stone-400 text-[11px] mt-0.5">Artificial Middleman Markups</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-white">100%</p>
                  <p className="text-stone-400 text-[11px] mt-0.5">Freshness Guarantee</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card: Daily Market Highlights */}
            <div className="lg:col-span-5">
              <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center font-bold">
                      AV
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Today's Market Rates</h3>
                      <p className="text-[11px] text-emerald-400">Verified wholesale rates</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('todays-prices')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <span>Full Rate Sheet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Micro rate preview list */}
                <div className="divide-y divide-stone-800/80 my-3">
                  {products.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigateTo('product-detail', { productId: item.id })}
                      className="py-2.5 flex items-center justify-between hover:bg-stone-800/40 px-2 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-stone-400">
                            Wholesale: {settings.currencySymbol}{item.wholesalePrice.toFixed(2)}/{item.unit} ({item.minWholesaleQty}+ {item.unit})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-400">
                          {settings.currencySymbol}{item.retailPrice.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-stone-400">per {item.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">Commercial restaurant buyer?</span>
                  <button
                    onClick={() => navigateTo('wholesale-quick-order')}
                    className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Quick Crate Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Produce Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Browse by Category
            </h2>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateTo('shop', { categorySlug: cat.slug })}
              className="group relative flex flex-col items-center p-3 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-2.5 bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-stone-800 group-hover:text-emerald-800 line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-stone-400 mt-0.5">Explore {cat.itemCount || '6+'} items</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Today's Fresh Picks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Dawn Auction Selection
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold">
                Fresh Arrivals
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Today's Fresh Picks
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm transition-colors self-start sm:self-auto"
          >
            Explore Complete Catalog →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {freshPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Wholesale Supply Banner & Quick Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              Commercial B2B Supply
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Supplying Restaurants, Hotels, Caterers & Grocery Stores
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Never worry about kitchen stock shortages or erratic vegetable pricing. Adam Vegetables provides early morning refrigerated delivery, custom tiered crate discounts, and consolidated monthly invoicing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="bg-emerald-950/40 backdrop-blur-xs p-3.5 rounded-xl border border-emerald-700/40">
                <p className="font-extrabold text-amber-300 text-sm">Tiered Bulk Rates</p>
                <p className="text-emerald-200 text-[11px] mt-1">Automatic discounts on 10kg, 25kg and 50kg+ crates.</p>
              </div>
              <div className="bg-emerald-950/40 backdrop-blur-xs p-3.5 rounded-xl border border-emerald-700/40">
                <p className="font-extrabold text-amber-300 text-sm">04:30 AM Dispatch</p>
                <p className="text-emerald-200 text-[11px] mt-1">Delivered to kitchen back doors before chef prep begins.</p>
              </div>
              <div className="bg-emerald-950/40 backdrop-blur-xs p-3.5 rounded-xl border border-emerald-700/40">
                <p className="font-extrabold text-amber-300 text-sm">Quick WhatsApp Quotes</p>
                <p className="text-emerald-200 text-[11px] mt-1">Direct contact with wholesale auction dispatch manager.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => navigateTo('wholesale')}
                className="px-5 py-3 rounded-xl bg-white text-emerald-950 font-black text-sm hover:bg-emerald-50 transition-all"
              >
                Learn About Wholesale Accounts
              </button>
              <button
                onClick={() => navigateTo('wholesale-quick-order')}
                className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm transition-all"
              >
                Launch Multi-Item Quick Order Grid
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Adam Vegetables */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Our Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Why Food Businesses & Families Trust Adam Vegetables
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">Same-Day Harvest to Door</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We cut down transit time from farm fields to under 12 hours. Leafy greens remain crisp with active moisture retention and clean root trimming.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">Transparent Market Rates</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our prices reflect honest market wholesale dynamics. When market arrivals surge, our prices drop instantly so you enjoy real cost savings.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">One-Tap WhatsApp Ordering</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Prefer speaking with a human? Send your vegetable list or photo directly to our WhatsApp desk. We calculate totals and confirm immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 6. How It Works (Browse -> Choose Qty -> Checkout / WhatsApp -> Delivery) */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Simple Purchasing Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              How Ordering Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 text-center relative">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center mx-auto mb-3">
                1
              </span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Browse Catalog</h4>
              <p className="text-xs text-stone-500">Explore fresh daily vegetables with transparent retail & wholesale prices.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 text-center relative">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center mx-auto mb-3">
                2
              </span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Select Quantities</h4>
              <p className="text-xs text-stone-500">Choose in kg, 500g, bunches, boxes or crates. Wholesale tiers trigger automatically.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 text-center relative">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center mx-auto mb-3">
                3
              </span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Checkout or WhatsApp</h4>
              <p className="text-xs text-stone-500">Place online with Cash on Delivery / Pickup, or push order directly to WhatsApp.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 text-center relative">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center mx-auto mb-3">
                4
              </span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Pack & Confirmation</h4>
              <p className="text-xs text-stone-500">Produce is hand-graded, weighed, sealed, and assigned an order tracking code.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 text-center relative">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center mx-auto mb-3">
                5
              </span>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Doorstep Delivery</h4>
              <p className="text-xs text-stone-500">Arrives in temperature-regulated vehicle at your requested time slot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Real Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Loved by Chefs & Home Cooks Alike
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
              "We run a 120-seat Mediterranean bistro. Adam Vegetables' wholesale delivery at 5:00 AM has eliminated all our morning rush panic. The vine tomatoes and fresh spinach are always top tier."
            </p>
            <div>
              <p className="font-bold text-stone-900 text-xs">Chef Marcus Vance</p>
              <p className="text-[11px] text-stone-500">Head Chef, Bistro Laurent</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
              "Being able to see daily price changes right on the website before ordering makes grocery budgeting so easy. Plus their WhatsApp ordering is instantaneous."
            </p>
            <div>
              <p className="font-bold text-stone-900 text-xs">Priya Ramanathan</p>
              <p className="text-[11px] text-stone-500">Retail Customer, River West</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
              "Their 50kg wholesale sacks of red onions and cooking potatoes are graded exceptionally well. Minimal waste, clean dry skins, and fair prices."
            </p>
            <div>
              <p className="font-bold text-stone-900 text-xs">Ahmad Al-Hassan</p>
              <p className="text-[11px] text-stone-500">Owner, Metro Corner Grocery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Shop Location Preview with Google Maps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-10 overflow-hidden relative border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                Visit Our Physical Market
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Adam Vegetables Physical Depot & Wholesale Stalls
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Come hand-inspect our produce bins or pick up your pre-packed online crates directly from our terminal bays.
              </p>

              <div className="space-y-2 text-xs text-stone-300 pt-2">
                <p>📍 <strong>Address:</strong> {settings.address}</p>
                <p>⏰ <strong>Depot Hours:</strong> {settings.openingHours}</p>
                <p>🚚 <strong>Wholesale Dispatch:</strong> {settings.wholesaleOperatingHours}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Driving Directions</span>
                </a>
                <button
                  onClick={() => setShowZoneChecker(true)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Check Your Delivery Zone</span>
                </button>
              </div>
            </div>

            {/* Map visual mockup preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-stone-800 border border-stone-700 shadow-inner">
                {/* Styled map graphic */}
                <div className="w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-lg animate-bounce">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-white text-base">{settings.shopName} Terminal</h4>
                  <p className="text-xs text-stone-300 mt-1 max-w-xs">{settings.address}</p>
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-4 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition-colors"
                  >
                    Open Live in Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Got Questions?
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-white border border-stone-200">
            <h4 className="font-bold text-stone-900 mb-1">When are prices updated on the website?</h4>
            <p className="text-stone-600">
              Our produce team updates prices every morning between 05:00 AM and 06:00 AM following the regional morning wholesale market arrivals. You can always check the "Price Updated Today" badge on any product.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-stone-200">
            <h4 className="font-bold text-stone-900 mb-1">How does wholesale crate pricing work?</h4>
            <p className="text-stone-600">
              Whenever you add products meeting the minimum wholesale threshold (typically 10kg or a full crate), the price automatically discounts to the wholesale tier. Restaurants can also apply for verified business invoicing.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-stone-200">
            <h4 className="font-bold text-stone-900 mb-1">Can I order directly through WhatsApp?</h4>
            <p className="text-stone-600">
              Yes! You can use our floating WhatsApp button to send a custom message or build a cart and click "Order via WhatsApp", which formats your entire produce order into a ready-to-send text.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigateTo('faq')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Read All Customer & Wholesale FAQs →
          </button>
        </div>
      </section>

      {/* Zone Checker Modal */}
      <DeliveryZoneCheckerModal
        isOpen={showZoneChecker}
        onClose={() => setShowZoneChecker(false)}
      />
    </div>
  );
};
