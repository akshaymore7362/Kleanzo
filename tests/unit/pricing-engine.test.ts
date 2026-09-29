import { calculateBookingPricing } from '../../src/lib/pricing/pricing-engine';

describe('Authoritative Pricing Engine Unit Tests', () => {
  test('Calculates multi-service subtotal, 18% GST, advance, and balance correctly', () => {
    const items = [
      { serviceSlug: 'deep-cleaning', variantSlug: '3-bhk', quantity: 1 }, // ₹12,779
      { serviceSlug: 'bathroom-cleaning', quantity: 2 }, // ₹1,499 * 2 = ₹2,998
      { serviceSlug: 'sofa-carpet', quantity: 1 }, // ₹1,999
    ];

    const result = calculateBookingPricing(items);

    expect(result.subtotal).toBe(12779 + 2998 + 1999); // 17,776
    expect(result.gstAmount).toBe(Math.round(17776 * 0.18)); // 3,200
    expect(result.totalAmount).toBe(17776 + 3200); // 20,976
    expect(result.advanceAmount).toBe(499); // Fixed advance ₹499
    expect(result.balanceAmount).toBe(20976 - 499); // 20,477
  });

  test('Preserves official Kleanzo rates without rounding distortion', () => {
    const items = [
      { serviceSlug: 'deep-cleaning', variantSlug: '2-bhk', quantity: 1 }, // ₹9,779
    ];

    const result = calculateBookingPricing(items);
    expect(result.subtotal).toBe(9779);
  });
});
