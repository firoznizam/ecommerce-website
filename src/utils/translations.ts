export type AppLanguage = 'en' | 'ml';

export interface TranslationDict {
  [key: string]: {
    en: string;
    ml: string;
  };
}

export const translations: TranslationDict = {
  // Navigation
  home: { en: 'Home', ml: 'ഹോം' },
  shopProduce: { en: 'Shop Produce', ml: 'പച്ചക്കറികൾ' },
  categories: { en: 'Categories', ml: 'വിഭാഗങ്ങൾ' },
  todaysPrices: { en: "Today's Mandi Prices", ml: 'ഇന്നത്തെ വിലനിലവാരം' },
  wholesaleHub: { en: 'Wholesale Hub (B2B)', ml: 'മൊത്തവ്യാപാര വിപണി' },
  quickBulkOrder: { en: 'Quick Bulk Order', ml: 'ക്വിക്ക് ബൾക്ക് ഓർഡർ' },
  trackOrder: { en: 'Track Order', ml: 'ഓർഡർ ട്രാക്കിംഗ്' },
  contactAndMap: { en: 'Contact & Mandi Location', ml: 'വിലാസം & റൂട്ട് മാപ്പ്' },
  staffLogin: { en: 'Staff Sign In', ml: 'ജീവനക്കാരുടെ ലോഗിൻ' },
  adminPanel: { en: 'Management Portal', ml: 'അഡ്മിൻ പാനൽ' },
  cart: { en: 'Cart', ml: 'ഷോപ്പിംഗ് കാർട്ട്' },
  favorites: { en: 'Saved Items', ml: 'പ്രിയപ്പെട്ടവ' },

  // Announcements and Badges
  dailyMandiRates: { en: 'Daily Mandi Rates', ml: 'ദിവസേനയുള്ള മണ്ഡി നിരക്കുകൾ' },
  farmFreshArrivals: { en: 'Farm Fresh Arrivals', ml: 'പുതിയ നാടൻ പച്ചക്കറികൾ' },
  livePriceUpdated: { en: 'Live Price Updated', ml: 'വിലനിലവാരം പുതുക്കി' },
  inStock: { en: 'In Stock', ml: 'ലഭ്യമാണ്' },
  outOfStock: { en: 'Out of Stock', ml: 'തീർന്നുപോയി' },
  lowStock: { en: 'Low Stock', ml: 'കുറഞ്ഞ അളവ് മാത്രം' },

  // Product cards & Actions
  retailPrice: { en: 'Retail Price', ml: 'റീട്ടെയിൽ വില' },
  wholesalePrice: { en: 'Wholesale Price', ml: 'മൊത്തവില' },
  addToCart: { en: 'Add to Cart', ml: 'കാർട്ടിലേക്ക് ചേർക്കുക' },
  buyNow: { en: 'Buy Now', ml: 'ഉടൻ വാങ്ങുക' },
  viewDetails: { en: 'View Details', ml: 'വിശദാംശങ്ങൾ കാണുക' },
  perKg: { en: 'per kg', ml: 'കിലോഗ്രാമിന്' },
  unit: { en: 'Unit', ml: 'യൂണിറ്റ്' },
  minWholesale: { en: 'Min Wholesale', ml: 'കുറഞ്ഞ മൊത്ത അളവ്' },
  orderViaWhatsApp: { en: 'Order via WhatsApp', ml: 'വാട്സ്ആപ്പ് വഴി ഓർഡർ ചെയ്യുക' },

  // Search & Filters
  searchPlaceholder: { en: 'Search tomatoes, onions, chena, kappa, vendakka...', ml: 'തക്കാളി, ഉള്ളി, ചേന, കപ്പ, വെണ്ടയ്ക്ക തിരയുക...' },
  allCategories: { en: 'All Categories', ml: 'എല്ലാ വിഭാഗങ്ങളും' },
  sortBy: { en: 'Sort by', ml: 'ക്രമീകരിക്കുക' },
  priceLowHigh: { en: 'Price: Low to High', ml: 'വില: കുറഞ്ഞത് മുതൽ കൂടിയത് വരെ' },
  priceHighLow: { en: 'Price: High to Low', ml: 'വില: കൂടിയത് മുതൽ കുറഞ്ഞത് വരെ' },

  // Admin & Staff
  staffPortalTitle: { en: 'Staff & Management Portal', ml: 'ജീവനക്കാരുടെ പോർട്ടൽ' },
  signInWithGoogle: { en: 'Continue with Gmail (Google Sign In)', ml: 'ജിമെയിൽ ഉപയോഗിച്ച് പ്രവേശിക്കുക (Google Sign In)' },
  loginWithIdPassword: { en: 'Sign in with Staff ID & Password', ml: 'ഐഡിയും പാസ്‌വേഡും ഉപയോഗിച്ച് പ്രവേശിക്കുക' },
  staffId: { en: 'Staff ID / Username', ml: 'സ്റ്റാഫ് ഐഡി / യൂസർനെയിം' },
  password: { en: 'Password', ml: 'പാസ്‌വേഡ്' },
  role: { en: 'Staff Role', ml: 'റോൾ' },
  signInBtn: { en: 'Sign In to Portal', ml: 'പോർട്ടലിൽ പ്രവേശിക്കുക' },
  addProduct: { en: 'Add New Vegetable / Product', ml: 'പുതിയ പച്ചക്കറി ചേർക്കുക' },
  editProduct: { en: 'Edit Vegetable', ml: 'വിവരങ്ങളിൽ മാറ്റം വരുത്തുക' },
  deleteProduct: { en: 'Delete', ml: 'ഒഴിവാക്കുക' },
  saveChanges: { en: 'Save All Changes', ml: 'മാറ്റങ്ങൾ സൂക്ഷിക്കുക' },
  cancel: { en: 'Cancel', ml: 'റദ്ദാക്കുക' },
};

export function t(key: string, lang: AppLanguage = 'en'): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return translations[key]?.en || key;
}
