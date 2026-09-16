import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products, navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <button onClick={() => navigateTo('home')} className="hover:text-stone-800">Home</button>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Categories</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Produce Departments</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore our complete selection of freshly harvested farm produce, daily essentials, and bulk crates.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.name).length;
          return (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', { categorySlug: cat.slug })}
              className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-16/10 w-full overflow-hidden bg-stone-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">{cat.name}</h3>
                    {cat.arabicName && (
                      <p className="text-xs text-emerald-300 font-medium">{cat.arabicName}</p>
                    )}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 shadow-xs">
                    {count} items
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {cat.description}
                </p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-700">
                  <span>Browse {cat.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
