import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  Clock,
  Menu,
  X,
  Truck,
  FileSpreadsheet,
  Building2,
  Sparkles,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    activePage,
    navigateTo,
    cartCount,
    cartTotal,
    favorites,
    settings,
    searchQuery,
    setSearchQuery,
    language,
    setLanguage,
    customer,
    currentAdmin,
    deliveryZones,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop Produce', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    {
      label: "Today's Prices",
      page: 'todays-prices',
      highlight: true,
      badge: 'Live',
    },
    { label: 'Wholesale Hub', page: 'wholesale' },
    { label: 'Quick Bulk Order', page: 'wholesale-quick-order' },
    { label: 'Track Order', page: 'track-order' },
    { label: 'Contact & Map', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-stone-200">
      {/* Top Notice Bar */}
      {settings.announcementActive && (
        <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-700 text-emerald-100 uppercase tracking-wider">
                Daily Rates
              </span>
              <span className="font-medium text-emerald-50 text-xs sm:text-sm">
                {settings.announcementText}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-emerald-200 ml-auto">
              <div className="hidden md:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>Rates: {settings.lastMarketPriceUpdateTimestamp}</span>
              </div>
              <a
                href={`tel:${settings.phone}`}
                className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                <span>{settings.phone}</span>
              </a>
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="hover:text-white px-2 py-0.5 rounded border border-emerald-700/60 text-xs font-semibold uppercase tracking-wider transition-colors"
                title="Toggle English / Arabic"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              {/* Quick Admin shortcut */}
              <button
                onClick={() => navigateTo(currentAdmin ? 'admin-dashboard' : 'admin-login')}
                className="text-[11px] text-emerald-300 hover:text-emerald-100 underline decoration-emerald-500/60 underline-offset-2 flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                {currentAdmin ? 'Admin Panel' : 'Staff Login'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Adam Vegetables Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tight">AV</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {settings.shopName}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Wholesale & Retail
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium tracking-tight">
                {settings.tagline}
              </p>
            </div>
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search tomatoes, onions, spinach, carrots, avocado..."
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* User & Order Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Delivery zone badge */}
            <button
              onClick={() => navigateTo('delivery')}
              className="hidden xl:flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors border border-stone-200"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">Delivery: Free over {settings.currencySymbol}{settings.retailFreeDeliveryThreshold}</span>
            </button>

            {/* Wholesale Portal Quick Link */}
            <button
              onClick={() => navigateTo('wholesale')}
              className="hidden lg:flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>B2B Portal</span>
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => navigateTo('favorites')}
              className="relative p-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-full transition-colors"
              title="Saved Produce / Wishlist"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={() => navigateTo('account')}
              className="p-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-1"
              title={customer ? `Signed in as ${customer.name}` : 'Customer Account'}
            >
              <User className="w-5 h-5" />
              {customer && (
                <span className="hidden sm:inline text-xs font-semibold text-stone-800 max-w-[80px] truncate">
                  {customer.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigateTo('cart')}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl font-medium shadow-xs hover:shadow-md transition-all active:scale-95"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-emerald-800">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-sm">
                {settings.currencySymbol}{cartTotal.toFixed(2)}
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce (e.g., onions, tomatoes)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-stone-100 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
          </form>
        </div>
      </div>

      {/* Desktop Navigation Links Bar */}
      <nav className="hidden md:block bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 lg:space-x-2 py-1.5 overflow-x-auto scrollbar-none">
              {navLinks.map((link) => {
                const isActive = activePage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => navigateTo(link.page)}
                    className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : link.highlight
                        ? 'text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200'
                        : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/60'
                    }`}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-stone-900 rounded font-black uppercase">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-600">
              <button
                onClick={() => navigateTo('wholesale-quick-order')}
                className="hidden lg:flex items-center gap-1.5 font-semibold text-emerald-800 hover:underline"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wholesale Quick-Order Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-200">
            <button
              onClick={() => {
                navigateTo('wholesale');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex flex-col items-center gap-1 text-center"
            >
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Wholesale Portal</span>
            </button>
            <button
              onClick={() => {
                navigateTo('todays-prices');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex flex-col items-center gap-1 text-center"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Today's Prices</span>
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  navigateTo(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                  activePage === link.page
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-400 text-stone-900 font-bold rounded">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-2 border-t border-stone-200 space-y-1">
              <button
                onClick={() => {
                  navigateTo('faq');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Frequently Asked Questions (FAQ)
              </button>
              <button
                onClick={() => {
                  navigateTo('delivery');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Delivery Zones & Guidelines
              </button>
              <button
                onClick={() => {
                  navigateTo(currentAdmin ? 'admin-dashboard' : 'admin-login');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg"
              >
                {currentAdmin ? '⚙️ Open Admin Dashboard' : '🔒 Store Staff / Admin Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
