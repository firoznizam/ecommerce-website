import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Grid,
  List,
  Sparkles,
  Check,
  X,
  Clock,
  TrendingDown,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategorySlug,
    navigateTo,
    settings,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategorySlug || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [seasonalOnly, setSeasonalOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(2000);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync if navigation opened shop with a category
  React.useEffect(() => {
    if (activeCategorySlug) {
      const found = categories.find((c) => c.slug === activeCategorySlug);
      if (found) setSelectedCategory(found.name);
    }
  }, [activeCategorySlug, categories]);

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Active status check
      if (!p.active) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Search query (name, malayalamName, arabicName, category, alt names, origin)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchMalayalam = p.malayalamName?.toLowerCase().includes(query);
        const matchArabic = p.arabicName?.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        const matchAlt = p.altNames?.some((alt) => alt.toLowerCase().includes(query));
        const matchOrigin = p.origin?.toLowerCase().includes(query);
        if (!matchName && !matchMalayalam && !matchArabic && !matchCategory && !matchAlt && !matchOrigin) {
          return false;
        }
      }

      // In stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Seasonal
      if (seasonalOnly && !p.isSeasonal) {
        return false;
      }

      // Price threshold
      if (p.retailPrice > maxPriceFilter) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, seasonalOnly, maxPriceFilter]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.retailPrice - b.retailPrice);
      case 'price-desc':
        return list.sort((a, b) => b.retailPrice - a.retailPrice);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'biggest-drops':
        return list.sort((a, b) => {
          const dropA = (a.previousRetailPrice || a.retailPrice) - a.retailPrice;
          const dropB = (b.previousRetailPrice || b.retailPrice) - b.retailPrice;
          return dropB - dropA;
        });
      default: // featured
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header breadcrumb & title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <button onClick={() => navigateTo('home')} className="hover:text-stone-800">
            Home
          </button>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Shop Produce</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-emerald-800 font-bold">{selectedCategory}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Fresh Produce Catalog
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Showing {sortedProducts.length} verified produce items • Prices updated daily at 05:30 AM
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('todays-prices')}
              className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Today's Rate Sheet</span>
            </button>
            <button
              onClick={() => navigateTo('wholesale-quick-order')}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <span>Wholesale Bulk Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All Produce ({products.length})
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const count = products.filter((p) => p.category === cat.name).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-200 text-stone-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid with Sidebar Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Filter Sidebar for Desktop */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-6 sticky top-36">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-stone-900">Filters</h3>
              </div>
              {(selectedCategory !== 'all' || inStockOnly || seasonalOnly || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setInStockOnly(false);
                    setSeasonalOnly(false);
                    setSearchQuery('');
                    setMaxPriceFilter(100);
                  }}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Quick search inside catalog */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Keyword or Alt Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Potato, Alu, Tomato..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Stock Availability */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">Availability</label>
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seasonalOnly}
                  onChange={(e) => setSeasonalOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Seasonal / Exotic Only</span>
              </label>
            </div>

            {/* Max Retail Price Filter */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>Max Retail Price</span>
                <span className="text-emerald-800">{settings.currencySymbol}{maxPriceFilter}</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>{settings.currencySymbol}10</span>
                <span>{settings.currencySymbol}500</span>
                <span>{settings.currencySymbol}1000</span>
                <span>{settings.currencySymbol}2000</span>
              </div>
            </div>

            {/* Price Transparency Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Daily Market Price Promise</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-tight">
                All listed prices are updated daily from morning farm depot arrivals. Wholesale discounts apply automatically based on item quantity.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <main className="lg:col-span-9 space-y-4">
          {/* Top Sort and View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="biggest-drops">Biggest Price Drops Today</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 font-bold text-stone-800 flex items-center gap-1"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <span className="text-stone-400">|</span>

              {/* View Toggle */}
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-800' : 'text-stone-400 hover:text-stone-700'}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-800' : 'text-stone-400 hover:text-stone-700'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategory !== 'all' || inStockOnly || seasonalOnly || searchQuery) && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-500 font-medium mr-1">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  In Stock
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                </span>
              )}
              {seasonalOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  Seasonal
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSeasonalOnly(false)} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200 text-stone-800 rounded-full font-bold">
                  "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
            </div>
          )}

          {/* Product Items Display */}
          {sortedProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">No matching vegetables found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn't find any produce matching your filters. Try resetting the filters or check with our WhatsApp dispatch team for special unlisted crops.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setInStockOnly(false);
                  setSeasonalOnly(false);
                  setSearchQuery('');
                  setMaxPriceFilter(100);
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs hover:bg-emerald-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
