import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
  HelpCircle,
  Send,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const AboutContactPage: React.FC = () => {
  const { settings, deliveryZones, navigateTo } = useStore();

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const handleWhatsAppContact = () => {
    const text = `Hello ${settings.shopName}! 👋\nI have a general enquiry regarding your fresh produce delivery.`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const faqs = [
    {
      q: 'How does daily pricing work at Adam Vegetables?',
      a: 'Unlike standard supermarkets that mark up prices and keep them static for weeks, our procurement team inspects fresh morning arrivals at regional wholesale mandis every morning at 05:00 AM. Prices are updated live on our platform by 05:30 AM to pass genuine market savings directly to you.',
    },
    {
      q: 'What is the difference between Retail and Wholesale pricing?',
      a: 'Retail pricing applies to standard kitchen orders (typically 1kg to 9kg). Wholesale pricing automatically unlocks when you order commercial batch quantities (typically 10kg or full crates) or register an approved restaurant/bistro account with us.',
    },
    {
      q: 'Can I order directly through WhatsApp?',
      a: 'Yes! You can browse our online catalog, click "Order via WhatsApp", and an itemized message will be generated automatically. You can also send a photo of your handwritten grocery list or restaurant prep sheet to our WhatsApp desk.',
    },
    {
      q: 'What are your delivery time windows?',
      a: 'We operate 4 scheduled delivery runs daily: Early Morning B2B Kitchen Run (05:00 AM - 07:30 AM), Morning Fresh Run (08:00 AM - 11:30 AM), Afternoon Delivery (01:00 PM - 04:30 PM), and Evening Prep Run (05:30 PM - 08:30 PM).',
    },
    {
      q: 'What is your freshness and quality guarantee?',
      a: 'If any produce arrives damaged, overripe, or below our grade-A standard, notify us via WhatsApp with a photo within 6 hours of delivery. We will immediately issue a replacement or refund with zero hassle.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Brand Section */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/80 px-3 py-1 rounded-full border border-emerald-600/40">
            About Our Brand & Operations
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Rooted in Soil, Driven by Honest Morning Pricing
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Founded with a singular commitment: delivering farm-harvested, pesticide-monitored vegetables and fruits to homes, restaurants, and retail grocers within hours of picking.
          </p>
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Triple-Point Quality Inspection</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every crate undergoes rigorous sorting at the depot: harvest grading, moisture inspection, and careful sanitization before packing.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Dawn 04:30 AM Dispatch</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Commercial restaurant orders leave our central depot before sunrise, guaranteeing chef prep readiness prior to breakfast shifts.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">WhatsApp Native Dispatch</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            No robotic call centers. Speak directly with experienced produce buyers and dispatch managers on WhatsApp for instant solutions.
          </p>
        </div>
      </div>

      {/* Contact Info & Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900">Contact & Depots</h2>
            <p className="text-xs text-stone-500 mt-1">
              Reach our customer support or wholesale dispatch desk directly.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-emerald-800">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 mb-0.5">Central Wholesale Depot</strong>
                <p className="text-stone-600 leading-relaxed">{settings.address}</p>
                <span className="inline-block mt-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                  Pickup point open 05:00 AM – 09:00 PM
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-emerald-800">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 mb-0.5">Direct Phone Line</strong>
                <a href={`tel:${settings.phoneNumber}`} className="text-stone-600 hover:text-emerald-700 font-bold">
                  {settings.phoneNumber}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-[#25D366]">
                <MessageCircle className="w-4 h-4 fill-emerald-600" />
              </div>
              <div>
                <strong className="block text-stone-900 mb-0.5">Official WhatsApp Desk</strong>
                <a
                  href={buildWhatsAppUrl(settings.whatsappNumber, 'Hello Adam Vegetables!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-800 hover:underline font-bold"
                >
                  {settings.whatsappNumber}
                </a>
                <p className="text-[10px] text-stone-400 mt-0.5">Avg. response under 5 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-emerald-800">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 mb-0.5">Commercial Accounts Email</strong>
                <p className="text-stone-600 font-bold">{settings.email}</p>
              </div>
            </div>
          </div>

          {/* Depot Map Placeholder */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-stone-800">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Depot Location & Loading Bay</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Main Wholesale Yard • Gate #4 Commercial Produce Ingress
            </p>
            <div className="h-32 rounded-xl bg-stone-200/80 flex items-center justify-center text-xs text-stone-500 font-semibold border border-stone-300">
              Interactive Map Frame: {settings.googleMapsEmbedUrl ? 'Google Maps Embedded' : 'Depot Bay Coordinates Verified'}
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900">Send an Enquiry</h2>
            <p className="text-xs text-stone-500 mt-1">
              Have a special sourcing requirement or wedding/event crate inquiry? Drop us a note.
            </p>
          </div>

          {formSent ? (
            <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
              <Sparkles className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950">Thank you for writing to us!</h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                We have received your message and will respond via phone or WhatsApp shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Message / Produce Request *</label>
                <textarea
                  rows={4}
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tell us what you're looking for..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Chat on WhatsApp Directly</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <section className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Produce, Pricing & Logistics Answers
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-stone-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-stone-900 gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-700' : ''}`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
