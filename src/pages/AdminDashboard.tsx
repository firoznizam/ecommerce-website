import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  ShoppingBag,
  Building2,
  Settings,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  MessageCircle,
  Printer,
  ChevronRight,
  TrendingDown,
  RotateCcw,
  SlidersHorizontal,
  RefreshCw,
  Zap,
  ShieldCheck,
  Lock,
  User,
  Mail,
  LogOut,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  Calendar,
  History,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, WholesaleInquiry, AdminRole } from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { VERIFIED_PRODUCE_IMAGES } from '../assets/verifiedImages';
import { t } from '../utils/translations';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    wholesaleInquiries,
    settings,
    updateProduct,
    addProduct,
    deleteProduct,
    updateDailyPrices,
    triggerAutoDailyPriceUpdate,
    availableMandiHubs,
    updateOrderStatus,
    updateWholesaleInquiryStatus,
    updateSettings,
    priceHistory,
    navigateTo,
    currentAdmin,
    adminLogin,
    adminLogout,
    switchAdminRole,
    updateAdminInfo,
    addDailyProducePrice,
    language,
  } = useStore();

  // Navigation tab in Admin
  const [activeTab, setActiveTab] = useState<'prices' | 'orders' | 'products' | 'wholesale' | 'settings'>('prices');
  const [searchOrder, setSearchOrder] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Authentication Form States (Staff Sign-in)
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'google'>('credentials');
  const [staffIdInput, setStaffIdInput] = useState('admin');
  const [staffPasswordInput, setStaffPasswordInput] = useState('admin1234');
  const [staffRoleInput, setStaffRoleInput] = useState<AdminRole>('Super Admin');
  const [googleEmailInput, setGoogleEmailInput] = useState('admin.keralamandi@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Super Admin "Edit Info" Modal State
  const [showEditAdminInfoModal, setShowEditAdminInfoModal] = useState(false);
  const [adminInfoForm, setAdminInfoForm] = useState({
    name: currentAdmin?.name || 'Super Admin',
    email: currentAdmin?.email || 'admin@adamvegetables.com',
    role: (currentAdmin?.role || 'Super Admin') as AdminRole,
    phone: currentAdmin?.phone || settings.whatsappNumber || '+91 98470 12345',
    shift: currentAdmin?.shift || 'Morning Mandi Auction (05:00 AM - 02:00 PM)',
    mandiHub: currentAdmin?.mandiHub || settings.activeMandiHub || 'Aluva Central Mandi Yard',
  });

  // "Add Daily Price" Modal State ("he can add the price daily daily")
  const [showAddDailyPriceModal, setShowAddDailyPriceModal] = useState(false);
  const [dailyPriceForm, setDailyPriceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    productId: products[0]?.id || '',
    retailPrice: products[0]?.retailPrice || 40,
    wholesalePrice: products[0]?.wholesalePrice || 32,
    stock: products[0]?.stock || 50,
    mandiHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
    note: 'Morning auction arrival rate calibration',
  });

  // Products Tab: Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Daily Prices Quick-Update State
  const [priceEdits, setPriceEdits] = useState<Record<string, { retail: number; wholesale: number; stock: number }>>(() => {
    const map: Record<string, { retail: number; wholesale: number; stock: number }> = {};
    products.forEach((p) => {
      map[p.id] = { retail: p.retailPrice, wholesale: p.wholesalePrice, stock: p.stock };
    });
    return map;
  });
  const [priceSaveNotice, setPriceSaveNotice] = useState(false);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    malayalamName: '',
    category: categories[0]?.name || 'Traditional Kerala Produce',
    unit: 'kg',
    retailPrice: 40.0,
    wholesalePrice: 32.0,
    minWholesaleQty: 10,
    stock: 50,
    lowStockThreshold: 10,
    images: [VERIFIED_PRODUCE_IMAGES[0]?.url || ''],
    origin: 'Aluva / Palakkad Mandi Yard',
    freshnessNotes: 'Harvested Today Morning',
    description: 'Fresh farm-harvested vegetable directly from verified Kerala growers.',
    storageTips: 'Store in a cool dry area or refrigerate.',
    active: true,
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editSuccessNotice, setEditSuccessNotice] = useState<string | null>(null);

  // Settings edit state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [autoSyncSummary, setAutoSyncSummary] = useState<string | null>(null);
  const [showPriceHistoryLog, setShowPriceHistoryLog] = useState(false);

  // Sync edits state when products change
  const syncEditsFromProducts = (currentProds: Product[]) => {
    const map: Record<string, { retail: number; wholesale: number; stock: number }> = {};
    currentProds.forEach((p) => {
      map[p.id] = { retail: p.retailPrice, wholesale: p.wholesalePrice, stock: p.stock };
    });
    setPriceEdits(map);
  };

  // Staff Login Handler: ID & Password
  const handleStaffIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!staffIdInput.trim() || !staffPasswordInput.trim()) {
      setAuthError('Please enter both Staff ID and Password.');
      return;
    }

    const normalizedId = staffIdInput.trim().toLowerCase();
    const isDefaultAdmin = normalizedId === 'admin' && staffPasswordInput === 'admin1234';
    const isStaffMember = staffPasswordInput.length >= 4;

    if (isDefaultAdmin || isStaffMember) {
      const email = `${normalizedId}@adamvegetables.com`;
      const displayName = normalizedId === 'admin' ? 'Super Admin' : `Staff (${staffIdInput.trim()})`;
      adminLogin(email, staffRoleInput, displayName);
      setAuthSuccessMsg(`Signed in successfully as ${displayName}!`);
      setTimeout(() => setAuthSuccessMsg(null), 3000);
    } else {
      setAuthError('Invalid credentials. You may use Staff ID: admin / Password: admin1234.');
    }
  };

  // Staff Login Handler: Google Sign-in with Gmail
  const handleGoogleSignIn = (emailToUse?: string) => {
    setAuthError(null);
    const email = emailToUse || googleEmailInput.trim() || 'staff@gmail.com';
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    adminLogin(email, 'Super Admin', `${formattedName} (Super Admin)`);
    setAuthSuccessMsg(`Authenticated via Google as Super Admin (${email})!`);
    setTimeout(() => setAuthSuccessMsg(null), 3000);
  };

  const handleCustomGmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) {
      setAuthError('Please enter a valid Gmail address.');
      return;
    }
    handleGoogleSignIn(googleEmailInput.trim());
  };

  // Super Admin: Save Admin Info Changes
  const handleSaveAdminInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminInfo({
      name: adminInfoForm.name.trim(),
      email: adminInfoForm.email.trim(),
      role: adminInfoForm.role,
      phone: adminInfoForm.phone.trim(),
      shift: adminInfoForm.shift.trim(),
      mandiHub: adminInfoForm.mandiHub.trim(),
    });

    if (adminInfoForm.mandiHub) {
      updateSettings({ activeMandiHub: adminInfoForm.mandiHub });
    }

    setShowEditAdminInfoModal(false);
    setEditSuccessNotice(`Super Admin info updated successfully! Active Hub: ${adminInfoForm.mandiHub}`);
    setTimeout(() => setEditSuccessNotice(null), 4000);
  };

  // Super Admin: Save Daily Price Entry ("he can add the price daily daily")
  const handleSaveDailyPriceEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyPriceForm.productId) return;

    addDailyProducePrice({
      productId: dailyPriceForm.productId,
      retailPrice: Number(dailyPriceForm.retailPrice),
      wholesalePrice: Number(dailyPriceForm.wholesalePrice),
      stock: Number(dailyPriceForm.stock),
      date: dailyPriceForm.date,
      note: dailyPriceForm.note,
      mandiHub: dailyPriceForm.mandiHub,
    });

    // Update the inline quick price edits table as well
    setPriceEdits((prev) => ({
      ...prev,
      [dailyPriceForm.productId]: {
        retail: Number(dailyPriceForm.retailPrice),
        wholesale: Number(dailyPriceForm.wholesalePrice),
        stock: Number(dailyPriceForm.stock),
      },
    }));

    const prod = products.find((p) => p.id === dailyPriceForm.productId);
    const prodName = prod ? prod.name : 'Produce';

    setShowAddDailyPriceModal(false);
    setEditSuccessNotice(
      `✓ Daily price for ${prodName} published for ${dailyPriceForm.date}! Retail: ₹${Number(dailyPriceForm.retailPrice).toFixed(2)} | Wholesale: ₹${Number(dailyPriceForm.wholesalePrice).toFixed(2)}`
    );
    setTimeout(() => setEditSuccessNotice(null), 5000);
  };

  // Daily price publisher (bulk from table)
  const handlePublishDailyPrices = () => {
    const updates = Object.entries(priceEdits).map(([id, values]) => {
      const v = values as { retail: number; wholesale: number; stock: number };
      return {
        id,
        retailPrice: v.retail,
        wholesalePrice: v.wholesale,
      };
    });

    updateDailyPrices(updates);

    // Also update stocks
    Object.entries(priceEdits).forEach(([id, values]) => {
      const v = values as { retail: number; wholesale: number; stock: number };
      updateProduct(id, { stock: v.stock });
    });

    setPriceSaveNotice(true);
    setTimeout(() => setPriceSaveNotice(false), 3000);
  };

  const handleTriggerAutoDailyPriceSync = (intensity: 'normal' | 'volatile' | 'surplus' = 'normal') => {
    setIsAutoSyncing(true);
    setTimeout(() => {
      const result = triggerAutoDailyPriceUpdate({
        sourceHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
        intensity,
        showToast: true,
      });
      syncEditsFromProducts(result.updatedProducts);
      setAutoSyncSummary(
        `✓ Mandi prices refreshed! ${result.summary.droppedCount} items dropped, ${result.summary.increasedCount} increased from ${result.summary.mandiSource}.`
      );
      setIsAutoSyncing(false);
      setTimeout(() => setAutoSyncSummary(null), 6000);
    }, 600);
  };

  // Add Product Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const prodId = `prod-${Date.now()}`;
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    addProduct({
      id: prodId,
      name: newProduct.name,
      slug,
      category: newProduct.category || 'Traditional Kerala Produce',
      malayalamName: newProduct.malayalamName || '',
      unit: newProduct.unit || 'kg',
      retailPrice: Number(newProduct.retailPrice) || 0,
      wholesalePrice: Number(newProduct.wholesalePrice) || 0,
      minWholesaleQty: Number(newProduct.minWholesaleQty) || 10,
      stock: Number(newProduct.stock) || 50,
      lowStockThreshold: Number(newProduct.lowStockThreshold) || 10,
      images: newProduct.images && newProduct.images.length > 0 ? newProduct.images : [VERIFIED_PRODUCE_IMAGES[0].url],
      origin: newProduct.origin || 'Aluva / Palakkad Mandi Yard',
      freshnessNotes: newProduct.freshnessNotes || 'Harvested Today Morning',
      description: newProduct.description || 'Farm-fresh Kerala produce directly from verified growers.',
      storageTips: newProduct.storageTips || 'Store in cool ventilated space or crisper drawer.',
      active: true,
      priceUpdatedToday: true,
      lastPriceUpdate: '05:30 AM',
      priceChangeDirection: 'unchanged',
    });

    setShowAddProductModal(false);
    setEditSuccessNotice(`Successfully added "${newProduct.name}" to produce catalog!`);
    setTimeout(() => setEditSuccessNotice(null), 4000);

    setNewProduct({
      name: '',
      malayalamName: '',
      category: categories[0]?.name || 'Traditional Kerala Produce',
      unit: 'kg',
      retailPrice: 40.0,
      wholesalePrice: 32.0,
      minWholesaleQty: 10,
      stock: 50,
      lowStockThreshold: 10,
      images: [VERIFIED_PRODUCE_IMAGES[0]?.url || ''],
      origin: 'Aluva / Palakkad Mandi Yard',
      freshnessNotes: 'Harvested Today Morning',
      description: 'Fresh farm-harvested vegetable directly from verified Kerala growers.',
      storageTips: 'Store in a cool dry area or refrigerate.',
      active: true,
    });
  };

  // Edit Product Submit
  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      malayalamName: editingProduct.malayalamName,
      category: editingProduct.category,
      unit: editingProduct.unit,
      retailPrice: Number(editingProduct.retailPrice) || 0,
      wholesalePrice: Number(editingProduct.wholesalePrice) || 0,
      minWholesaleQty: Number(editingProduct.minWholesaleQty) || 10,
      stock: Number(editingProduct.stock) || 0,
      lowStockThreshold: Number(editingProduct.lowStockThreshold) || 10,
      images: editingProduct.images,
      origin: editingProduct.origin,
      freshnessNotes: editingProduct.freshnessNotes,
      description: editingProduct.description,
      storageTips: editingProduct.storageTips,
      priceUpdatedToday: true,
    });

    setEditSuccessNotice(`Updated "${editingProduct.name}" successfully!`);
    setTimeout(() => setEditSuccessNotice(null), 4000);
    setEditingProduct(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Filter products in Catalog & Stock Tab
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.malayalamName && p.malayalamName.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase();
      return (
        o.orderNo.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  // -------------------------------------------------------------
  // VIEW: IF NOT SIGNED IN AS STAFF, SHOW STAFF SIGN-IN GATEWAY
  // -------------------------------------------------------------
  if (!currentAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center mx-auto text-white shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">Staff Management Portal</h1>
            <p className="text-xs text-emerald-200">
              Sign in with your Staff ID & Password or Google Gmail to access Super Admin controls and add daily mandi rates.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Tabs for Login Type */}
            <div className="flex items-center rounded-xl bg-stone-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('credentials');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  loginMethod === 'credentials'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ID & Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('google');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  loginMethod === 'google'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-rose-500" />
                <span>Login with Gmail</span>
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {loginMethod === 'credentials' ? (
              <form onSubmit={handleStaffIdLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Staff ID / Username *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={staffIdInput}
                      onChange={(e) => setStaffIdInput(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={staffPasswordInput}
                      onChange={(e) => setStaffPasswordInput(e.target.value)}
                      placeholder="e.g. admin1234"
                      className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Staff Role</label>
                  <select
                    value={staffRoleInput}
                    onChange={(e) => setStaffRoleInput(e.target.value as AdminRole)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800"
                  >
                    <option value="Super Admin">Super Admin (All Privileges)</option>
                    <option value="Store Manager">Store Manager (Rates & Inventory)</option>
                    <option value="Inventory Staff">Inventory Staff (Stock & Packing)</option>
                  </select>
                </div>

                {/* Quick Autofill Helper */}
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-950">
                    Default credentials: <strong>admin</strong> / <strong>admin1234</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStaffIdInput('admin');
                      setStaffPasswordInput('admin1234');
                      setStaffRoleInput('Super Admin');
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Autofill Super Admin
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-all active:scale-98"
                >
                  Sign In with ID & Password
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-600 leading-relaxed">
                  Authenticate securely as Super Admin using your Google / Gmail account to manage daily vegetable rates and store settings.
                </div>

                {/* Direct Google Sign-in Button */}
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('admin.keralamandi@gmail.com')}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold shadow-xs transition-all flex items-center justify-center gap-3 active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Gmail (Google Super Admin)</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-3 text-stone-400 text-[10px] uppercase font-bold">Or enter your staff Gmail</span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <form onSubmit={handleCustomGmailLogin} className="space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Your Gmail Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={googleEmailInput}
                        onChange={(e) => setGoogleEmailInput(e.target.value)}
                        placeholder="e.g. manager@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all"
                  >
                    Sign In with this Gmail
                  </button>
                </form>
              </div>
            )}

            <div className="pt-2 border-t border-stone-100 text-center">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="text-stone-500 hover:text-stone-900 text-xs font-semibold"
              >
                ← Return to Storefront
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN VIEW: AUTHENTICATED STAFF MANAGEMENT DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner with Authenticated Staff Session */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Operations & Mandi Rate Console</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-700">
              <User className="w-3 h-3 text-emerald-400" />
              <span>Signed in as: <strong>{currentAdmin.name}</strong> ({currentAdmin.role})</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Adam Fresh Produce Manager
          </h1>
          <p className="text-xs text-stone-400">
            System timestamp: <strong>{settings.lastMarketPriceUpdateTimestamp}</strong> • {products.length} vegetables in catalog • {orders.length} orders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role selector */}
          <select
            value={currentAdmin.role}
            onChange={(e) => switchAdminRole(e.target.value as AdminRole)}
            className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold"
            title="Change active role"
          >
            <option value="Super Admin">Role: Super Admin</option>
            <option value="Store Manager">Role: Store Manager</option>
            <option value="Inventory Staff">Role: Inventory Staff</option>
          </select>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 border border-rose-700/50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Sign out of staff console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-bold text-white transition-colors"
          >
            ← View Storefront
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUPER ADMIN CONTROL SECTION                              */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 text-white rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-700/80 text-emerald-200 border border-emerald-500/40 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">Super Admin Control Section</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-black text-[10px] uppercase tracking-wider">
                    Full Master Access
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Update staff and store info, calibrate mandi benchmark hub, and add daily fresh produce rates.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* ENABLED EDIT INFO BUTTON */}
            <button
              onClick={() => {
                setAdminInfoForm({
                  name: currentAdmin.name,
                  email: currentAdmin.email,
                  role: currentAdmin.role,
                  phone: currentAdmin.phone || settings.whatsappNumber || '+91 98470 12345',
                  shift: currentAdmin.shift || 'Morning Mandi Auction (05:00 AM - 02:00 PM)',
                  mandiHub: currentAdmin.mandiHub || settings.activeMandiHub || 'Aluva Central Mandi Yard',
                });
                setShowEditAdminInfoModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-98"
              id="btn-super-admin-edit-info"
              title="Edit Super Admin Information & Store Settings"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </button>

            {/* ADD DAILY PRICE BUTTON ("he can add the price daily daily") */}
            <button
              onClick={() => {
                const firstProd = products[0];
                if (firstProd) {
                  setDailyPriceForm({
                    date: new Date().toISOString().split('T')[0],
                    productId: firstProd.id,
                    retailPrice: firstProd.retailPrice,
                    wholesalePrice: firstProd.wholesalePrice,
                    stock: firstProd.stock,
                    mandiHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
                    note: 'Morning mandi auction rate revision',
                  });
                }
                setShowAddDailyPriceModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-98"
              id="btn-super-admin-add-daily-price"
              title="Add Daily Vegetable Mandi Price Day-by-Day"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>+ Add Daily Price</span>
            </button>
          </div>
        </div>

        {/* Super Admin Info Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Super Admin Name</span>
            <p className="font-extrabold text-stone-100 text-sm truncate">{currentAdmin.name}</p>
            <p className="text-[11px] text-emerald-400 font-medium truncate">{currentAdmin.email}</p>
          </div>

          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Contact Phone / WhatsApp</span>
            <p className="font-bold text-stone-100 text-sm truncate">
              {currentAdmin.phone || settings.whatsappNumber || '+91 98470 12345'}
            </p>
            <p className="text-[11px] text-stone-400">Order & dispatch hotline</p>
          </div>

          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Assigned Mandi Yard</span>
            <p className="font-bold text-emerald-300 text-sm truncate">
              {currentAdmin.mandiHub || settings.activeMandiHub || 'Aluva Central Mandi Yard'}
            </p>
            <p className="text-[11px] text-stone-400">Live auction benchmark</p>
          </div>

          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Daily Price Status</span>
            <p className="font-bold text-amber-300 text-sm truncate">
              {products.filter((p) => p.priceUpdatedToday).length}/{products.length} Updated Today
            </p>
            <p className="text-[11px] text-stone-400">Last: {settings.lastMarketPriceUpdateTimestamp}</p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {editSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{editSuccessNotice}</span>
          </div>
          <button
            onClick={() => setEditSuccessNotice(null)}
            className="text-stone-400 hover:text-stone-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prices'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Daily Price Master Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Dispatch ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wholesale')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'wholesale'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>B2B Inquiries ({wholesaleInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings & Contacts</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DAILY PRICE MASTER SHEET                           */}
      {/* ======================================================== */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl font-black text-stone-900">
                  Morning Mandi Price Revision & Daily Rates
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-xl">
                Add and calibrate prices daily. The Super Admin can adjust rates item-by-item, sync with Kerala wholesale yards, or publish live updates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Add Daily Price Button */}
              <button
                onClick={() => {
                  const firstProd = products[0];
                  if (firstProd) {
                    setDailyPriceForm({
                      date: new Date().toISOString().split('T')[0],
                      productId: firstProd.id,
                      retailPrice: firstProd.retailPrice,
                      wholesalePrice: firstProd.wholesalePrice,
                      stock: firstProd.stock,
                      mandiHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
                      note: 'Morning mandi auction rate revision',
                    });
                  }
                  setShowAddDailyPriceModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>+ Add Daily Price</span>
              </button>

              <button
                onClick={() => handleTriggerAutoDailyPriceSync('normal')}
                disabled={isAutoSyncing}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                <span>Sync with Kerala Mandi Rates</span>
              </button>

              <button
                onClick={handlePublishDailyPrices}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Publish Daily Rates</span>
              </button>
            </div>
          </div>

          {autoSyncSummary && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{autoSyncSummary}</span>
            </div>
          )}

          {priceSaveNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All updated vegetable prices and stock counts published live to the storefront!</span>
            </div>
          )}

          {/* Quick Price Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Daily Master Pricing Sheet ({products.length} vegetables)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPriceHistoryLog(!showPriceHistoryLog)}
                className="text-emerald-700 hover:underline flex items-center gap-1 text-xs"
              >
                <History className="w-3.5 h-3.5" />
                <span>{showPriceHistoryLog ? 'Hide Price History Log' : 'View Daily Price History Log'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-700 font-black uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Vegetable</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Retail Price ({settings.currencySymbol})</th>
                    <th className="py-3 px-4">Wholesale Price ({settings.currencySymbol})</th>
                    <th className="py-3 px-4">Stock Qty</th>
                    <th className="py-3 px-4 text-right">Daily Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const editVal = priceEdits[p.id] || {
                      retail: p.retailPrice,
                      wholesale: p.wholesalePrice,
                      stock: p.stock,
                    };
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-bold text-stone-900">{p.name}</p>
                              {p.malayalamName && (
                                <p className="text-[11px] font-bold text-emerald-700">{p.malayalamName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-500 font-semibold">{p.category}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-stone-600">{settings.currencySymbol}</span>
                            <input
                              type="number"
                              step="0.1"
                              value={editVal.retail}
                              onChange={(e) =>
                                setPriceEdits((prev) => ({
                                  ...prev,
                                  [p.id]: { ...prev[p.id], retail: Number(e.target.value) },
                                }))
                              }
                              className="w-24 p-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900"
                            />
                            <span className="text-[11px] text-stone-400">/{p.unit}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-stone-600">{settings.currencySymbol}</span>
                            <input
                              type="number"
                              step="0.1"
                              value={editVal.wholesale}
                              onChange={(e) =>
                                setPriceEdits((prev) => ({
                                  ...prev,
                                  [p.id]: { ...prev[p.id], wholesale: Number(e.target.value) },
                                }))
                              }
                              className="w-24 p-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-emerald-800"
                            />
                            <span className="text-[11px] text-stone-400">/{p.unit}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={editVal.stock}
                            onChange={(e) =>
                              setPriceEdits((prev) => ({
                                ...prev,
                                [p.id]: { ...prev[p.id], stock: Number(e.target.value) },
                              }))
                            }
                            className="w-20 p-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900"
                          />
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {/* Add Daily Price for this specific produce */}
                          <button
                            onClick={() => {
                              setDailyPriceForm({
                                date: new Date().toISOString().split('T')[0],
                                productId: p.id,
                                retailPrice: p.retailPrice,
                                wholesalePrice: p.wholesalePrice,
                                stock: p.stock,
                                mandiHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
                                note: 'Morning rate calibration',
                              });
                              setShowAddDailyPriceModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-[11px] inline-flex items-center gap-1"
                            title="Add daily price record"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Add Daily Price</span>
                          </button>

                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Produce</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Price History Audit Log */}
          {showPriceHistoryLog && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    Daily Price History & Audit Log
                  </h3>
                  <p className="text-xs text-stone-500">
                    Historical record of day-by-day price revisions saved by Super Admin.
                  </p>
                </div>
                <button
                  onClick={() => setShowPriceHistoryLog(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                {priceHistory.slice(0, 30).map((record) => (
                  <div key={record.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-900">{record.productName}</strong>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold">
                          {record.effectiveAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">{record.reason} • By: {record.changedBy}</p>
                    </div>

                    <div className="text-right">
                      <span className="line-through text-stone-400 mr-2">
                        {settings.currencySymbol}{record.oldPrice.toFixed(2)}
                      </span>
                      <strong className={`font-black ${record.newPrice > record.oldPrice ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {settings.currencySymbol}{record.newPrice.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CATALOG & STOCK INVENTORY (ADD / EDIT / DELETE)    */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-stone-900">Produce Inventory Master</h2>
              <p className="text-xs text-stone-500">
                Add new vegetables with exact photos and Malayalam names, or edit existing produce details.
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Fresh Vegetable</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search vegetable by English name, Malayalam name, or category..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>

            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="w-full sm:w-56 p-2.5 bg-white border border-stone-200 rounded-2xl text-xs font-bold text-stone-700 shadow-xs"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex gap-3 items-start">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-stone-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-stone-900 truncate">{p.name}</p>
                      {p.malayalamName && (
                        <p className="text-xs font-bold text-emerald-700 truncate mt-0.5">
                          {p.malayalamName}
                        </p>
                      )}
                      <span className="inline-block mt-1 text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Retail:</span>
                      <strong className="text-stone-900">
                        {settings.currencySymbol}{p.retailPrice.toFixed(2)} / {p.unit}
                      </strong>
                    </div>
                    <div className="flex justify-between text-emerald-800">
                      <span>Wholesale:</span>
                      <strong className="font-extrabold">
                        {settings.currencySymbol}{p.wholesalePrice.toFixed(2)} / {p.unit}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className={`font-bold ${p.stock < 15 ? 'text-amber-700' : 'text-stone-600'}`}>
                    Stock: {p.stock} {p.unit}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingProduct({ ...p })}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 transition-colors"
                      title="Edit this vegetable"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${p.name}? This will remove it from the catalog.`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ====================================================== */}
          {/* MODAL: ADD NEW FRESH VEGETABLE                         */}
          {/* ====================================================== */}
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <form
                onSubmit={handleCreateProduct}
                className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-lg font-black text-stone-900">Add New Fresh Produce</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Vegetable English Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Malabar Cucumber"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Malayalam Name (മലയാളം പേര്) *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.malayalamName || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, malayalamName: e.target.value })}
                      placeholder="e.g. കണിവെള്ളരിക്ക"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Unit</label>
                    <select
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="500g">500 grams</option>
                      <option value="piece">Piece / Head</option>
                      <option value="bunch">Bunch</option>
                      <option value="crate">Crate (20kg)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Retail Price ({settings.currencySymbol})</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newProduct.retailPrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, retailPrice: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Wholesale Price ({settings.currencySymbol})</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newProduct.wholesalePrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, wholesalePrice: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Min Wholesale Qty</label>
                    <input
                      type="number"
                      value={newProduct.minWholesaleQty}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, minWholesaleQty: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Initial Stock Qty</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  {/* Verified Kerala Produce Image Picker */}
                  <div className="col-span-2 space-y-2 pt-2 border-t border-stone-100">
                    <label className="block font-bold text-stone-800">
                      Select Verified Vegetable Photo:
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-stone-50 rounded-2xl border border-stone-200">
                      {VERIFIED_PRODUCE_IMAGES.map((img) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, images: [img.url] })}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                            newProduct.images?.[0] === img.url
                              ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-95'
                              : 'border-transparent hover:border-stone-300'
                          }`}
                          title={`${img.name} (${img.malayalamName})`}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          {newProduct.images?.[0] === img.url && (
                            <span className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newProduct.images?.[0] || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                        placeholder="Or enter custom image URL"
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Origin / Farm Source</label>
                    <input
                      type="text"
                      value={newProduct.origin || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, origin: e.target.value })}
                      placeholder="e.g. Aluva Mandi Yard / Palakkad Organic Cluster"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md"
                  >
                    Save Fresh Produce
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ====================================================== */}
          {/* MODAL: EDIT VEGETABLE DATA                             */}
          {/* ====================================================== */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <form
                onSubmit={handleUpdateProductSubmit}
                className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-lg font-black text-stone-900">
                      Edit Vegetable: {editingProduct.name}
                    </h3>
                    <p className="text-xs text-stone-500">Update pricing, Malayalam name, photo, and stock</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="p-1 text-stone-400 hover:text-stone-700 text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Vegetable English Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Malayalam Name (മലയാളം പേര്)</label>
                    <input
                      type="text"
                      value={editingProduct.malayalamName || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, malayalamName: e.target.value })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Unit</label>
                    <select
                      value={editingProduct.unit}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, unit: e.target.value })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="500g">500 grams</option>
                      <option value="piece">Piece / Head</option>
                      <option value="bunch">Bunch</option>
                      <option value="crate">Crate (20kg)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Retail Price ({settings.currencySymbol})</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editingProduct.retailPrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          retailPrice: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Wholesale Price ({settings.currencySymbol})</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editingProduct.wholesalePrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          wholesalePrice: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Low Stock Warning Threshold</label>
                    <input
                      type="number"
                      value={editingProduct.lowStockThreshold}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          lowStockThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  {/* Verified Kerala Vegetable Image Picker */}
                  <div className="col-span-2 space-y-2 pt-2 border-t border-stone-100">
                    <label className="block font-bold text-stone-800">
                      Verified Kerala Vegetable Photo:
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-stone-50 rounded-2xl border border-stone-200">
                      {VERIFIED_PRODUCE_IMAGES.map((img) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() =>
                            setEditingProduct({ ...editingProduct, images: [img.url] })
                          }
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                            editingProduct.images?.[0] === img.url
                              ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-95'
                              : 'border-transparent hover:border-stone-300'
                          }`}
                          title={`${img.name} (${img.malayalamName})`}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          {editingProduct.images?.[0] === img.url && (
                            <span className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProduct.images?.[0] || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, images: [e.target.value] })
                        }
                        placeholder="Image URL"
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Origin / Farm Source</label>
                    <input
                      type="text"
                      value={editingProduct.origin || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, origin: e.target.value })
                      }
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md"
                  >
                    Save All Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ORDER DISPATCH & STATUS                            */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-black text-stone-900">
              Orders Queue ({orders.length})
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="Search order #, customer, phone..."
                className="p-2 bg-white border border-stone-200 rounded-xl text-xs"
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="p-2 bg-white border border-stone-200 rounded-xl text-xs font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Slot</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderNo} className="hover:bg-stone-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        #{order.orderNo}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-stone-900">{order.customerName}</p>
                        <p className="text-[11px] text-stone-500">{order.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-medium">
                        {order.deliverySlot}
                      </td>
                      <td className="py-3 px-4">{order.items.length} items</td>
                      <td className="py-3 px-4 font-black text-stone-900">
                        {settings.currencySymbol}{order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderNo, e.target.value as OrderStatus)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 font-bold text-[11px] focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing / QC</option>
                          <option value="Ready">Ready</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-stone-800 text-[11px]"
                        >
                          View Slip
                        </button>
                        <a
                          href={buildWhatsAppUrl(
                            order.customerWhatsApp || order.customerPhone,
                            `Hello ${order.customerName}! This is ${settings.shopName} regarding your produce order ${order.orderNo}. Current status: ${order.status}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#25D366] text-stone-950 rounded-lg font-black text-[11px] inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3 fill-stone-950" />
                          <span>Chat</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for Order Slip */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-lg font-black text-stone-900">
                    Order Slip #{selectedOrder.orderNo}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                  <p><strong>Destination:</strong> {selectedOrder.deliveryAddress}</p>
                  <p><strong>Slot:</strong> {selectedOrder.deliverySlot}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                </div>

                <div className="border-t border-b border-stone-100 py-3 space-y-2 text-xs">
                  <h4 className="font-bold text-stone-900">Produce Items:</h4>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity} {item.unit} × {item.productName}</span>
                      <span className="font-bold">{settings.currencySymbol}{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-black text-sm text-stone-900 border-t border-stone-100">
                    <span>Total:</span>
                    <span>{settings.currencySymbol}{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Packing Label</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: WHOLESALE INQUIRIES                                */}
      {/* ======================================================== */}
      {activeTab === 'wholesale' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-stone-900">Commercial Account Applications</h2>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-stone-100 text-xs">
              {wholesaleInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900 text-sm">{inq.companyName}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {inq.businessType}
                      </span>
                      {inq.status === 'Approved' && (
                        <span className="text-[10px] font-black text-emerald-700">✓ Approved</span>
                      )}
                    </div>
                    <p className="text-stone-600">
                      Contact: {inq.contactPerson} • {inq.phone} • Est: {inq.estimatedDailyVolumeKg}kg/day
                    </p>
                    {inq.notes && <p className="text-stone-400 italic">"{inq.notes}"</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    {inq.status !== 'Approved' && (
                      <button
                        onClick={() => updateWholesaleInquiryStatus(inq.id, 'Approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold"
                      >
                        Approve Account
                      </button>
                    )}
                    {inq.status !== 'Rejected' && (
                      <button
                        onClick={() => updateWholesaleInquiryStatus(inq.id, 'Rejected')}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: STORE SETTINGS & CONTACTS                          */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs text-xs">
          <h2 className="text-xl font-black text-stone-900">Store Settings & Mandi Configuration</h2>

          {settingsSavedNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Settings and contact parameters successfully saved!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Store / Business Name</label>
              <input
                type="text"
                value={settingsForm.shopName}
                onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Primary Phone Number</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">WhatsApp Dispatch Number</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Physical Address / Depot Bay</label>
              <textarea
                rows={2}
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Notice Banner Text (Top of Storefront)</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            {/* Daily Market Price Automation Controls */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-xs sm:text-sm">
                    Automatic Daily Market Price Calibration
                  </h3>
                  <p className="text-[11px] text-stone-600">
                    Automatically adjusts vegetable retail & wholesale mandi rates each morning at dawn (05:30 AM IST).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.autoPriceUpdateEnabled ?? true}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, autoPriceUpdateEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-stone-800 text-[11px] mb-1">
                  Primary Kerala Mandi Benchmark Hub:
                </label>
                <select
                  value={settingsForm.activeMandiHub || 'Aluva Central Mandi Yard'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, activeMandiHub: e.target.value })}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-800"
                >
                  {availableMandiHubs.map((hub) => (
                    <option key={hub.mandiHub} value={hub.mandiHub}>
                      {hub.mandiHub} ({hub.district}) — {hub.auctionSession}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
            >
              Save Configuration Changes
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT SUPER ADMIN INFO (ENABLED VIA "EDIT INFO")     */}
      {/* ======================================================== */}
      {showEditAdminInfoModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveAdminInfo}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    Edit Super Admin Info
                  </h3>
                  <p className="text-xs text-stone-500">Update admin profile, role, contact and yard</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditAdminInfoModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Super Admin Display Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={adminInfoForm.name}
                    onChange={(e) => setAdminInfoForm({ ...adminInfoForm, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Official Email / Gmail *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={adminInfoForm.email}
                    onChange={(e) => setAdminInfoForm({ ...adminInfoForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone / WhatsApp Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={adminInfoForm.phone}
                    onChange={(e) => setAdminInfoForm({ ...adminInfoForm, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned Staff Role</label>
                <select
                  value={adminInfoForm.role}
                  onChange={(e) => setAdminInfoForm({ ...adminInfoForm, role: e.target.value as AdminRole })}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                >
                  <option value="Super Admin">Super Admin (All Privileges)</option>
                  <option value="Store Manager">Store Manager (Rates & Inventory)</option>
                  <option value="Inventory Staff">Inventory Staff (Stock & Packing)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned Mandi Benchmark Yard</label>
                <select
                  value={adminInfoForm.mandiHub}
                  onChange={(e) => setAdminInfoForm({ ...adminInfoForm, mandiHub: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                >
                  {availableMandiHubs.map((hub) => (
                    <option key={hub.mandiHub} value={hub.mandiHub}>
                      {hub.mandiHub} ({hub.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Operational Shift / Timings</label>
                <input
                  type="text"
                  value={adminInfoForm.shift}
                  onChange={(e) => setAdminInfoForm({ ...adminInfoForm, shift: e.target.value })}
                  placeholder="e.g. Morning Mandi Auction (05:00 AM - 02:00 PM)"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowEditAdminInfoModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all active:scale-98"
              >
                Save Info Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD DAILY PRODUCE PRICE (DAILY DAILY PRICE ENTRY) */}
      {/* ======================================================== */}
      {showAddDailyPriceModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveDailyPriceEntry}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    Add Daily Mandi Produce Price
                  </h3>
                  <p className="text-xs text-stone-500">Record and publish daily rates for wholesale & retail</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDailyPriceModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Price Effective Date (Daily Daily) *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dailyPriceForm.date}
                    onChange={(e) => setDailyPriceForm({ ...dailyPriceForm, date: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Select Fresh Vegetable *</label>
                <select
                  required
                  value={dailyPriceForm.productId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const p = products.find((item) => item.id === selectedId);
                    setDailyPriceForm({
                      ...dailyPriceForm,
                      productId: selectedId,
                      retailPrice: p ? p.retailPrice : dailyPriceForm.retailPrice,
                      wholesalePrice: p ? p.wholesalePrice : dailyPriceForm.wholesalePrice,
                      stock: p ? p.stock : dailyPriceForm.stock,
                    });
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.malayalamName ? `(${p.malayalamName})` : ''} — Current: ₹{p.retailPrice.toFixed(2)} / {p.unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show selected item banner */}
              {(() => {
                const selectedProd = products.find((p) => p.id === dailyPriceForm.productId);
                if (!selectedProd) return null;
                return (
                  <div className="col-span-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <img
                      src={selectedProd.images[0]}
                      alt={selectedProd.name}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
                    />
                    <div className="text-xs">
                      <p className="font-extrabold text-emerald-950">{selectedProd.name}</p>
                      {selectedProd.malayalamName && (
                        <p className="text-emerald-700 font-bold">{selectedProd.malayalamName}</p>
                      )}
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Current: Retail <strong>₹{selectedProd.retailPrice.toFixed(2)}</strong> | Wholesale <strong>₹{selectedProd.wholesalePrice.toFixed(2)}</strong> / {selectedProd.unit}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Today Retail Rate ({settings.currencySymbol}) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={dailyPriceForm.retailPrice}
                    onChange={(e) =>
                      setDailyPriceForm({ ...dailyPriceForm, retailPrice: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Today Wholesale Rate ({settings.currencySymbol}) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={dailyPriceForm.wholesalePrice}
                    onChange={(e) =>
                      setDailyPriceForm({ ...dailyPriceForm, wholesalePrice: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Today Arrival Stock Qty</label>
                <input
                  type="number"
                  value={dailyPriceForm.stock}
                  onChange={(e) =>
                    setDailyPriceForm({ ...dailyPriceForm, stock: Number(e.target.value) })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Source Mandi Benchmark</label>
                <select
                  value={dailyPriceForm.mandiHub}
                  onChange={(e) =>
                    setDailyPriceForm({ ...dailyPriceForm, mandiHub: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800"
                >
                  {availableMandiHubs.map((hub) => (
                    <option key={hub.mandiHub} value={hub.mandiHub}>
                      {hub.mandiHub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Daily Market Rate Revision Notes</label>
                <input
                  type="text"
                  value={dailyPriceForm.note}
                  onChange={(e) =>
                    setDailyPriceForm({ ...dailyPriceForm, note: e.target.value })
                  }
                  placeholder="e.g. Morning auction arrivals surge / High fresh supply"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAddDailyPriceModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all active:scale-98"
              >
                Save & Publish Daily Rate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
