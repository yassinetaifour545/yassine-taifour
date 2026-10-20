import React, { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { MOROCCAN_LOCATIONS } from '../data/fleet';
import { Currency } from '../types';

interface HeroProps {
  onQuickSearch: (params: { location: string; pickupDate: string; returnDate: string }) => void;
  onOpenBooking: () => void;
  currency: Currency;
}

export const Hero: React.FC<HeroProps> = ({ onQuickSearch, onOpenBooking }) => {
  // Set default dates: tomorrow and +4 days
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [pickupCity, setPickupCity] = useState(MOROCCAN_LOCATIONS[0].id);
  const [pickupDate, setPickupDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(nextWeek.toISOString().split('T')[0]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch({
      location: pickupCity,
      pickupDate,
      returnDate,
    });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      {/* Background Lighting & Architectural Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#F5A623]/10 dark:bg-[#F5A623]/8 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-200/50 dark:bg-neutral-800/20 blur-[100px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8">
          {/* Left Column: Headlines & Direct Actions (7 cols) */}
          <div className="lg:col-span-7">
            {/* Subtle Editorial Kicker */}
            <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              <span className="text-[#F5A623] font-bold">Kingdom of Morocco</span>
              <span aria-hidden="true">·</span>
              <span>Casablanca · Marrakech · Rabat · Tangier · Agadir</span>
            </div>

            {/* Slogan */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0A0A0A] dark:text-[#FAFAFA] leading-[1.08] mb-6 font-display text-balance">
              Drive the <span className="text-[#F5A623]">Difference.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-light leading-relaxed max-w-xl mb-8">
              Boutique automotive hire across Morocco. Zero hidden fees, airport VIP delivery, comprehensive zero-excess insurance, and guaranteed below-market daily rates.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-3.5 bg-[#F5A623] hover:bg-[#e09618] active:scale-98 text-black font-bold rounded-xl text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-[#F5A623]/25 transition-all cursor-pointer"
              >
                <span>Reserve Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/212653134372?text=Hello%20Yassine%20Location!%20I%20would%20like%20to%20rent%20a%20car."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                title="Chat directly with Yassine on WhatsApp: 0653134372"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span className="tabular-nums">WhatsApp: 06 53 13 43 72</span>
              </a>
            </div>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                <span>24/7 Airport Terminal Handover</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                <span>Comprehensive Insurance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Ambient Backlight Ring */}
            <div className="absolute inset-0 bg-[#F5A623]/15 rounded-3xl blur-2xl transform scale-90 pointer-events-none" />

            <div className="relative w-full rounded-2xl bg-gradient-to-b from-neutral-100 to-neutral-200/60 dark:from-[#161616] dark:to-[#0D0D0D] border border-black/5 dark:border-white/10 p-6 flex flex-col items-center shadow-2xl">
              {/* Badges on Top */}
              <div className="w-full flex items-center justify-between text-xs mb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F5A623] text-black shadow-xs">
                  ★ Flagship Fleet
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                  Ready for Immediate Delivery
                </span>
              </div>

              {/* High-Resolution Car Studio Photo */}
              <div className="relative w-full h-52 sm:h-64 flex items-center justify-center py-2">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_wa4n4gwa4n4gwa4n_687e4be0.jpg"
                  alt="Yassine Location Flagship Volkswagen T-Roc"
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                  loading="eager"
                />
              </div>

              {/* Bottom Model Details & Price */}
              <div className="w-full pt-4 mt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-neutral-900 dark:text-neutral-100">
                    Volkswagen T-Roc
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    2.0 TDI DSG · Automatic · Premium SUV
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                    Starting At
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#F5A623] font-display tabular-nums">
                    600 DH<span className="text-xs text-neutral-500 font-normal">/day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Quick Booking Bar */}
        <div className="relative mt-2 p-2 sm:p-3 bg-white dark:bg-[#141414] rounded-2xl shadow-xl border border-black/5 dark:border-white/10 max-w-5xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Pick-up Location */}
            <div className="p-3 bg-neutral-50 dark:bg-[#1A1A1A] rounded-xl border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <label htmlFor="hero-pickup-location" className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Pick-up Hub
              </label>
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                <MapPin className="w-4 h-4 text-[#F5A623] shrink-0" />
                <select
                  id="hero-pickup-location"
                  aria-label="Pick-up Hub"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-neutral-900 dark:text-white cursor-pointer outline-none"
                >
                  {MOROCCAN_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id} className="text-black dark:text-white dark:bg-neutral-900">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pick-up Date */}
            <div className="p-3 bg-neutral-50 dark:bg-[#1A1A1A] rounded-xl border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <label htmlFor="hero-pickup-date" className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Pick-up Date
              </label>
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                <Calendar className="w-4 h-4 text-[#F5A623] shrink-0" />
                <input
                  id="hero-pickup-date"
                  aria-label="Pick-up Date"
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-neutral-900 dark:text-white outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Return Date */}
            <div className="p-3 bg-neutral-50 dark:bg-[#1A1A1A] rounded-xl border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <label htmlFor="hero-return-date" className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Return Date
              </label>
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                <Calendar className="w-4 h-4 text-[#F5A623] shrink-0" />
                <input
                  id="hero-return-date"
                  aria-label="Return Date"
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-neutral-900 dark:text-white outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Search / Explore CTA Button */}
            <div className="flex flex-col justify-center">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] px-6 py-3 bg-[#0A0A0A] hover:bg-neutral-800 dark:bg-[#F5A623] dark:hover:bg-[#e09618] text-white dark:text-black font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-98"
              >
                <span>Find Available Cars</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Subtle Trust Bar with Guaranteed Savings */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400 max-w-5xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F5A623]" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Morocco Price Beat Guarantee:
            </span>
            <span>All 9 models benchmarked 25% to 35% below airport counters.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tabular-nums">0 DH Hidden Surcharges</span>
            <span aria-hidden="true">·</span>
            <span>Free Airport Cancellation</span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="relative mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
      </div>
    </section>
  );
};
