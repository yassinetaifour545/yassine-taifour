import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FleetGrid } from './components/FleetGrid';
import { WhyUs } from './components/WhyUs';
import { PriceCalculator } from './components/PriceCalculator';
import { ContactSection } from './components/ContactSection';
import { BookingModal } from './components/BookingModal';
import { AdminModal } from './components/AdminModal';
import { CookieConsent } from './components/CookieConsent';
import { Footer } from './components/Footer';
import { FLEET_CARS, MOROCCAN_LOCATIONS } from './data/fleet';
import { Car, Currency, BookingDetails } from './types';
import { MessageSquare, PhoneCall, CheckCircle } from 'lucide-react';

// Initial demonstration reservations
const INITIAL_BOOKINGS: BookingDetails[] = [
  {
    bookingId: 'YL-2026-8941',
    carId: 'vw-t-roc',
    carName: 'VW T-Roc',
    pickupLocation: 'Casablanca Mohammed V Airport (CMN)',
    returnLocation: 'Casablanca Mohammed V Airport (CMN)',
    pickupDate: '2026-10-22',
    pickupTime: '11:30',
    returnDate: '2026-10-27',
    returnTime: '16:00',
    selectedAddOns: ['full-insurance', 'gps'],
    driverName: 'Marc Lefebvre',
    driverEmail: 'm.lefebvre@paris.fr',
    driverPhone: '+33 6 12 34 56 78',
    licenseNumber: 'FR-9482103',
    flightNumber: 'AF 1596',
    paymentMethod: 'card',
    totalPrice: 3375,
    days: 5,
    status: 'confirmed',
    createdAt: '2026-10-20T06:15:00Z',
  },
  {
    bookingId: 'YL-2026-7214',
    carId: 'clio-5',
    carName: 'Clio 5',
    pickupLocation: 'Marrakech Menara Airport (RAK)',
    returnLocation: 'Marrakech Menara Airport (RAK)',
    pickupDate: '2026-10-24',
    pickupTime: '09:00',
    returnDate: '2026-10-31',
    returnTime: '10:00',
    selectedAddOns: ['full-insurance'],
    driverName: 'Sofia Bennani',
    driverEmail: 'sofia.b@outlook.com',
    driverPhone: '+212 661 88 99 00',
    licenseNumber: 'MA-381920',
    flightNumber: 'RAM 741',
    paymentMethod: 'arrival',
    totalPrice: 1925,
    days: 7,
    status: 'confirmed',
    createdAt: '2026-10-19T14:20:00Z',
  },
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('yl_theme') === 'dark';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('yl_currency') as Currency) || 'MAD';
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState<Car | undefined>(undefined);
  const [initialDates, setInitialDates] = useState<{ pickup?: string; return?: string }>({});
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    const saved = localStorage.getItem('yl_bookings_store');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Sync dark class with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('yl_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('yl_theme', 'light');
    }
  }, [isDarkMode]);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('yl_currency', newCurrency);
  };

  const handleOpenBookingModal = (car?: Car) => {
    setSelectedCarForBooking(car || FLEET_CARS[0]);
    setIsBookingOpen(true);
  };

  const handleQuickSearch = (params: { location: string; pickupDate: string; returnDate: string }) => {
    setInitialDates({ pickup: params.pickupDate, return: params.returnDate });
    const fleetSection = document.getElementById('fleet');
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookWithConfig = (config: {
    car: Car;
    days: number;
    pickupDate: string;
    returnDate: string;
    addOnIds: string[];
  }) => {
    setSelectedCarForBooking(config.car);
    setInitialDates({ pickup: config.pickupDate, return: config.returnDate });
    setIsBookingOpen(true);
  };

  const handleBookingConfirmed = (newBooking: BookingDetails) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('yl_bookings_store', JSON.stringify(updated));

    setNotificationToast(`Reservation ${newBooking.bookingId} confirmed successfully!`);
    setTimeout(() => {
      setNotificationToast(null);
    }, 5000);
  };

  const handleUpdateBookingStatus = (
    bookingId: string,
    status: 'confirmed' | 'pending' | 'completed'
  ) => {
    const updated = bookings.map((b) => (b.bookingId === bookingId ? { ...b, status } : b));
    setBookings(updated);
    localStorage.setItem('yl_bookings_store', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#FAFAFA] transition-colors duration-200">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-white" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenBooking={() => handleOpenBookingModal()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onQuickSearch={handleQuickSearch}
          onOpenBooking={() => handleOpenBookingModal()}
          currency={currency}
        />

        {/* 2. Fleet Grid (All 9 Cars with flip/specs and Price Beat badges) */}
        <FleetGrid
          currency={currency}
          onSelectCar={(car) => handleOpenBookingModal(car)}
        />

        {/* 3. Live Price Calculator Simulator */}
        <PriceCalculator
          currency={currency}
          onBookWithConfig={handleBookWithConfig}
        />

        {/* 4. Why Yassine Location (3 Core Pillars & Guarantees) */}
        <WhyUs />

        {/* 5. Contact Section & Morocco Agency Hubs Map */}
        <ContactSection />
      </main>

      {/* 6. Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => handleOpenBookingModal()}
      />

      {/* Floating WhatsApp Quick Concierge Button */}
      <a
        href="https://wa.me/212653134372?text=Hello%20Yassine%20Location!%20I%20would%20like%20to%20rent%20a%20car."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-full shadow-2xl flex items-center gap-2.5 group transition-all duration-200 hover:shadow-emerald-600/40 ring-4 ring-emerald-500/20"
        aria-label="Direct WhatsApp Concierge 0653134372"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider leading-none">
            WhatsApp Direct
          </span>
          <span className="text-xs font-extrabold tracking-tight tabular-nums">
            06 53 13 43 72
          </span>
        </div>
      </a>

      {/* 3-Step Luxury Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCar={selectedCarForBooking}
        initialPickupDate={initialDates.pickup}
        initialReturnDate={initialDates.return}
        currency={currency}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* Admin 2FA Fleet & Bookings Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        onUpdateStatus={handleUpdateBookingStatus}
      />

      {/* GDPR Cookie Consent */}
      <CookieConsent />
    </div>
  );
}
