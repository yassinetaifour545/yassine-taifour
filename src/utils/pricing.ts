import { ADD_ONS } from '../data/fleet.ts';
import type { Currency } from '../types/index.ts';

export interface RentalPriceBreakdown {
  days: number;
  baseDailyRate: number;
  subtotalBase: number;
  durationDiscountPercent: number;
  durationDiscountAmount: number;
  addOnsDailyTotal: number;
  addOnsTotal: number;
  finalTotalMad: number;
  competitorMarketRate: number;
  competitorTotalMad: number;
  savingsMad: number;
  savingsPercent: number;
  convertedTotal: number;
  convertedCurrency: Currency;
}

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; decimals: number }> = {
  MAD: { rate: 1, symbol: 'DH', decimals: 0 },
  EUR: { rate: 0.093, symbol: '€', decimals: 1 },
  USD: { rate: 0.10, symbol: '$', decimals: 1 },
};

/**
 * Calculates total rental days between pickup and return date strings (YYYY-MM-DD).
 * Minimum rental period is 1 full day.
 */
export function calculateRentalDays(pickupDate: string, returnDate: string): number {
  if (!pickupDate || !returnDate) return 1;
  const start = new Date(pickupDate);
  const end = new Date(returnDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1;
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Determines volume discount based on trip duration:
 * 7+ days: 10% off
 * 14+ days: 15% off
 * 30+ days: 20% off
 */
export function getDurationDiscountPercent(days: number): number {
  if (days >= 30) return 20;
  if (days >= 14) return 15;
  if (days >= 7) return 10;
  if (days >= 3) return 5;
  return 0;
}

/**
 * Pure calculation function for rental price breakdown.
 */
export function calculateRentalPricing(params: {
  dailyRate: number;
  marketRate: number;
  days: number;
  selectedAddOnIds: string[];
  currency?: Currency;
}): RentalPriceBreakdown {
  const { dailyRate, marketRate, days, selectedAddOnIds, currency = 'MAD' } = params;

  const validDays = Math.max(1, days);
  const subtotalBase = dailyRate * validDays;

  const durationDiscountPercent = getDurationDiscountPercent(validDays);
  const durationDiscountAmount = Math.round((subtotalBase * durationDiscountPercent) / 100);
  const discountedBase = subtotalBase - durationDiscountAmount;

  // Add-ons total
  const selectedAddOnsList = ADD_ONS.filter((a) => selectedAddOnIds.includes(a.id));
  const addOnsDailyTotal = selectedAddOnsList.reduce((sum, item) => sum + item.pricePerDay, 0);
  const addOnsTotal = addOnsDailyTotal * validDays;

  const finalTotalMad = discountedBase + addOnsTotal;

  // Competitor standard calculation
  const competitorTotalMad = marketRate * validDays + addOnsTotal;
  const savingsMad = Math.max(0, competitorTotalMad - finalTotalMad);
  const savingsPercent = competitorTotalMad > 0 ? Math.round((savingsMad / competitorTotalMad) * 100) : 0;

  // Currency conversion
  const rateConfig = CURRENCY_RATES[currency] || CURRENCY_RATES.MAD;
  const convertedTotal = Math.round(finalTotalMad * rateConfig.rate);

  return {
    days: validDays,
    baseDailyRate: dailyRate,
    subtotalBase,
    durationDiscountPercent,
    durationDiscountAmount,
    addOnsDailyTotal,
    addOnsTotal,
    finalTotalMad,
    competitorMarketRate: marketRate,
    competitorTotalMad,
    savingsMad,
    savingsPercent,
    convertedTotal,
    convertedCurrency: currency,
  };
}

/**
 * Formats monetary amounts with currency symbol.
 */
export function formatPrice(amountMad: number, currency: Currency = 'MAD'): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.MAD;
  const converted = Math.round(amountMad * config.rate);

  if (currency === 'MAD') {
    return `${converted} ${config.symbol}`;
  }
  return `${config.symbol}${converted.toLocaleString()}`;
}

/**
 * Validates booking pickup and return dates.
 */
export function validateBookingDates(
  pickupDate: string,
  returnDate: string
): { isValid: boolean; error?: string } {
  if (!pickupDate) {
    return { isValid: false, error: 'Please choose a pick-up date.' };
  }
  if (!returnDate) {
    return { isValid: false, error: 'Please choose a return date.' };
  }

  const start = new Date(pickupDate);
  const end = new Date(returnDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid date selection.' };
  }

  // Today at midnight for check
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (start < now) {
    return { isValid: false, error: 'Pick-up date cannot be in the past.' };
  }

  if (end < start) {
    return { isValid: false, error: 'Return date must be on or after pick-up date.' };
  }

  return { isValid: true };
}

/**
 * Validates driver information inputs.
 */
export function validateDriverDetails(data: {
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  licenseNumber: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const sanitizedName = data.driverName.trim();
  if (!sanitizedName || sanitizedName.length < 3) {
    errors.driverName = 'Full name must be at least 3 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.driverEmail || !emailRegex.test(data.driverEmail.trim())) {
    errors.driverEmail = 'Please provide a valid email address.';
  }

  const sanitizedPhone = data.driverPhone.replace(/[\s-]/g, '');
  if (!sanitizedPhone || sanitizedPhone.length < 8) {
    errors.driverPhone = 'Please provide a valid phone number with country code.';
  }

  const sanitizedLicense = data.licenseNumber.trim();
  if (!sanitizedLicense || sanitizedLicense.length < 4) {
    errors.licenseNumber = 'Valid driver’s license number required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates an official booking reference code.
 */
export function generateBookingId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `YL-${year}-${randomSuffix}`;
}
