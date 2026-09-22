import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  LogOut,
  LogIn,
  CheckCircle2,
  Package,
  ArrowRight,
  ExternalLink,
  Edit2,
  Calendar,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { t } from '../utils/translations';

export const AccountPage: React.FC = () => {
  const {
    customer,
    updateCustomerProfile,
    loginAsDemoCustomer,
    logoutCustomer,
    currentAdmin,
    orders,
    settings,
    navigateTo,
    language,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(customer?.address || '');

  const customerOrders = orders.filter(
    (o) =>
      customer &&
      (o.customerPhone === customer.phone ||
        o.customerEmail === customer.email ||
        o.customerName === customer.name)
  );

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer && addressInput.trim()) {
      updateCustomerProfile({ address: addressInput.trim() });
      setEditingAddress(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {customer ? customer.name.charAt(0) : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">
                {customer ? customer.name : 'Welcome, Customer!'}
              </h1>
              {customer?.isWholesaleApproved && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-black text-[10px] uppercase tracking-wider">
                  Wholesale B2B
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              {customer ? `${customer.phone} • ${customer.email || 'No email registered'}` : 'Manage your orders, deliveries, and wholesale account.'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {customer ? (
            <button
              onClick={logoutCustomer}
              className="px-3.5 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAsDemoCustomer(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
              >
                Retail Buyer Profile
              </button>
              <button
                onClick={() => loginAsDemoCustomer(true)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-xs"
              >
                Wholesale Hotel Account
              </button>
            </div>
          )}

          {/* Staff Login shortcut */}
          <button
            onClick={() => navigateTo('admin-dashboard')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentAdmin ? 'Open Staff Dashboard' : 'Staff / Admin Sign In'}</span>
          </button>
        </div>
      </div>

      {/* Super Admin Control Section Banner */}
      {currentAdmin && (
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 text-white rounded-3xl p-5 border border-emerald-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-700/80 text-emerald-200 border border-emerald-500/40 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Super Admin Control Section</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-black uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Logged in as <strong>{currentAdmin.name}</strong> ({currentAdmin.role}) • {currentAdmin.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('admin-dashboard')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>+ Add Daily Price</span>
            </button>
            <button
              onClick={() => navigateTo('admin-dashboard')}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Info & Mandi Rates</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-emerald-700 text-emerald-800 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Customer Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-emerald-700 text-emerald-800 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({customerOrders.length || orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'addresses'
              ? 'border-emerald-700 text-emerald-800 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-stone-900">Personal & Delivery Details</h2>
            {customer ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 font-medium">Full Name</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{customer.name}</p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 font-medium">WhatsApp / Phone</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{customer.phone}</p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 font-medium">Email Address</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{customer.email || 'Not added'}</p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 font-medium">Account Type</span>
                  <p className="font-bold text-emerald-800 text-sm mt-0.5">
                    {customer.isWholesaleApproved ? `Wholesale Business (${customer.companyName || 'B2B Client'})` : 'Retail Daily Shopper'}
                  </p>
                </div>
                <div className="sm:col-span-2 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 font-medium">Primary Delivery Address</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{customer.address}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-stone-600">No account is currently active.</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => loginAsDemoCustomer(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                  >
                    Load Sample Retail Customer
                  </button>
                  <button
                    onClick={() => loginAsDemoCustomer(true)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-200 font-bold text-xs"
                  >
                    Load B2B Restaurant Customer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Wholesale Card */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-700 text-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                Kerala Vegetable B2B
              </span>
              <h3 className="text-lg font-black text-white">Wholesale Hotel & Catering Hub</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Registered hotels, canteens, and supermarkets get bulk morning auction rates, priority crate packing, and automated invoicing.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => navigateTo('wholesale')}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs"
              >
                Commercial Inquiry Form
              </button>
              <button
                onClick={() => navigateTo('wholesale-quick-order')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs transition-colors"
              >
                Wholesale Quick-Order Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-stone-900">Your Recent Produce Orders</h2>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {(customerOrders.length > 0 ? customerOrders : orders).map((order) => (
              <div key={order.orderNo} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-sm">#{order.orderNo}</span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                    <span className="text-stone-400 font-medium">({order.items.length} items)</span>
                  </div>
                  <p className="text-stone-600">
                    Slot: {order.deliverySlot} • Delivered to: {order.deliveryAddress}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block font-black text-stone-900 text-sm">
                      {settings.currencySymbol}{order.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">
                      {order.paymentMethod.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <button
                    onClick={() => navigateTo('order-tracking', { orderNo: order.orderNo })}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-800 font-bold transition-colors"
                  >
                    Track Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Addresses */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-stone-900">Saved Delivery Addresses</h2>
            <button
              onClick={() => setEditingAddress(!editingAddress)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              {editingAddress ? 'Cancel' : '+ Update Address'}
            </button>
          </div>

          {editingAddress && (
            <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-700">Enter New Delivery Address:</label>
              <textarea
                rows={2}
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="House No, Street, Landmark, Ernakulam, Kerala"
                className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                Save Delivery Address
              </button>
            </form>
          )}

          <div className="space-y-3">
            {customer?.savedAddresses?.map((addr, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-stone-900 text-xs">
                    {idx === 0 ? 'Primary Delivery Address' : `Secondary Location ${idx}`}
                  </span>
                  <p className="text-xs text-stone-600 mt-0.5">{addr}</p>
                </div>
              </div>
            )) || (
              <p className="text-xs text-stone-500">No saved addresses yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
