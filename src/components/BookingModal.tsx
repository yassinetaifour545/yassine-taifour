import React, { useState, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  CreditCard,
  Banknote,
  Send,
  ArrowRight,
  ArrowLeft,
  Lock,
  Download,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { FLEET_CARS, MOROCCAN_LOCATIONS, ADD_ONS } from '../data/fleet';
import { Car, Currency, BookingDetails } from '../types';
import {
  calculateRentalDays,
  calculateRentalPricing,
  formatPrice,
  validateBookingDates,
  validateDriverDetails,
  generateBookingId,
} from '../utils/pricing';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCar?: Car;
  initialPickupDate?: string;
  initialReturnDate?: string;
  currency: Currency;
  onBookingConfirmed: (booking: BookingDetails) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialCar,
  initialPickupDate,
  initialReturnDate,
  currency,
  onBookingConfirmed,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCarId, setSelectedCarId] = useState<string>(
    initialCar ? initialCar.id : FLEET_CARS[0].id
  );
  const [pickupLocation, setPickupLocation] = useState<string>(MOROCCAN_LOCATIONS[0].name);
  const [returnLocation, setReturnLocation] = useState<string>(MOROCCAN_LOCATIONS[0].name);
  const [pickupDate, setPickupDate] = useState<string>(
    initialPickupDate || tomorrow.toISOString().split('T')[0]
  );
  const [pickupTime, setPickupTime] = useState<string>('10:00');
  const [returnDate, setReturnDate] = useState<string>(
    initialReturnDate || nextWeek.toISOString().split('T')[0]
  );
  const [returnTime, setReturnTime] = useState<string>('10:00');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['full-insurance']);

  // Driver details form
  const [driverName, setDriverName] = useState<string>('');
  const [driverEmail, setDriverEmail] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('+212 ');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'arrival' | 'card'>('arrival');
  const [notes, setNotes] = useState<string>('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // Sync selected car when modal opens
  React.useEffect(() => {
    if (initialCar) {
      setSelectedCarId(initialCar.id);
    }
  }, [initialCar]);

  const selectedCar = useMemo(() => {
    return FLEET_CARS.find((c) => c.id === selectedCarId) || FLEET_CARS[0];
  }, [selectedCarId]);

  const rentalDays = useMemo(() => {
    return calculateRentalDays(pickupDate, returnDate);
  }, [pickupDate, returnDate]);

  const pricing = useMemo(() => {
    return calculateRentalPricing({
      dailyRate: selectedCar.dailyRate,
      marketRate: selectedCar.marketRate,
      days: rentalDays,
      selectedAddOnIds,
      currency,
    });
  }, [selectedCar, rentalDays, selectedAddOnIds, currency]);

  if (!isOpen) return null;

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextToStep2 = () => {
    const dateCheck = validateBookingDates(pickupDate, returnDate);
    if (!dateCheck.isValid) {
      setFormErrors({ date: dateCheck.error || 'Invalid dates' });
      return;
    }
    setFormErrors({});
    setStep(2);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit (max 5 per minute in localStorage)
    const recentSubmissions = JSON.parse(
      sessionStorage.getItem('yl_submissions_timestamps') || '[]'
    ) as number[];
    const oneMinAgo = Date.now() - 60000;
    const filteredSubmissions = recentSubmissions.filter((t) => t > oneMinAgo);

    if (filteredSubmissions.length >= 5) {
      setRateLimitError('Rate limit exceeded: please wait a minute before requesting another reservation.');
      return;
    }

    const driverCheck = validateDriverDetails({
      driverName,
      driverEmail,
      driverPhone,
      licenseNumber,
    });

    if (!driverCheck.isValid) {
      setFormErrors(driverCheck.errors);
      return;
    }

    setFormErrors({});
    setRateLimitError(null);
    setIsSubmitting(true);

    // Record submission for rate limiting
    filteredSubmissions.push(Date.now());
    sessionStorage.setItem('yl_submissions_timestamps', JSON.stringify(filteredSubmissions));

    // Simulated secure token verification & backend response
    setTimeout(() => {
      setIsSubmitting(false);
      const newBookingId = generateBookingId();
      const bookingData: BookingDetails = {
        bookingId: newBookingId,
        carId: selectedCar.id,
        carName: selectedCar.name,
        pickupLocation,
        returnLocation,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        selectedAddOns: selectedAddOnIds,
        driverName,
        driverEmail,
        driverPhone,
        licenseNumber,
        flightNumber,
        notes,
        paymentMethod,
        totalPrice: pricing.finalTotalMad,
        days: rentalDays,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setConfirmedBooking(bookingData);
      onBookingConfirmed(bookingData);
      setStep(3);
    }, 600);
  };

  const copyRefToClipboard = () => {
    if (confirmedBooking?.bookingId) {
      navigator.clipboard.writeText(confirmedBooking.bookingId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!confirmedBooking) return '#';
    const text = encodeURIComponent(
      `Hello Yassine Location!\nI would like to confirm my car rental reservation:\n\n• Ref: ${confirmedBooking.bookingId}\n• Car: ${confirmedBooking.carName}\n• Pick-up: ${confirmedBooking.pickupLocation} on ${confirmedBooking.pickupDate} at ${confirmedBooking.pickupTime}\n• Return: ${confirmedBooking.returnLocation} on ${confirmedBooking.returnDate}\n• Driver: ${confirmedBooking.driverName}\n• Phone: ${confirmedBooking.driverPhone}\n• Total: ${formatPrice(confirmedBooking.totalPrice || 0, currency)}\n\nThank you!`
    );
    return `https://wa.me/212653134372?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden text-neutral-900 dark:text-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-5 bg-[#F5A623] rounded-sm" />
            <div>
              <h2 className="text-lg font-bold font-display">
                {step === 3 ? 'Reservation Confirmed' : 'Instant Reservation'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {step === 1 && 'Step 1 of 3: Vehicle & Dates'}
                {step === 2 && 'Step 2 of 3: Driver Details & Verification'}
                {step === 3 && 'Step 3 of 3: Voucher & WhatsApp Confirmation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="h-1 bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full bg-[#F5A623] transition-all duration-300"
            style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
          />
        </div>

        {/* STEP 1: VEHICLE & DATES */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            {formErrors.date && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formErrors.date}</span>
              </div>
            )}

            {/* Vehicle Selection Dropdown */}
            <div>
              <label htmlFor="modal-car-select" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Selected Vehicle
              </label>
              <select
                id="modal-car-select"
                aria-label="Select vehicle"
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full p-3.5 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#F5A623]"
              >
                {FLEET_CARS.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} — {formatPrice(car.dailyRate, currency)}/day ({car.category.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Pick-up and Return Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-pickup-location" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Pick-up Location
                </label>
                <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl text-sm">
                  <MapPin className="w-4 h-4 text-[#F5A623] shrink-0" />
                  <select
                    id="modal-pickup-location"
                    aria-label="Pick-up Location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-transparent border-none text-xs sm:text-sm font-medium outline-none cursor-pointer"
                  >
                    {MOROCCAN_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name} className="dark:bg-neutral-900">
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="modal-return-location" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Return Location
                </label>
                <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl text-sm">
                  <MapPin className="w-4 h-4 text-[#F5A623] shrink-0" />
                  <select
                    id="modal-return-location"
                    aria-label="Return Location"
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full bg-transparent border-none text-xs sm:text-sm font-medium outline-none cursor-pointer"
                  >
                    {MOROCCAN_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name} className="dark:bg-neutral-900">
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dates & Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Pick-up Date & Time
                </span>
                <div className="flex gap-2">
                  <input
                    aria-label="Pick-up Date"
                    type="date"
                    value={pickupDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-2/3 p-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg text-xs font-medium outline-none"
                  />
                  <input
                    aria-label="Pick-up Time"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-1/3 p-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Return Date & Time
                </span>
                <div className="flex gap-2">
                  <input
                    aria-label="Return Date"
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-2/3 p-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg text-xs font-medium outline-none"
                  />
                  <input
                    aria-label="Return Time"
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-1/3 p-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg text-xs font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Add-ons Checklist */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Optional Protection & Accessories
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADD_ONS.map((addon) => {
                  const isChecked = selectedAddOnIds.includes(addon.id);
                  return (
                    <button
                      type="button"
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between text-xs ${
                        isChecked
                          ? 'border-[#F5A623] bg-[#F5A623]/5 dark:bg-[#F5A623]/10 font-semibold'
                          : 'border-black/5 dark:border-white/5 bg-neutral-50/50 dark:bg-[#1A1A1A] text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-[#F5A623] text-black'
                              : 'border border-neutral-400 dark:border-neutral-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{addon.name}</span>
                      </div>
                      <span className="tabular-nums font-bold shrink-0 ml-2">
                        +{formatPrice(addon.pricePerDay, currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Live Cost Bar */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase">Estimated Total</span>
                <div className="text-2xl font-black text-[#F5A623] font-display tabular-nums">
                  {formatPrice(pricing.finalTotalMad, currency)}
                </div>
                <span className="text-[10px] text-emerald-400">
                  {rentalDays} {rentalDays === 1 ? 'day' : 'days'} · Saves approx.{' '}
                  {formatPrice(pricing.savingsMad, currency)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextToStep2}
                className="px-6 py-3 bg-[#F5A623] hover:bg-[#e09618] text-black font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-98"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DRIVER DETAILS & VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-5">
            {rateLimitError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{rateLimitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="driver-full-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Full Name (as on Driver’s License) *
                </label>
                <input
                  id="driver-full-name"
                  type="text"
                  required
                  placeholder="e.g. Yassine El Amrani"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className={`w-full p-3 bg-neutral-50 dark:bg-[#1C1C1C] border rounded-xl text-sm outline-none ${
                    formErrors.driverName
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-black/10 dark:border-white/10 focus:border-[#F5A623]'
                  }`}
                />
                {formErrors.driverName && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.driverName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="driver-email-address" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Email Address *
                </label>
                <input
                  id="driver-email-address"
                  type="email"
                  required
                  placeholder="yassine@example.com"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  className={`w-full p-3 bg-neutral-50 dark:bg-[#1C1C1C] border rounded-xl text-sm outline-none ${
                    formErrors.driverEmail
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-black/10 dark:border-white/10 focus:border-[#F5A623]'
                  }`}
                />
                {formErrors.driverEmail && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.driverEmail}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp / Phone */}
              <div>
                <label htmlFor="driver-phone-whatsapp" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  id="driver-phone-whatsapp"
                  type="tel"
                  required
                  placeholder="+212 661 23 45 67"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className={`w-full p-3 bg-neutral-50 dark:bg-[#1C1C1C] border rounded-xl text-sm outline-none ${
                    formErrors.driverPhone
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-black/10 dark:border-white/10 focus:border-[#F5A623]'
                  }`}
                />
                {formErrors.driverPhone && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.driverPhone}
                  </span>
                )}
              </div>

              {/* Driver's License Number */}
              <div>
                <label htmlFor="driver-license-num" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Driver’s License No. *
                </label>
                <input
                  id="driver-license-num"
                  type="text"
                  required
                  placeholder="MA-123456 or Passport No."
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className={`w-full p-3 bg-neutral-50 dark:bg-[#1C1C1C] border rounded-xl text-sm outline-none ${
                    formErrors.licenseNumber
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-black/10 dark:border-white/10 focus:border-[#F5A623]'
                  }`}
                />
                {formErrors.licenseNumber && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.licenseNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Flight Number (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="driver-flight-number" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Flight Number (Optional for Airport Delivery)
                </label>
                <input
                  id="driver-flight-number"
                  type="text"
                  placeholder="e.g. AT 202 or RAM 740"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full p-3 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#F5A623]"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  We track flight delays automatically.
                </span>
              </div>

              {/* Payment Method */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  Payment Preference
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('arrival')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'arrival'
                        ? 'border-[#F5A623] bg-[#F5A623]/10 text-[#0A0A0A] dark:text-[#F5A623]'
                        : 'border-black/10 dark:border-white/10 text-neutral-500'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Pay on Handover</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#F5A623] bg-[#F5A623]/10 text-[#0A0A0A] dark:text-[#F5A623]'
                        : 'border-black/10 dark:border-white/10 text-neutral-500'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card / CMI Ready</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Security & Invisible reCAPTCHA Badge Notice */}
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-[#181818] text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit TLS Encryption · reCAPTCHA v3 Protected</span>
              </div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                0 DH Hidden Fees
              </span>
            </div>

            {/* Navigation buttons */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Vehicle</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#F5A623] hover:bg-[#e09618] active:scale-98 disabled:opacity-50 text-black font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-md"
              >
                {isSubmitting ? (
                  <span>Securing Reservation...</span>
                ) : (
                  <>
                    <span>Confirm & Generate Voucher</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ANIMATED SUCCESS CONFIRMATION SCREEN */}
        {step === 3 && confirmedBooking && (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 ring-8 ring-emerald-50 dark:ring-emerald-950/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#F5A623] uppercase tracking-wider">
                Booking Reference Guaranteed
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {confirmedBooking.bookingId}
                </span>
                <button
                  onClick={copyRefToClipboard}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                  title="Copy reference code"
                  aria-label="Copy booking reference code"
                >
                  {copiedRef ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                A confirmation has been prepared for {confirmedBooking.driverName}.
              </p>
            </div>

            {/* Voucher Details Card */}
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#181818] border border-black/5 dark:border-white/10 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Reserved Vehicle:</span>
                <span className="font-bold text-neutral-900 dark:text-white font-display">
                  {confirmedBooking.carName}
                </span>
              </div>
              <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Pick-up Location:</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {confirmedBooking.pickupLocation}
                </span>
              </div>
              <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Dates & Duration:</span>
                <span className="font-medium text-neutral-900 dark:text-white tabular-nums">
                  {confirmedBooking.pickupDate} ({confirmedBooking.pickupTime}) →{' '}
                  {confirmedBooking.returnDate} ({confirmedBooking.days} Days)
                </span>
              </div>
              <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Payment Option:</span>
                <span className="font-medium text-neutral-900 dark:text-white capitalize">
                  {confirmedBooking.paymentMethod === 'arrival'
                    ? 'Pay on Key Handover (Cash/Card)'
                    : 'Secured via CMI Terminal'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-neutral-900 dark:text-white">
                  Total Payable Amount:
                </span>
                <span className="text-base font-black text-[#F5A623] font-display tabular-nums">
                  {formatPrice(confirmedBooking.totalPrice || 0, currency)}
                </span>
              </div>
            </div>

            {/* WhatsApp Direct Action & Close */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send to Yassine on WhatsApp (06 53 13 43 72)</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors"
              >
                Done / Back to Fleet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
