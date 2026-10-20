import React, { useState, useEffect } from 'react';
import { Shield, Check } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('yl_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('yl_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('yl_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md text-white border-t border-white/10 px-4 sm:px-8 py-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-7 h-7 rounded-lg bg-[#F5A623]/20 text-[#F5A623] flex items-center justify-center shrink-0 hidden sm:flex">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <p className="text-neutral-300 font-light leading-relaxed">
            <strong className="text-white font-semibold">Privacy & Cookies:</strong> We use essential tokens to protect reservations and remember your currency according to GDPR & Moroccan CNDP standards.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors text-xs"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 bg-[#F5A623] hover:bg-[#e09618] text-black font-bold rounded-lg transition-colors flex items-center gap-1 text-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};
