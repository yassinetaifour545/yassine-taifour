import React, { useState, useMemo } from 'react';
import {
  Users,
  Briefcase,
  Gauge,
  Fuel,
  Wind,
  Check,
  ArrowRight,
  TrendingDown,
  RotateCw,
  Info,
  MessageSquare,
} from 'lucide-react';
import { FLEET_CARS } from '../data/fleet';
import { Car, CarCategory, Currency } from '../types';
import { formatPrice } from '../utils/pricing';
import { CarVisual } from './CarVisual';

interface FleetGridProps {
  currency: Currency;
  onSelectCar: (car: Car) => void;
  selectedCategory?: string;
}

export const FleetGrid: React.FC<FleetGridProps> = ({
  currency,
  onSelectCar,
  selectedCategory = 'all',
}) => {
  const [activeCategory, setActiveCategory] = useState<CarCategory>(
    (selectedCategory as CarCategory) || 'all'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const categories: { id: CarCategory; label: string }[] = [
    { id: 'all', label: 'All Fleet (9)' },
    { id: 'economy', label: 'Economy' },
    { id: 'sedan', label: 'Sedans' },
    { id: 'compact', label: 'Compacts' },
    { id: 'suv', label: 'SUVs & Crossovers' },
    { id: 'premium', label: 'Premium' },
  ];

  const toggleFlip = (carId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [carId]: !prev[carId],
    }));
  };

  const filteredCars = useMemo(() => {
    let result = FLEET_CARS.filter((car) => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'economy') return car.category === 'economy';
      if (activeCategory === 'sedan') return car.category === 'sedan';
      if (activeCategory === 'compact') return car.category === 'compact';
      if (activeCategory === 'suv') return car.category === 'suv';
      if (activeCategory === 'premium') return car.category === 'premium';
      return true;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.dailyRate - b.dailyRate);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.dailyRate - a.dailyRate);
    } else {
      // featured: featured first then by ascending
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [activeCategory, sortBy]);

  return (
    <section id="fleet" className="py-20 bg-[#FAFAFA] dark:bg-[#0A0A0A] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F5A623] mb-2">
              <span>Handpicked Moroccan Fleet</span>
              <span aria-hidden="true">·</span>
              <span>100% Sanitized & Comprehensive Insured</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A] dark:text-[#FAFAFA] font-display">
              Curated Vehicles. Guaranteed Rates.
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-xl font-light">
              Every vehicle is maintained directly by certified technicians with zero excess insurance options, unlimited mileage, and airport terminal handover.
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Sort by:</span>
            <select
              aria-label="Sort cars by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 text-xs font-semibold rounded-lg px-3 py-2 text-neutral-800 dark:text-neutral-200 outline-none focus:border-[#F5A623]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Interactive Filter Tabs (Zero-Pill compliant segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#0A0A0A] text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-neutral-200/60 dark:bg-[#181818] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => {
            const isFlipped = !!flippedCards[car.id];
            const dailyDiff = car.marketRate - car.dailyRate;
            const discountPct = Math.round((dailyDiff / car.marketRate) * 100);

            return (
              <div
                key={car.id}
                className="group relative perspective-1000 min-h-[460px] flex flex-col"
              >
                <div
                  className={`w-full h-full transition-transform duration-500 transform-style-3d relative flex-1 flex flex-col ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT FACE OF CARD */}
                  <div className="backface-hidden w-full h-full bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 p-5 flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div>
                      {/* Top Bar on Card: Model & Price Beat Badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                            {car.category}
                          </span>
                          <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-display">
                            {car.name}
                          </h3>
                        </div>

                        {/* Price Beat Badge */}
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded">
                            <TrendingDown className="w-3 h-3" />
                            Price Beat: -{discountPct}%
                          </span>
                          <span className="text-[10px] text-neutral-400 line-through mt-0.5 tabular-nums">
                            Competitors: {formatPrice(car.marketRate, currency)}
                          </span>
                        </div>
                      </div>

                      {/* Car Visual Media */}
                      <div className="mb-4">
                        <CarVisual car={car} />
                      </div>

                      {/* Specs Icons Strip */}
                      <div className="grid grid-cols-4 gap-2 py-3 border-y border-black/5 dark:border-white/5 text-xs text-neutral-600 dark:text-neutral-400">
                        <div className="flex flex-col items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-[11px] font-medium">{car.transmission}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Fuel className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-[11px] font-medium">{car.fuel}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-[11px] font-medium">{car.seats} Seats</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-[11px] font-medium">{car.luggage} Bags</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="mt-4 pt-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                          Daily Rate
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#0A0A0A] dark:text-[#FAFAFA] font-display tabular-nums">
                            {formatPrice(car.dailyRate, currency)}
                          </span>
                          <span className="text-xs text-neutral-500 font-normal">/day</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Direct WhatsApp button */}
                        <a
                          href={`https://wa.me/212653134372?text=${encodeURIComponent(
                            `Hello Yassine Location!\nI would like to rent the ${car.name} (${car.dailyRate} DH/day). Is it available?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 sm:p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                          title={`Chat with Yassine (0653134372) about ${car.name}`}
                          aria-label={`Inquire about ${car.name} on WhatsApp`}
                        >
                          <MessageSquare className="w-4 h-4 fill-current" />
                        </a>

                        {/* Flip specs button */}
                        <button
                          type="button"
                          onClick={() => toggleFlip(car.id)}
                          className="p-2 sm:p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="View detailed specs & insurance terms"
                          aria-label={`View specs for ${car.name}`}
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>

                        {/* Primary Book Button */}
                        <button
                          type="button"
                          onClick={() => onSelectCar(car)}
                          className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#F5A623] hover:bg-[#e09618] active:scale-98 text-black font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE OF CARD (FLIPPED SPECS & INCLUSIONS) */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full bg-[#111111] text-white rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-3">
                        <div>
                          <span className="text-[10px] font-semibold text-[#F5A623] tracking-widest uppercase">
                            Technical Specifications
                          </span>
                          <h4 className="text-lg font-bold font-display">{car.name}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFlip(car.id)}
                          className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                          aria-label="Return to front"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-xs text-neutral-300">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-neutral-400">Powertrain</span>
                          <span className="font-medium text-white">{car.engine}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-neutral-400">Transmission</span>
                          <span className="font-medium text-white">{car.transmission}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-neutral-400">Air Conditioning</span>
                          <span className="font-medium text-emerald-400">Dual-Zone Clima</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-neutral-400">Daily Free Allowance</span>
                          <span className="font-medium text-white">Unlimited Km</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-neutral-400">Fuel Policy</span>
                          <span className="font-medium text-white">Fair (Like-to-Like)</span>
                        </div>
                      </div>

                      <div className="mt-4 p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Includes 24/7 Roadside Assistance</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span>Morocco Third Party Liability Included</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-400">Guaranteed rate</span>
                        <div className="text-lg sm:text-xl font-bold text-[#F5A623] tabular-nums font-display">
                          {formatPrice(car.dailyRate, currency)}/day
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/212653134372?text=${encodeURIComponent(
                            `Hello Yassine Location!\nI would like to rent the ${car.name} (${car.dailyRate} DH/day). Is it available?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
                          title="WhatsApp Yassine: 0653134372"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onSelectCar(car)}
                          className="px-3.5 py-2 bg-[#F5A623] hover:bg-[#e09618] text-black font-semibold rounded-lg text-xs transition-colors"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
