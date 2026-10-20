import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRentalDays,
  getDurationDiscountPercent,
  calculateRentalPricing,
  formatPrice,
  validateBookingDates,
  validateDriverDetails,
  generateBookingId,
} from './pricing.ts';

test('calculateRentalDays correctly calculates multi-day spans', () => {
  assert.equal(calculateRentalDays('2026-11-01', '2026-11-04'), 3);
  assert.equal(calculateRentalDays('2026-11-01', '2026-11-01'), 1); // same day minimum 1
  assert.equal(calculateRentalDays('', ''), 1);
});

test('getDurationDiscountPercent scales with rental length', () => {
  assert.equal(getDurationDiscountPercent(1), 0);
  assert.equal(getDurationDiscountPercent(3), 5);
  assert.equal(getDurationDiscountPercent(7), 10);
  assert.equal(getDurationDiscountPercent(14), 15);
  assert.equal(getDurationDiscountPercent(30), 20);
});

test('calculateRentalPricing accurately calculates base, discounts, add-ons and savings', () => {
  // Clio 5: 250 DH/day, market 360 DH/day
  // 7 days -> 10% discount on base
  // Base: 250 * 7 = 1750. Discount: 175. Discounted base: 1575.
  // Add-ons: 'full-insurance' (50 DH/day * 7 = 350 DH)
  // Final total: 1575 + 350 = 1925 DH
  const result = calculateRentalPricing({
    dailyRate: 250,
    marketRate: 360,
    days: 7,
    selectedAddOnIds: ['full-insurance'],
    currency: 'MAD',
  });

  assert.equal(result.days, 7);
  assert.equal(result.subtotalBase, 1750);
  assert.equal(result.durationDiscountPercent, 10);
  assert.equal(result.durationDiscountAmount, 175);
  assert.equal(result.addOnsTotal, 350);
  assert.equal(result.finalTotalMad, 1925);
  assert.ok(result.savingsMad > 0, 'Customer must save money compared to market rates');
});

test('formatPrice produces correct currency representations', () => {
  assert.equal(formatPrice(250, 'MAD'), '250 DH');
  assert.ok(formatPrice(250, 'EUR').includes('€'));
  assert.ok(formatPrice(250, 'USD').includes('$'));
});

test('validateBookingDates verifies chronological sequence', () => {
  const valid = validateBookingDates('2026-12-01', '2026-12-05');
  assert.equal(valid.isValid, true);

  const inverted = validateBookingDates('2026-12-10', '2026-12-05');
  assert.equal(inverted.isValid, false);
});

test('validateDriverDetails rejects empty or malformed fields and accepts complete input', () => {
  const invalid = validateDriverDetails({
    driverName: 'A',
    driverEmail: 'invalid-email',
    driverPhone: '123',
    licenseNumber: '',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.driverName);
  assert.ok(invalid.errors.driverEmail);
  assert.ok(invalid.errors.driverPhone);
  assert.ok(invalid.errors.licenseNumber);

  const valid = validateDriverDetails({
    driverName: 'Karim Bennani',
    driverEmail: 'karim@example.ma',
    driverPhone: '+212 661 22 33 44',
    licenseNumber: 'MA-9876543',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateBookingId generates unique branded reference string', () => {
  const id1 = generateBookingId();
  const id2 = generateBookingId();
  assert.match(id1, /^YL-\d{4}-\d{4}$/);
  assert.notEqual(id1, id2);
});
