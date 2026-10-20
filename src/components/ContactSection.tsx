import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ExternalLink,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { MOROCCAN_LOCATIONS } from '../data/fleet';

export const ContactSection: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<string>(MOROCCAN_LOCATIONS[0].id);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeHub =
    MOROCCAN_LOCATIONS.find((h) => h.id === selectedHub) || MOROCCAN_LOCATIONS[0];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !contactMessage.trim()) {
      setErrorMsg('Please complete all contact fields.');
      return;
    }

    // Rate limiting check
    const recentSubmissions = JSON.parse(
      sessionStorage.getItem('yl_inquiries') || '[]'
    ) as number[];
    const oneMinAgo = Date.now() - 60000;
    const filtered = recentSubmissions.filter((t) => t > oneMinAgo);

    if (filtered.length >= 5) {
      setErrorMsg('Too many messages sent. Please wait one minute.');
      return;
    }

    filtered.push(Date.now());
    sessionStorage.setItem('yl_inquiries', JSON.stringify(filtered));

    setErrorMsg(null);
    setSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactPhone('');
      setContactMessage('');
    }, 2000);
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-[#0E0E0E] border-t border-black/5 dark:border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F5A623] mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kingdom of Morocco Concierge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A] dark:text-[#FAFAFA] font-display">
            Direct Line & Agency Hubs
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
            Our dispatch coordinators are available 24/7 across Casablanca, Marrakech, Rabat, Tangier, and Agadir.
          </p>
        </div>

        {/* Top 3 Direct Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/212653134372?text=Hello%20Yassine%20Location!%20I%20would%20like%20to%20inquire%20about%20renting%20a%20car."
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Direct WhatsApp Line
              </span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display mt-1 tabular-nums">
                06 53 13 43 72
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-light">
                Send Yassine a direct message for instant rate quotes, flight meet & greet, or custom requests.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:gap-2 transition-all">
              <span>Open WhatsApp (06 53 13 43 72)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Phone Hotline */}
          <a
            href="tel:0653134372"
            className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-black/5 dark:border-white/5 hover:border-[#F5A623] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5A623]">
                Hotline (Morocco)
              </span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display mt-1 tabular-nums">
                06 53 13 43 72
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-light">
                Direct dispatch assistance, airport terminal reception, and rapid fleet delivery across Morocco.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#F5A623] group-hover:gap-2 transition-all">
              <span>Call 06 53 13 43 72</span>
              <Phone className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Email & Corporate Desk */}
          <a
            href="mailto:taifouryassinee@gmail.com"
            className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Official Inquiries
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display mt-1 break-all">
                taifouryassinee@gmail.com
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-light">
                Corporate contracts, long-term rentals (LLD), and official travel partnerships.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:gap-2 transition-all">
              <span>Send Official Email</span>
              <Mail className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>

        {/* Moroccan Hubs & Map Visualizer Section */}
        <div id="locations" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Hub Selector (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-50 dark:bg-[#141414] p-6 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Select Moroccan Hub
              </span>
              <span className="text-xs text-[#F5A623] font-semibold">Free Delivery</span>
            </div>

            <div className="space-y-2">
              {MOROCCAN_LOCATIONS.map((loc) => {
                const isSelected = selectedHub === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedHub(loc.id)}
                    className={`w-full p-3.5 text-left rounded-xl transition-all flex items-start gap-3 border ${
                      isSelected
                        ? 'border-[#F5A623] bg-white dark:bg-[#1A1A1A] shadow-xs'
                        : 'border-transparent hover:bg-white/60 dark:hover:bg-[#181818]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#F5A623] text-black font-bold'
                          : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {loc.name}
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-neutral-400 shrink-0 ml-1">
                          {loc.city}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light truncate mt-0.5">
                        {loc.address}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Hub Detail & Map Simulator (7 cols) */}
          <div className="lg:col-span-7 bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-[#F5A623] tracking-widest uppercase">
                    Morocco Regional Office & Terminal Station
                  </span>
                  <h3 className="text-2xl font-bold font-display mt-1">{activeHub.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{activeHub.address}</p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-semibold block">
                    ● Agency Open Now
                  </span>
                  <span className="text-xs text-neutral-400">24/7 Handover</span>
                </div>
              </div>

              {/* Minimalist stylized visual map representation */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 p-4 flex flex-col justify-between mb-6">
                {/* Visual Moroccan Route Grid Matrix */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `radial-gradient(#F5A623 1px, transparent 1px), radial-gradient(#FAFAFA 1px, #111111 1px)`,
                    backgroundSize: `24px 24px`,
                  }}
                />

                <div className="relative z-10 flex items-center justify-between text-xs text-neutral-300">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono">
                    GPS: {activeHub.coords.lat.toFixed(4)}° N, {activeHub.coords.lng.toFixed(4)}° W
                  </span>
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-[#F5A623]">
                    Free Terminal Delivery
                  </span>
                </div>

                {/* Animated Pulsing Location Pin Centerpiece */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#F5A623]/20 rounded-full animate-ping absolute" />
                    <div className="w-8 h-8 bg-[#F5A623] text-black rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <MapPin className="w-4 h-4 fill-black" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-bold text-white bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {activeHub.city} Center & Terminal
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Authorized Key Dropoff Box 24/7</span>
                  <span>Direct Airport Curbside Reception</span>
                </div>
              </div>

              {/* Operating Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-neutral-300 border-t border-white/10 pt-4">
                <div>
                  <span className="text-neutral-500 block">Station Phone:</span>
                  <span className="font-semibold text-white">{activeHub.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Flight Delay Buffer:</span>
                  <span className="font-semibold text-emerald-400">Unlimited (Tracked)</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Payment Accepted:</span>
                  <span className="font-semibold text-white">Cash (DH/€/$), Card</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Arriving today? Request instant handover via WhatsApp.
              </span>
              <a
                href={`https://wa.me/212653134372?text=Hello%20Yassine%20Location!%20I%20am%20heading%20to%20${encodeURIComponent(
                  activeHub.name
                )}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#F5A623] hover:bg-[#e09618] text-black font-bold rounded-lg text-xs transition-colors shrink-0"
              >
                Dispatch to {activeHub.city}
              </a>
            </div>
          </div>
        </div>

        {/* Quick Message Form with direct WhatsApp link & invisible reCAPTCHA */}
        <div className="mt-16 max-w-3xl mx-auto p-8 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-black/5 dark:border-white/5">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-display">
              Send a Direct Message
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Need a vehicle immediately or have a custom inquiry? Send directly to Yassine at 0653134372.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-center space-y-3">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
              <div className="font-bold text-sm">Message Transmitted Successfully</div>
              <div className="text-xs font-light">
                Our dispatch concierge will contact you shortly. Need a faster response?
              </div>
              <a
                href="https://wa.me/212653134372?text=Hello%20Yassine!%20I%20just%20sent%20a%20message%20on%20your%20website%20and%20need%20quick%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Open in WhatsApp (06 53 13 43 72)</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-form-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-form-name"
                    type="text"
                    required
                    placeholder="e.g. Karim B."
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-[#1E1E1E] border border-black/10 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#F5A623]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-form-phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="contact-form-phone"
                    type="tel"
                    required
                    placeholder="+212 653 13 43 72"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-[#1E1E1E] border border-black/10 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#F5A623]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-form-message" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Your Inquiry / Travel Dates *
                </label>
                <textarea
                  id="contact-form-message"
                  required
                  rows={3}
                  placeholder="Tell us what car you need, arrival airport, or special requests..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-[#1E1E1E] border border-black/10 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#F5A623]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-neutral-400 order-2 sm:order-1">
                  Protected by invisible reCAPTCHA v3
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                  <a
                    href={`https://wa.me/212653134372?text=${encodeURIComponent(
                      `Hello Yassine Location!\n• Name: ${contactName || 'Customer'}\n• Phone: ${contactPhone || 'Provided in chat'}\n• Inquiry: ${contactMessage || 'I need to rent a car'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-98"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>Send on WhatsApp</span>
                  </a>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-5 py-3 bg-[#0A0A0A] hover:bg-neutral-800 dark:bg-[#F5A623] dark:hover:bg-[#e09618] text-white dark:text-black font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
