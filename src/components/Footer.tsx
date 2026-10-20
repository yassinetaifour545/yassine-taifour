import React from 'react';
import { ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenBooking }) => {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight font-display">
              <span className="w-2.5 h-6 bg-[#F5A623] rounded-sm" />
              <span>Yassine Location</span>
            </div>

            <p className="text-sm text-neutral-400 font-light max-w-sm leading-relaxed">
              Drive the Difference. Premium boutique vehicle rental throughout the Kingdom of Morocco. Fully insured, transparent pricing, guaranteed below market rates.
            </p>

            <div className="pt-2 text-xs text-neutral-500 space-y-1">
              <div>RC Casablanca: 489210 · Patente: 34892011 · IF: 51209348</div>
              <div>Certified Member of the Moroccan Association of Car Rental Agencies (AMACR).</div>
            </div>
          </div>

          {/* Quick Fleet Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F5A623]">
              Fleet Models
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#fleet" className="hover:text-white transition-colors">Clio 5 (250 DH/day)</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">Dacia Logan & Sandero</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">MG3 Hybrid+</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">Peugeot 208</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">Duster & Tucson</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">Volkswagen T-Roc</a></li>
            </ul>
          </div>

          {/* Key Hubs */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F5A623]">
              Airport Hubs
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#locations" className="hover:text-white transition-colors">Casablanca Airport (CMN)</a></li>
              <li><a href="#locations" className="hover:text-white transition-colors">Marrakech Menara (RAK)</a></li>
              <li><a href="#locations" className="hover:text-white transition-colors">Rabat Agdal High-Speed</a></li>
              <li><a href="#locations" className="hover:text-white transition-colors">Tangier Airport (TNG)</a></li>
              <li><a href="#locations" className="hover:text-white transition-colors">Agadir Al Massira (AGA)</a></li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F5A623]">
              Trust & Guarantees
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Price Beat Guarantee</span>
              </li>
              <li><span>Zero Deductible Available</span></li>
              <li><span>Unlimited Mileage in Morocco</span></li>
              <li><span>Free 24h Prior Cancellation</span></li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-[11px] text-neutral-500 hover:text-neutral-300 underline underline-offset-4 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Fleet Staff Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Yassine Location SARL. All rights reserved. "Drive the Difference."
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="#why-us" className="hover:text-neutral-300 transition-colors">Rental Terms</a>
            <a href="#why-us" className="hover:text-neutral-300 transition-colors">Insurance</a>
            <a href="mailto:taifouryassinee@gmail.com" className="hover:text-neutral-300 transition-colors">taifouryassinee@gmail.com</a>
            <a href="https://wa.me/212653134372" target="_blank" rel="noopener noreferrer" className="text-[#F5A623] hover:underline font-semibold tabular-nums">
              WhatsApp: 06 53 13 43 72
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
