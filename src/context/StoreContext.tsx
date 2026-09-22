import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Order,
  CartItem,
  WholesaleInquiry,
  DeliveryZone,
  Coupon,
  StoreSettings,
  PriceHistoryRecord,
  AdminUser,
  AdminRole,
  OrderStatus,
} from '../types';
import {
  simulateDailyMarketPrices,
  KERALA_MANDI_HUBS,
  AutoPriceUpdateResult,
} from '../utils/dailyPriceEngine';
import {
  initialProducts,
  initialCategories,
  initialDeliveryZones,
  initialCoupons,
  initialPriceHistory,
  initialOrders,
  initialWholesaleInquiries,
  initialSettings,
} from '../data/mockData';

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  isWholesaleApproved: boolean;
  companyName?: string;
  savedAddresses: string[];
}

interface NavigateOptions {
  productId?: string;
  categorySlug?: string;
  orderNo?: string;
}

interface StoreContextType {
  // Navigation
  activePage: string;
  currentPage: string; // alias for activePage
  activeProductId: string | null;
  activeCategorySlug: string | null;
  activeOrderNo: string | null;
  navigateTo: (page: string, options?: NavigateOptions) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'en' | 'ml';
  setLanguage: (lang: 'en' | 'ml') => void;

  // Catalog & Products
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateDailyPrices: (
    updates: { id: string; retailPrice: number; wholesalePrice: number; note?: string }[]
  ) => void;
  triggerAutoDailyPriceUpdate: (options?: {
    sourceHub?: string;
    intensity?: 'normal' | 'volatile' | 'surplus';
    showToast?: boolean;
  }) => AutoPriceUpdateResult;
  autoPriceNotice: {
    visible: boolean;
    headline: string;
    droppedCount: number;
    increasedCount: number;
    mandiSource: string;
    timestamp: string;
  } | null;
  dismissAutoPriceNotice: () => void;
  availableMandiHubs: typeof KERALA_MANDI_HUBS;

  // Price History
  priceHistory: PriceHistoryRecord[];

  // Cart & Checkout
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedDeliveryZone: DeliveryZone;
  setSelectedDeliveryZone: (zone: DeliveryZone) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'orderNo' | 'status' | 'statusTimeline' | 'createdAt'>) => Order;
  updateOrderStatus: (orderNo: string, newStatus: OrderStatus, note?: string) => void;
  lastPlacedOrder: Order | null;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Wholesale Inquiries
  wholesaleInquiries: WholesaleInquiry[];
  submitWholesaleInquiry: (inquiry: Omit<WholesaleInquiry, 'id' | 'status' | 'createdAt'>) => void;
  updateWholesaleInquiryStatus: (id: string, status: 'Pending' | 'Approved' | 'Rejected') => void;

  // Settings & Logistics
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  deliveryZones: DeliveryZone[];
  updateDeliveryZone: (id: string, updates: Partial<DeliveryZone>) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;

  // Customer Profile
  customer: CustomerProfile | null;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => void;
  loginAsDemoCustomer: (wholesale?: boolean) => void;
  logoutCustomer: () => void;

  // Admin Auth
  currentAdmin: AdminUser | null;
  adminLogin: (email: string, role?: AdminRole, name?: string) => boolean;
  adminLogout: () => void;
  switchAdminRole: (role: AdminRole) => void;
  updateAdminInfo: (info: Partial<AdminUser>) => void;
  addDailyProducePrice: (params: {
    productId: string;
    retailPrice: number;
    wholesalePrice: number;
    stock?: number;
    date?: string;
    note?: string;
    mandiHub?: string;
  }) => void;

  // Quick Wholesale helpers
  smartReorderItems: Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'adam_veg_kerala_v9_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    // If settings has old currency, return fallback
    if (key === 'settings' && parsed && (parsed.currencySymbol !== '₹' || parsed.currencyCode !== 'INR')) {
      return fallback;
    }
    // If products array has old count or outdated names, return fallback
    if (key === 'products' && Array.isArray(parsed)) {
      if (parsed.length < (fallback as unknown as any[]).length) {
        return fallback;
      }
      if (parsed[0] && parsed[0].retailPrice < 10) {
        return fallback;
      }
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage save error:', err);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [activePage, setActivePage] = useState<string>('home');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [activeOrderNo, setActiveOrderNo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguageState] = useState<'en' | 'ml'>('en');

  // Persistence State
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage('products', initialProducts)
  );
  const [categories] = useState<Category[]>(initialCategories);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>(() =>
    loadFromStorage('price_history', initialPriceHistory)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage('orders', initialOrders)
  );
  const [wholesaleInquiries, setWholesaleInquiries] = useState<WholesaleInquiry[]>(() =>
    loadFromStorage('wholesale_inquiries', initialWholesaleInquiries)
  );
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() =>
    loadFromStorage('delivery_zones', initialDeliveryZones)
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    loadFromStorage('coupons', initialCoupons)
  );
  const [settings, setSettings] = useState<StoreSettings>(() =>
    loadFromStorage('settings', initialSettings)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage('cart', [])
  );
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() =>
    loadFromStorage('saved_for_later', [])
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    loadFromStorage('favorites', ['prod-1', 'prod-2', 'prod-4'])
  );
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<DeliveryZone>(
    () => deliveryZones[0] || initialDeliveryZones[0]
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Customer state
  const [customer, setCustomer] = useState<CustomerProfile | null>(() =>
    loadFromStorage('customer', null)
  );

  // Admin state
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() =>
    loadFromStorage('admin_user', null)
  );

  // Auto price update state & notification banner
  const [autoPriceNotice, setAutoPriceNotice] = useState<{
    visible: boolean;
    headline: string;
    droppedCount: number;
    increasedCount: number;
    mandiSource: string;
    timestamp: string;
  } | null>(null);

  const dismissAutoPriceNotice = () => {
    setAutoPriceNotice(null);
  };

  // Save changes to storage
  useEffect(() => saveToStorage('products', products), [products]);
  useEffect(() => saveToStorage('price_history', priceHistory), [priceHistory]);
  useEffect(() => saveToStorage('orders', orders), [orders]);
  useEffect(() => saveToStorage('wholesale_inquiries', wholesaleInquiries), [wholesaleInquiries]);
  useEffect(() => saveToStorage('delivery_zones', deliveryZones), [deliveryZones]);
  useEffect(() => saveToStorage('coupons', coupons), [coupons]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('cart', cart), [cart]);
  useEffect(() => saveToStorage('saved_for_later', savedForLater), [savedForLater]);
  useEffect(() => saveToStorage('favorites', favorites), [favorites]);
  useEffect(() => saveToStorage('customer', customer), [customer]);
  useEffect(() => saveToStorage('admin_user', currentAdmin), [currentAdmin]);

  // Sync hash routing if user pastes or types a hash in browser
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        const parts = hash.split('/');
        const page = parts[0] || 'home';
        setActivePage(page);
        if (page === 'product' && parts[1]) {
          setActiveProductId(parts[1]);
        }
        if (page === 'category' && parts[1]) {
          setActiveCategorySlug(parts[1]);
        }
        if (page === 'track' && parts[1]) {
          setActiveOrderNo(parts[1]);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // initial check
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, options?: NavigateOptions) => {
    setActivePage(page);
    if (options?.productId) setActiveProductId(options.productId);
    if (options?.categorySlug) setActiveCategorySlug(options.categorySlug);
    if (options?.orderNo) setActiveOrderNo(options.orderNo);

    // Update browser hash cleanly
    let hash = `#/${page}`;
    if (page === 'product' && options?.productId) hash += `/${options.productId}`;
    if (page === 'category' && options?.categorySlug) hash += `/${options.categorySlug}`;
    if (page === 'track' && options?.orderNo) hash += `/${options.orderNo}`;
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: 'en' | 'ml') => {
    setLanguageState(lang);
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  };

  // Product CRUD
  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProduct, id };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Bulk Daily Price Updates
  const updateDailyPrices = (
    updates: { id: string; retailPrice: number; wholesalePrice: number; note?: string }[]
  ) => {
    const now = new Date();
    const formattedDate = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newHistoryRecords: PriceHistoryRecord[] = [];

    setProducts((prev) =>
      prev.map((prod) => {
        const update = updates.find((u) => u.id === prod.id);
        if (!update) return prod;

        let changeDirection: 'up' | 'down' | 'unchanged' = 'unchanged';
        if (update.retailPrice > prod.retailPrice) changeDirection = 'up';
        else if (update.retailPrice < prod.retailPrice) changeDirection = 'down';

        if (update.retailPrice !== prod.retailPrice || update.wholesalePrice !== prod.wholesalePrice) {
          newHistoryRecords.push({
            id: `ph-${Date.now()}-${prod.id}`,
            productId: prod.id,
            productName: prod.name,
            oldPrice: prod.retailPrice,
            newPrice: update.retailPrice,
            priceType: 'retail',
            unit: String(prod.unit),
            effectiveAt: now.toISOString().replace('T', ' ').slice(0, 16),
            changedBy: currentAdmin?.name || 'Admin',
            reason: update.note || 'Daily morning wholesale mandi revision',
          });
        }

        return {
          ...prod,
          previousRetailPrice: prod.retailPrice,
          previousWholesalePrice: prod.wholesalePrice,
          retailPrice: update.retailPrice,
          wholesalePrice: update.wholesalePrice,
          priceChangeDirection: changeDirection,
          lastPriceUpdate: formattedDate,
          priceUpdatedToday: true,
        };
      })
    );

    if (newHistoryRecords.length > 0) {
      setPriceHistory((prev) => [...newHistoryRecords, ...prev]);
    }

    setSettings((prev) => ({
      ...prev,
      lastMarketPriceUpdateTimestamp: formattedDate,
    }));
  };

  // Automatic Daily Market Price Engine Execution
  const triggerAutoDailyPriceUpdate = (options: {
    sourceHub?: string;
    intensity?: 'normal' | 'volatile' | 'surplus';
    showToast?: boolean;
  } = {}): AutoPriceUpdateResult => {
    const selectedHub = options.sourceHub || settings.activeMandiHub || 'Aluva Central Mandi Yard';
    const result = simulateDailyMarketPrices(products, {
      sourceHub: selectedHub,
      intensity: options.intensity || 'normal',
      changedBy: currentAdmin?.name ? `${currentAdmin.name} (Auto Mandi Sync)` : `Automated Mandi Engine (${selectedHub.split(' ')[0]})`,
    });

    setProducts(result.updatedProducts);

    if (result.newHistoryRecords.length > 0) {
      setPriceHistory((prev) => [...result.newHistoryRecords, ...prev]);
    }

    const todayDate = new Date().toISOString().split('T')[0];
    setSettings((prev) => ({
      ...prev,
      lastMarketPriceUpdateTimestamp: result.timestamp,
      autoPriceUpdateLastDate: todayDate,
      activeMandiHub: selectedHub,
      announcementText: `🌴 Mandi Price Update (${result.timestamp}): ${result.summary.droppedCount} items dropped today at ${selectedHub}. Guaranteed morning fresh wholesale rates.`,
    }));

    if (options.showToast !== false) {
      setAutoPriceNotice({
        visible: true,
        headline: result.summary.headline,
        droppedCount: result.summary.droppedCount,
        increasedCount: result.summary.increasedCount,
        mandiSource: selectedHub,
        timestamp: result.timestamp,
      });
    }

    return result;
  };

  // Background Automatic Price Check & Daily Update
  // Automatically runs if the daily price has not been refreshed today
  // or on an interval (default: every 6 hours or whenever day changes)
  useEffect(() => {
    if (settings.autoPriceUpdateEnabled === false) return;

    const todayDate = new Date().toISOString().split('T')[0];
    const lastUpdateDate = settings.autoPriceUpdateLastDate;

    // Check if not updated today
    if (!lastUpdateDate || lastUpdateDate !== todayDate) {
      // Automatic silent morning calibration
      const timer = setTimeout(() => {
        triggerAutoDailyPriceUpdate({
          sourceHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
          intensity: 'normal',
          showToast: true,
        });
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Set up automated background refresh check every 15 minutes
    const intervalId = setInterval(() => {
      const currentDay = new Date().toISOString().split('T')[0];
      if (settings.autoPriceUpdateLastDate !== currentDay) {
        triggerAutoDailyPriceUpdate({
          sourceHub: settings.activeMandiHub || 'Aluva Central Mandi Yard',
          intensity: 'normal',
          showToast: true,
        });
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [settings.autoPriceUpdateEnabled, settings.autoPriceUpdateLastDate, settings.activeMandiHub]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const saveForLater = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    setSavedForLater((prev) => {
      if (prev.some((i) => i.product.id === productId)) return prev;
      return [...prev, item];
    });
  };

  const moveToCart = (productId: string) => {
    const item = savedForLater.find((i) => i.product.id === productId);
    if (!item) return;
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== productId));
    addToCart(item.product, item.quantity);
  };

  // Cart totals
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const isWholesale = item.quantity >= item.product.minWholesaleQty || customer?.isWholesaleApproved;
    const unitPrice = isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Order must be at least ${settings.currencySymbol}${found.minOrder} to use ${found.code}`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (cartSubtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Delivery fee logic
  const isFreeDelivery = cartSubtotal >= selectedDeliveryZone.freeDeliveryThreshold;
  const deliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : selectedDeliveryZone.fee;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Orders
  const placeOrder = (
    orderData: Omit<Order, 'orderNo' | 'status' | 'statusTimeline' | 'createdAt'>
  ): Order => {
    const orderNo = `AV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      orderNo,
      status: 'Pending',
      statusTimeline: [
        {
          status: 'Pending',
          timestamp: now.toISOString().replace('T', ' ').slice(0, 16),
          note: 'Order submitted online. Verification in progress.',
        },
      ],
      createdAt: now.toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);

    // Deduct stock for placed products
    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = orderData.items.find((i) => i.productId === p.id);
        if (!orderedItem) return p;
        return {
          ...p,
          stock: Math.max(0, p.stock - orderedItem.quantity),
        };
      })
    );

    return newOrder;
  };

  const updateOrderStatus = (orderNo: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderNo !== orderNo) return order;
        return {
          ...order,
          status: newStatus,
          statusTimeline: [
            ...order.statusTimeline,
            {
              status: newStatus,
              timestamp: now,
              note: note || `Status updated to ${newStatus}`,
            },
          ],
        };
      })
    );
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Wholesale Inquiries
  const submitWholesaleInquiry = (
    inquiry: Omit<WholesaleInquiry, 'id' | 'status' | 'createdAt'>
  ) => {
    const id = `wi-${Date.now()}`;
    const newInquiry: WholesaleInquiry = {
      ...inquiry,
      id,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setWholesaleInquiries((prev) => [newInquiry, ...prev]);
  };

  const updateWholesaleInquiryStatus = (
    id: string,
    status: 'Pending' | 'Approved' | 'Rejected'
  ) => {
    setWholesaleInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
  };

  // Store Settings & Logistics
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateDeliveryZone = (id: string, updates: Partial<DeliveryZone>) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...updates } : z))
    );
  };

  const addCoupon = (newCoupon: Omit<Coupon, 'id'>) => {
    const id = `cpn-${Date.now()}`;
    setCoupons((prev) => [{ ...newCoupon, id }, ...prev]);
  };

  // Customer profile actions
  const updateCustomerProfile = (data: Partial<CustomerProfile>) => {
    setCustomer((prev) => (prev ? { ...prev, ...data } : null));
  };

  const loginAsDemoCustomer = (wholesale = false) => {
    setCustomer({
      id: wholesale ? 'cust-wholesale-01' : 'cust-retail-01',
      name: wholesale ? 'The Olive Tree Trattoria' : 'Sarah Jenkins',
      phone: '+1 (555) 782-9341',
      whatsapp: '15557829341',
      email: wholesale ? 'chef@olivetree.example' : 'sarah.j@example.com',
      address: wholesale ? '45 Marina Pier Road' : 'Apartment 4B, 110 River West Promenade',
      city: 'Metro City',
      isWholesaleApproved: wholesale,
      companyName: wholesale ? 'Olive Tree Hospitality Group' : undefined,
      savedAddresses: [
        wholesale ? '45 Marina Pier Road (Back loading bay)' : 'Apartment 4B, 110 River West Promenade',
        '88 Park Avenue, Suite 201',
      ],
    });
  };

  const logoutCustomer = () => setCustomer(null);

  // Admin Auth
  const adminLogin = (email: string, role: AdminRole = 'Super Admin', name?: string): boolean => {
    setCurrentAdmin({
      id: `admin-${Date.now()}`,
      name: name || (email.includes('@') ? email.split('@')[0] : 'Adam Staff'),
      email,
      role,
      active: true,
    });
    return true;
  };

  const adminLogout = () => {
    setCurrentAdmin(null);
  };

  const switchAdminRole = (role: AdminRole) => {
    if (currentAdmin) {
      setCurrentAdmin({ ...currentAdmin, role });
    }
  };

  const updateAdminInfo = (info: Partial<AdminUser>) => {
    setCurrentAdmin((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...info,
      };
    });
  };

  const addDailyProducePrice = (params: {
    productId: string;
    retailPrice: number;
    wholesalePrice: number;
    stock?: number;
    date?: string;
    note?: string;
    mandiHub?: string;
  }) => {
    const prod = products.find((p) => p.id === params.productId);
    if (!prod) return;

    const effectiveDate = params.date || new Date().toISOString().split('T')[0];
    const changeDirection =
      params.retailPrice > prod.retailPrice
        ? 'increased'
        : params.retailPrice < prod.retailPrice
        ? 'dropped'
        : 'unchanged';

    const now = new Date();
    const formattedTimestamp = `${effectiveDate} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== params.productId) return p;
        return {
          ...p,
          previousRetailPrice: p.retailPrice,
          previousWholesalePrice: p.wholesalePrice,
          retailPrice: params.retailPrice,
          wholesalePrice: params.wholesalePrice,
          stock: typeof params.stock === 'number' ? params.stock : p.stock,
          priceChangeDirection: changeDirection,
          lastPriceUpdate: formattedTimestamp,
          priceUpdatedToday: true,
        };
      })
    );

    const historyRecord: PriceHistoryRecord = {
      id: `ph-daily-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      oldPrice: prod.retailPrice,
      newPrice: params.retailPrice,
      priceType: 'retail',
      unit: String(prod.unit),
      effectiveAt: formattedTimestamp,
      changedBy: currentAdmin?.name || 'Super Admin',
      reason: params.note || `Daily morning rate entered by Super Admin (${params.mandiHub || 'Kerala Mandi'})`,
    };

    setPriceHistory((prev) => [historyRecord, ...prev]);

    setSettings((prev) => ({
      ...prev,
      lastMarketPriceUpdateTimestamp: formattedTimestamp,
    }));
  };

  // Smart reorder items from past orders
  const smartReorderItems = React.useMemo(() => {
    const productIds = new Set<string>();
    orders.forEach((o) => o.items.forEach((i) => productIds.add(i.productId)));
    return products.filter((p) => productIds.has(p.id));
  }, [orders, products]);

  return (
    <StoreContext.Provider
      value={{
        activePage,
        currentPage: activePage,
        activeProductId,
        activeCategorySlug,
        activeOrderNo,
        navigateTo,
        searchQuery,
        setSearchQuery,
        language,
        setLanguage,

        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        updateDailyPrices,
        triggerAutoDailyPriceUpdate,
        autoPriceNotice,
        dismissAutoPriceNotice,
        availableMandiHubs: KERALA_MANDI_HUBS,
        priceHistory,

        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedDeliveryZone,
        setSelectedDeliveryZone,

        orders,
        placeOrder,
        updateOrderStatus,
        lastPlacedOrder,

        favorites,
        toggleFavorite,
        isFavorite,

        wholesaleInquiries,
        submitWholesaleInquiry,
        updateWholesaleInquiryStatus,

        settings,
        updateSettings,
        deliveryZones,
        updateDeliveryZone,
        coupons,
        addCoupon,

        customer,
        updateCustomerProfile,
        loginAsDemoCustomer,
        logoutCustomer,

        currentAdmin,
        adminLogin,
        adminLogout,
        switchAdminRole,
        updateAdminInfo,
        addDailyProducePrice,

        smartReorderItems,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
