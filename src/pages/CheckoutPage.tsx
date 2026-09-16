import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  Building2,
  Phone,
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  QrCode,
  Smartphone,
  Lock,
  RefreshCw,
  Copy,
  Check,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DeliverySlot, OrderItem } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    appliedCoupon,
    deliveryZones,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    placeOrder,
    customer,
    updateCustomerProfile,
    settings,
    navigateTo,
  } = useStore();

  const standardDeliverySlots: DeliverySlot[] = [
    { id: 'slot-1', name: 'Early Morning Wholesale Run', timeRange: '05:00 AM - 07:30 AM', cutoffTime: '04:00 AM', isB2BExclusive: true },
    { id: 'slot-2', name: 'Morning Fresh Market Run', timeRange: '08:00 AM - 11:30 AM', cutoffTime: '07:00 AM' },
    { id: 'slot-3', name: 'Afternoon Standard Run', timeRange: '01:00 PM - 04:30 PM', cutoffTime: '12:00 PM' },
    { id: 'slot-4', name: 'Evening Kitchen Prep Run', timeRange: '05:30 PM - 08:30 PM', cutoffTime: '04:30 PM' },
  ];

  // Form states (prefilled if customer saved in profile/localStorage)
  const [name, setName] = useState(customer?.name || 'Firoz Nizam');
  const [phone, setPhone] = useState(customer?.phone || '9847012345');
  const [whatsapp, setWhatsapp] = useState(customer?.whatsapp || customer?.phone || '9847012345');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState(customer?.email || 'firoz@example.com');
  const [address, setAddress] = useState(customer?.address || 'Flat 4B, Marine Drive Enclave');
  const [landmark, setLandmark] = useState('Opposite Rainbow Bridge');
  const [companyName, setCompanyName] = useState(customer?.companyName || '');
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>(
    customer?.isWholesaleApproved ? 'wholesale' : 'retail'
  );
  const [selectedSlotId, setSelectedSlotId] = useState(standardDeliverySlots[1].id);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<
    'upi_online' | 'cash_on_delivery' | 'card_online' | 'net_banking' | 'store_pickup' | 'bank_transfer'
  >('upi_online');

  // UPI Online States
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [customerUpiId, setCustomerUpiId] = useState('firoznizam@okaxis');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card Online States
  const [cardNumber, setCardNumber] = useState('4532 8492 1029 4819');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardHolder, setCardHolder] = useState('Firoz Nizam');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('Federal Bank');

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'authorizing' | 'capturing' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Your basket is empty</h2>
        <p className="text-stone-500 text-sm">Add fresh vegetables from our morning mandi rate list to purchase.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
        >
          Return to Produce Catalog
        </button>
      </div>
    );
  }

  const selectedSlot = standardDeliverySlots.find((s) => s.id === selectedSlotId) || standardDeliverySlots[0];

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsapp(phone);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard?.writeText('adamvegetables@okhdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const executePurchase = () => {
    // Save profile for future convenience
    updateCustomerProfile({
      name,
      phone,
      whatsapp: sameAsPhone ? phone : whatsapp,
      email,
      address,
      companyName,
      isWholesaleApproved: orderType === 'wholesale' ? true : customer?.isWholesaleApproved,
    });

    const fullAddress = landmark ? `${address} (Near: ${landmark})` : address;

    const orderItems: OrderItem[] = cart.map((item) => {
      const isWholesale = item.quantity >= item.product.minWholesaleQty || customer?.isWholesaleApproved;
      const unitPrice = isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
      return {
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        unit: item.product.unit,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
        isWholesalePriceApplied: Boolean(isWholesale),
      };
    });

    const newOrder = placeOrder({
      customerName: name,
      customerPhone: phone,
      customerWhatsApp: sameAsPhone ? phone : whatsapp,
      customerEmail: email,
      customerType: orderType,
      deliveryAddress: paymentMethod === 'store_pickup' ? 'Self Pickup at Adam Vegetables Main Depot (Aluva Mandi Hub)' : fullAddress,
      deliveryZoneId: selectedDeliveryZone.id,
      deliverySlot: `${selectedSlot.name} (${selectedSlot.timeRange})`,
      preferredDeliveryDate: deliveryDate,
      paymentMethod,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee: paymentMethod === 'store_pickup' ? 0 : deliveryFee,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      total: paymentMethod === 'store_pickup' ? Math.max(0, cartSubtotal - discountAmount) : cartTotal,
      notes,
    });

    navigateTo('order-confirmation', { orderNo: newOrder.orderNo });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your recipient or contact name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter a valid phone number for delivery dispatch.');
      return;
    }
    if (paymentMethod !== 'store_pickup' && !address.trim()) {
      setErrorMessage('Please enter the delivery address and street or flat number.');
      return;
    }

    // Direct online payment simulation on the website
    if (paymentMethod === 'upi_online' || paymentMethod === 'card_online' || paymentMethod === 'net_banking') {
      setIsSubmitting(true);
      setPaymentStep('authorizing');

      setTimeout(() => {
        setPaymentStep('capturing');
      }, 700);

      setTimeout(() => {
        setPaymentStep('success');
      }, 1400);

      setTimeout(() => {
        setIsSubmitting(false);
        executePurchase();
      }, 2000);
      return;
    }

    // COD or Store Pickup or Bank Invoice
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      executePurchase();
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('cart')}
          className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Checkout & Delivery
          </h1>
          <p className="text-xs text-stone-500">
            Guest checkout enabled • No account needed to place your order
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="font-black text-stone-900 text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>1. Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe / Chef Marco"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Company / Restaurant (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Ocean Cafe or Home"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (sameAsPhone) setWhatsapp(e.target.value);
                  }}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-700">WhatsApp Number</label>
                  <label className="flex items-center gap-1 text-[11px] text-stone-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600"
                    />
                    <span>Same as phone</span>
                  </label>
                </div>
                <input
                  type="tel"
                  disabled={sameAsPhone}
                  value={sameAsPhone ? phone : whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="For instant receipt and live tracking"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs disabled:opacity-60"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address & Zone */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="font-black text-stone-900 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>2. Delivery Zone & Address</span>
            </h2>

            {/* Zone Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">Select Delivery Zone</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {deliveryZones.map((zone) => {
                  const isSelected = selectedDeliveryZone.id === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedDeliveryZone(zone)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-100'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-stone-900">{zone.name}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white text-emerald-800">
                          {settings.currencySymbol}{zone.fee}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1">
                        Free over {settings.currencySymbol}{zone.freeDeliveryThreshold}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 text-xs pt-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Street Address, Building & Flat/Door *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 142 Palm Grove Ave, Apt 4B, Central District"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nearest Landmark / Instructions
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Blue Mosque, Back alley entrance for restaurant crate delivery"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Time Slot & Schedule */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="font-black text-stone-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>3. Preferred Delivery Slot</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Delivery Window</label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800"
                >
                  {standardDeliverySlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.name} ({slot.timeRange})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Payment Method */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-stone-900 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>4. Payment & Website Checkout</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                256-Bit SSL Encrypted
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi_online')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'upi_online'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-100 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                    UPI
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'upi_online'}
                    onChange={() => setPaymentMethod('upi_online')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <p className="font-black text-stone-900">Instant UPI / QR</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">GPay, PhonePe, Paytm, BHIM</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card_online')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'card_online'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-100 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-6 h-6 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card_online'}
                    onChange={() => setPaymentMethod('card_online')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <p className="font-black text-stone-900">Debit / Credit Card</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">RuPay, Visa, Mastercard</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('net_banking')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'net_banking'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-100 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-6 h-6 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'net_banking'}
                    onChange={() => setPaymentMethod('net_banking')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <p className="font-black text-stone-900">Net Banking</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Federal, SBI, SIB, HDFC</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-100 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-6 h-6 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <p className="font-black text-stone-900">Cash / UPI on Delivery</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Pay when boxes arrive</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('store_pickup')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'store_pickup'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-100 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-6 h-6 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'store_pickup'}
                    onChange={() => setPaymentMethod('store_pickup')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <p className="font-black text-stone-900">Mandi Depot Pickup</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Zero fee, Aluva hub</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-100 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <p className="font-black text-stone-900">Wholesale NEFT/RTGS</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Official GST Tax Invoice</p>
                </div>
              </button>
            </div>

            {/* Dynamic Payment Details Area */}
            {paymentMethod === 'upi_online' && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Dynamic QR Code */}
                  <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs shrink-0 text-center">
                    <div className="w-28 h-28 bg-emerald-950 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                      <QrCode className="w-20 h-20 text-emerald-300" />
                      <span className="text-[9px] font-black uppercase text-emerald-100 mt-1">
                        Scan & Pay
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-emerald-900 mt-1.5">
                      ₹{cartTotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-stone-900">Adam Vegetables Official UPI ID</span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedUpi ? 'Copied!' : 'Copy UPI ID'}
                      </button>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-mono text-xs font-bold text-stone-800 flex items-center justify-between">
                      <span>adamvegetables@okhdfcbank</span>
                      <span className="text-[10px] text-emerald-700 font-sans font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                        Verified Mandi Merchant
                      </span>
                    </div>

                    <div className="pt-1">
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Your UPI ID / Mobile (GPay / PhonePe / Paytm / BHIM)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customerUpiId}
                          onChange={(e) => setCustomerUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi or username@okaxis"
                          className="flex-1 p-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <span className="px-3 py-2 bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ready
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Clicking the purchase button below authorizes payment directly on this website.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'card_online' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-stone-900">Card Credentials</span>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500">
                    <span className="px-1.5 py-0.5 bg-white border border-stone-200 rounded font-bold">RuPay</span>
                    <span className="px-1.5 py-0.5 bg-white border border-stone-200 rounded font-bold">VISA</span>
                    <span className="px-1.5 py-0.5 bg-white border border-stone-200 rounded font-bold">Mastercard</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 4819"
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono text-xs font-bold focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Firoz Nizam"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono text-xs font-bold focus:border-emerald-600 focus:outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono text-xs font-bold focus:border-emerald-600 focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'net_banking' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <p className="font-extrabold text-stone-900">Select Bank for Direct Debit</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Federal Bank', 'State Bank of India', 'South Indian Bank', 'HDFC Bank', 'ICICI Bank', 'Canara Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all text-xs ${
                        selectedBank === bank
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-500'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'cash_on_delivery' && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center gap-3">
                <Banknote className="w-5 h-5 text-emerald-700 shrink-0" />
                <p>
                  You can pay cash or scan the delivery executive's UPI QR code with any app upon delivery of the produce boxes.
                </p>
              </div>
            )}

            {paymentMethod === 'store_pickup' && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="font-bold text-stone-900">Adam Vegetables Aluva Mandi Depot</p>
                  <p className="text-stone-500 text-[11px]">Near Aluva Railway Station & Mandi Yard, Ernakulam, Kerala (PIN: 683101)</p>
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
                <p className="font-bold text-stone-900">Commercial Bank Account Details</p>
                <p className="font-mono text-[11px]">Adam Vegetables Agro Foods Pvt Ltd</p>
                <p className="font-mono text-[11px]">A/C: 50200084920194 • IFSC: HDFC0001248 • Aluva Branch</p>
              </div>
            )}

            {/* Special Instructions Note */}
            <div className="pt-2 text-xs">
              <label className="block font-bold text-stone-700 mb-1">
                Order Notes / Cutting Preferences (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please pick slightly green bananas; ring bell twice upon arrival."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Review Sticky Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5 sticky top-36">
            <h3 className="font-black text-stone-900 text-base pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Basket Summary</span>
              <span className="text-xs bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </h3>

            {/* Mini items list */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {cart.map(({ product, quantity }) => {
                const isWholesale = quantity >= product.minWholesaleQty;
                const price = isWholesale ? product.wholesalePrice : product.retailPrice;
                return (
                  <div key={product.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-stone-800 truncate">{product.name}</p>
                      <p className="text-[10px] text-stone-400">
                        {quantity} {product.unit} × {settings.currencySymbol}{price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-stone-900">
                      {settings.currencySymbol}{(price * quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pricing numbers */}
            <div className="border-t border-stone-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-bold text-stone-900">
                  {settings.currencySymbol}{cartSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery:</span>
                <span className="font-bold text-stone-900">
                  {paymentMethod === 'store_pickup' ? 'Free (Pickup)' : deliveryFee === 0 ? 'Free Delivery' : `${settings.currencySymbol}${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount:</span>
                  <span>-{settings.currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-stone-200 pt-3 flex items-baseline justify-between">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Amount Due</p>
                <p className="text-2xl font-black text-stone-900">
                  {settings.currencySymbol}{paymentMethod === 'store_pickup' ? Math.max(0, cartSubtotal - discountAmount).toFixed(2) : cartTotal.toFixed(2)}
                </p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-bold">
                Mandi Guaranteed
              </span>
            </div>

            {/* Direct Purchase Execution CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Website Purchase...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'upi_online'
                      ? `Execute Purchase & Pay ₹${cartTotal.toFixed(2)} via UPI`
                      : paymentMethod === 'card_online'
                      ? `Execute Purchase & Pay ₹${cartTotal.toFixed(2)} by Card`
                      : paymentMethod === 'net_banking'
                      ? `Execute Purchase & Pay ₹${cartTotal.toFixed(2)}`
                      : paymentMethod === 'store_pickup'
                      ? 'Execute Purchase (Depot Pickup)'
                      : `Execute Purchase & Confirm Order (₹${cartTotal.toFixed(2)})`}
                  </span>
                </>
              )}
            </button>

            <div className="space-y-1 text-center">
              <p className="text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Instant order confirmation & tracking on this website
              </p>
              <p className="text-[10px] text-stone-400">
                You will receive full digital receipt, order number, and packing status updates.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Online Payment Processing Overlay Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              {paymentStep === 'success' ? (
                <CheckCircle className="w-9 h-9 text-emerald-600 animate-bounce" />
              ) : (
                <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-stone-900">
                {paymentStep === 'authorizing'
                  ? 'Connecting to Payment Switch...'
                  : paymentStep === 'capturing'
                  ? `Authorizing ₹${cartTotal.toFixed(2)}...`
                  : 'Payment Verified & Confirmed!'}
              </h3>
              <p className="text-xs text-stone-500">
                {paymentStep === 'success'
                  ? 'Generating official invoice and scheduling morning mandi crate...'
                  : 'Please do not close this window while we execute your purchase.'}
              </p>
            </div>

            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                style={{
                  width:
                    paymentStep === 'authorizing'
                      ? '35%'
                      : paymentStep === 'capturing'
                      ? '75%'
                      : '100%',
                }}
              ></div>
            </div>

            <p className="text-[10px] text-stone-400 font-mono">
              Transaction Ref: ADV-PAY-{Date.now().toString().slice(-6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
