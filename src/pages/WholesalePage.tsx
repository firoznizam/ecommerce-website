import React, { useState } from 'react';
import {
  Building2,
  Truck,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  MessageCircle,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWholesaleEnquiryWhatsAppUrl } from '../utils/whatsapp';

export const WholesalePage: React.FC = () => {
  const { settings, submitWholesaleInquiry, navigateTo } = useStore();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState<any>('Restaurant');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [estimatedDailyVolumeKg, setEstimatedDailyVolumeKg] = useState<number>(50);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !phone) return;

    submitWholesaleInquiry({
      companyName,
      contactPerson,
      phone,
      whatsapp: whatsapp || phone,
      email,
      businessType,
      deliveryArea,
      estimatedDailyVolumeKg,
      notes,
    });

    setSubmitted(true);
  };

  const handleWhatsAppEnquiry = () => {
    const url = getWholesaleEnquiryWhatsAppUrl(
      companyName,
      businessType,
      String(estimatedDailyVolumeKg),
      settings
    );
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold border border-emerald-600/40">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Dedicated B2B Produce Supply</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Wholesale Produce Sourcing Built for Food Businesses
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Direct farmer crate allocations, transparent morning wholesale auction benchmarking, and dependable dawn deliveries at 4:30 AM.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => navigateTo('wholesale-quick-order')}
              className="px-6 py-3 rounded-2xl bg-white text-emerald-950 font-black text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Launch Quick Order Sheet</span>
            </button>
            <button
              onClick={handleWhatsAppEnquiry}
              className="px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-black text-sm transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>Direct WhatsApp Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier Explanation & Rules */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Pricing Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            How Our Wholesale Tier Pricing Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tiers are configured transparently and trigger automatically in your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-sm">
              Tier 1
            </div>
            <h3 className="font-bold text-base text-stone-900">Retail Standard (1 – 9 kg)</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Standard retail rate for home kitchens and light prep. Freshly hand-picked and cleaned.
            </p>
            <ul className="text-xs text-stone-500 space-y-1.5 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free delivery over {settings.currencySymbol}{settings.retailFreeDeliveryThreshold}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Standard daytime delivery slots
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-300 shadow-xs space-y-3 relative">
            <span className="absolute top-4 right-4 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Most Popular
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              Tier 2
            </div>
            <h3 className="font-bold text-base text-emerald-950">Wholesale Tier (10 – 49 kg)</h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Designed for busy bistros, cafes, and daily dining rooms. Significant rate drops on root staples and greens.
            </p>
            <ul className="text-xs text-emerald-800 space-y-1.5 pt-2 border-t border-emerald-200/60">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 15% to 30% lower than retail rates
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 5:30 AM early kitchen drop
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
              Tier 3
            </div>
            <h3 className="font-bold text-base text-stone-900">Commercial Bulk (50kg+ / Crates)</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Full crates, sacks, and pallet loads for supermarkets, hotels, and institutional caterers.
            </p>
            <ul className="text-xs text-stone-500 space-y-1.5 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Direct depot auction pricing
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dedicated account manager
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Application / Enquiry Form */}
      <section className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-black text-stone-900">
              Apply for a Wholesale Account
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Complete this quick form to receive our commercial trade discounts and priority early morning dispatch.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950">Application Received!</h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                Thank you, <strong>{contactPerson || companyName}</strong>. Our wholesale dispatch team will review your details and contact you on WhatsApp ({whatsapp || phone}) within 2 hours with account approval and rate sheets.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => navigateTo('wholesale-quick-order')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  Try Wholesale Quick Order Grid Now
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Company / Establishment Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Marina Grand Hotel / Luigi's Trattoria"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Chef Marco / Store Manager"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="For fast rate alerts"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="purchasing@company.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:border-emerald-600 text-xs"
                  >
                    <option value="Restaurant">Restaurant / Bistro</option>
                    <option value="Hotel">Hotel / Resort</option>
                    <option value="Grocery Store">Grocery / Supermarket</option>
                    <option value="Caterer">Event Caterer</option>
                    <option value="Other">Other Business</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Delivery Area / Zone</label>
                  <input
                    type="text"
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    placeholder="e.g. Downtown Central / Zone 2"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Est. Daily Produce Volume</label>
                  <input
                    type="number"
                    min="10"
                    value={estimatedDailyVolumeKg}
                    onChange={(e) => setEstimatedDailyVolumeKg(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Special Requirements or Crop Focus</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., We need 20kg of washed carrots daily, delivered before 6:00 AM..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Inquire via WhatsApp Instead</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Wholesale Application</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
