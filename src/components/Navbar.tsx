import React, { useState, useEffect } from 'react';
import { Moon, Sun, ShieldCheck, PhoneCall, Menu, X } from 'lucide-react';
import { Currency } from '../types';

interface NavbarProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenBooking,
  onOpenAdmin,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAFAFA]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-xl sm:text-2xl font-extrabold tracking-tight text-[#0A0A0A] dark:text-[#FAFAFA] whitespace-nowrap shrink-0 group"
          >
            <span className="w-2.5 h-6 bg-[#F5A623] rounded-sm transform group-hover:scale-y-110 transition-transform duration-200" />
            <span className="font-display">Yassine Location</span>
          </a>

          {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <a
              href="#fleet"
              className="hover:text-[#F5A623] dark:hover:text-[#F5A623] transition-colors whitespace-nowrap shrink-0"
            >
              Fleet
            </a>
            <a
              href="#calculator"
              className="hover:text-[#F5A623] dark:hover:text-[#F5A623] transition-colors whitespace-nowrap shrink-0"
            >
              Pricing
            </a>
            <a
              href="#why-us"
              className="hover:text-[#F5A623] dark:hover:text-[#F5A623] transition-colors whitespace-nowrap shrink-0"
            >
              Why Us
            </a>
            <a
              href="#locations"
              className="hover:text-[#F5A623] dark:hover:text-[#F5A623] transition-colors whitespace-nowrap shrink-0"
            >
              Locations
            </a>
            <a
              href="#contact"
              className="hover:text-[#F5A623] dark:hover:text-[#F5A623] transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Controls & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Currency Selector */}
            <div className="relative inline-flex items-center bg-neutral-200/60 dark:bg-neutral-800/80 rounded-lg p-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
              {(['MAD', 'EUR', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                    currency === c
                      ? 'bg-white dark:bg-neutral-900 text-[#0A0A0A] dark:text-[#F5A623] shadow-xs'
                      : 'hover:text-black dark:hover:text-white'
                  }`}
                  aria-label={`Switch currency to ${c}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#F5A623]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* WhatsApp Direct Hotline 0653134372 */}
            <a
              href="https://wa.me/212653134372?text=Hello%20Yassine%20Location!%20I%20would%20like%20to%20rent%20a%20car."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-lg hover:border-emerald-500 transition-colors shrink-0"
              title="Chat with Yassine on WhatsApp: 0653134372"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="tabular-nums">06 53 13 43 72</span>
            </a>

            {/* Primary Action Button */}
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-black bg-[#F5A623] hover:bg-[#e09618] active:scale-98 rounded-lg shadow-sm transition-all duration-150 whitespace-nowrap shrink-0"
            >
              Reserve Now
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 dark:text-neutral-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-black/10 dark:border-white/10 space-y-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-b-xl px-2">
            <a
              href="https://wa.me/212653134372?text=Hello%20Yassine%20Location!%20I%20would%20like%20to%20rent%20a%20car."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp: 06 53 13 43 72</span>
            </a>
            <a
              href="#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Fleet
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Pricing
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Why Us
            </a>
            <a
              href="#locations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Locations
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Contact
            </a>
            <div className="pt-2 flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Fleet Portal
              </button>
              <a
                href="tel:0653134372"
                className="text-xs text-[#F5A623] font-medium flex items-center gap-1 tabular-nums"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                06 53 13 43 72
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
