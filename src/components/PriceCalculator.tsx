import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Shield, Zap, TrendingDown, Check } from 'lucide-react';
import { FLEET_CARS, ADD_ONS } from '../data/fleet';
import { Car, Currency } from '../types';
import { calculateRentalPricing, formatPrice, calculateRentalDays } from '../utils/pricing';

interface PriceCalculatorProps {
  currency: Currency;
  onBookWithConfig: (config: {
    car: Car;
    days: number;
    pickupDate: string;
    returnDate: string;
    addOnIds: string[];
  }) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  currency,
  onBookWithConfig,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [selectedCarId, setSelectedCarId] = useState<string>(FLEET_CARS[0].id);
  const [pickupDate, setPickupDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState<string>(nextWeek.toISOString().split('T')[0]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['full-insurance']);

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

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProceed = () => {
    onBookWithConfig({
      car: selectedCar,
      days: rentalDays,
      pickupDate,
      returnDate,
      addOnIds: selectedAddOnIds,
    });
  };

  return (
    <section id="calculator" className="py-24 bg-[#FAFAFA] dark:bg-[#0A0A0A] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F5A623] mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Transparent Pricing Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A] dark:text-[#FAFAFA] font-display">
            Live Cost & Savings Calculator
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
            Compare real-time rates against standard Moroccan airport counters. No surprise credit card holds or hidden extras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#141414] p-6 sm:p-8 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs space-y-6">
            {/* Step 1: Car Selection */}
            <div>
              <label htmlFor="calculator-car-selection" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                1. Select Vehicle
              </label>
              <select
                id="calculator-car-selection"
                aria-label="Select vehicle for pricing simulation"
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full p-3.5 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#F5A623]"
              >
                {FLEET_CARS.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} — {formatPrice(car.dailyRate, currency)}/day ({car.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Dates Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calculator-pickup-date" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Pick-up Date
                </label>
                <input
                  id="calculator-pickup-date"
                  aria-label="Pick-up Date"
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-3 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl text-sm font-medium text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#F5A623]"
                />
              </div>

              <div>
                <label htmlFor="calculator-return-date" className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Return Date
                </label>
                <input
                  id="calculator-return-date"
                  aria-label="Return Date"
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full p-3 bg-neutral-50 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl text-sm font-medium text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#F5A623]"
                />
              </div>
            </div>

            {/* Step 3: Optional Coverage & Add-ons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Optional Protection & Extras
                </span>
                <span className="text-xs text-[#F5A623]">Cancel or edit anytime</span>
              </div>

              <div className="space-y-2.5">
                {ADD_ONS.map((addon) => {
                  const isChecked = selectedAddOnIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-[#F5A623] bg-[#F5A623]/5 dark:bg-[#F5A623]/10'
                          : 'border-black/5 dark:border-white/5 bg-neutral-50/50 dark:bg-[#1A1A1A] hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#F5A623] text-black'
                              : 'border border-neutral-400 dark:border-neutral-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {addon.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light">
                            {addon.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-neutral-900 dark:text-neutral-200 tabular-nums shrink-0 ml-2">
                        +{formatPrice(addon.pricePerDay, currency)}/day
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Breakdown & Best Price Guarantee Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 bg-[#0A0A0A] text-white p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] text-[#F5A623] uppercase font-bold tracking-wider">
                  Summary Quote
                </span>
                <h3 className="text-xl font-bold font-display">{selectedCar.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400">Duration</span>
                <div className="text-base sm:text-lg font-bold tabular-nums">
                  {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
                </div>
              </div>
            </div>

            {/* Itemized lines */}
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">
                  Base rate ({rentalDays}d × {formatPrice(selectedCar.dailyRate, currency)})
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatPrice(pricing.subtotalBase, currency)}
                </span>
              </div>

              {pricing.durationDiscountPercent > 0 && (
                <div className="flex justify-between py-1 border-b border-white/5 text-emerald-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    Trip Discount ({pricing.durationDiscountPercent}% off)
                  </span>
                  <span className="font-bold tabular-nums">
                    -{formatPrice(pricing.durationDiscountAmount, currency)}
                  </span>
                </div>
              )}

              {pricing.addOnsTotal > 0 && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Coverage & Add-ons</span>
                  <span className="font-semibold text-white tabular-nums">
                    +{formatPrice(pricing.addOnsTotal, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 text-neutral-400">
                <span>Airport Surcharges & Taxes</span>
                <span className="text-emerald-400 font-semibold">0 DH (Free)</span>
              </div>
            </div>

            {/* Total Section */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
                  Guaranteed Total
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#F5A623] font-display tabular-nums">
                  {formatPrice(pricing.finalTotalMad, currency)}
                </div>
              </div>

              {/* Price Beat Proof Box */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    Competitor Average:
                  </span>
                  <span className="line-through text-neutral-400 tabular-nums">
                    {formatPrice(pricing.competitorTotalMad, currency)}
                  </span>
                </div>
                <div className="text-emerald-400 font-semibold text-[11px]">
                  You save approximately {formatPrice(pricing.savingsMad, currency)} ({pricing.savingsPercent}% lower than airport counters).
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleProceed}
              className="w-full py-3 sm:py-3.5 bg-[#F5A623] hover:bg-[#e09618] active:scale-98 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Book with this Configuration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-neutral-400">
              No credit card required upfront · Pay on delivery available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
