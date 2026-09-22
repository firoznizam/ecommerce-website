export type UnitType = 'kg' | '500g' | '250g' | 'piece' | 'bunch' | 'pack' | 'box' | 'crate' | 'sack';

export interface WholesaleTier {
  minQty: number;
  maxQty?: number;
  price: number;
  label?: string;
}

export interface Product {
  id: string;
  name: string;
  malayalamName?: string;
  arabicName?: string;
  slug: string;
  category: string;
  images: string[];
  description: string;
  origin?: string;
  freshnessNotes?: string;
  storageTips?: string;
  unit: UnitType | string;
  unitWeightKg?: number; // approx kg per unit for logistics
  retailPrice: number;
  wholesalePrice: number;
  minWholesaleQty: number;
  wholesaleTiers: WholesaleTier[];
  stock: number;
  lowStockThreshold: number;
  active: boolean;
  isFeatured?: boolean;
  isSeasonal?: boolean;
  isOrganic?: boolean;
  altNames?: string[]; // e.g. ["Batata", "Alu", "Spud"]
  lastPriceUpdate: string; // ISO or formatted date
  priceUpdatedToday: boolean;
  previousRetailPrice?: number;
  previousWholesalePrice?: number;
  priceChangeDirection?: 'up' | 'down' | 'unchanged';
}

export interface Category {
  id: string;
  name: string;
  malayalamName?: string;
  arabicName?: string;
  slug: string;
  image: string;
  description: string;
  active: boolean;
  itemCount?: number;
}

export interface PriceHistoryRecord {
  id: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  priceType: 'retail' | 'wholesale';
  unit: string;
  effectiveAt: string;
  changedBy: string;
  reason?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isWholesalePriceApplied: boolean;
}

export interface Order {
  orderNo: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerWhatsApp: string;
  customerEmail?: string;
  customerType: 'retail' | 'wholesale';
  deliveryAddress: string;
  deliveryZoneId: string;
  deliverySlot: string;
  preferredDeliveryDate: string;
  notes?: string;
  paymentMethod: 'cash_on_delivery' | 'store_pickup' | 'bank_transfer' | 'card_online' | 'upi_online' | 'net_banking';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
}

export interface WholesaleInquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  businessType: 'Restaurant' | 'Hotel' | 'Grocery Store' | 'Caterer' | 'Supermarket' | 'Other';
  deliveryArea: string;
  estimatedDailyVolumeKg: number;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  areas: string[];
  fee: number;
  minOrderRetail: number;
  minOrderWholesale: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryWindow: string;
  active: boolean;
}

export interface DeliverySlot {
  id: string;
  name: string;
  timeRange: string;
  cutoffTime: string;
  isB2BExclusive?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  active: boolean;
  description: string;
}

export interface StoreSettings {
  shopName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string; // international digits without plus, e.g. 15553829428
  email: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  googleMapsEmbedQuery: string;
  openingHours: string;
  wholesaleOperatingHours: string;
  currencySymbol: string;
  currencyCode: string;
  announcementText: string;
  announcementActive: boolean;
  retailFreeDeliveryThreshold: number;
  defaultWholesaleMinOrder: number;
  lastMarketPriceUpdateTimestamp: string;
  autoPriceUpdateEnabled?: boolean;
  autoPriceUpdateIntervalMinutes?: number; // e.g. 60 or 720
  autoPriceUpdateLastDate?: string; // YYYY-MM-DD
  activeMandiHub?: string;
}

export type AdminRole = 'Super Admin' | 'Manager' | 'Order Staff' | 'Inventory Staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  phone?: string;
  shift?: string;
  mandiHub?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customNotes?: string;
}
