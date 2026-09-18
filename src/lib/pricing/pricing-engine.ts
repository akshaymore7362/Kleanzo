// Kleanzo Server-Side Authoritative Pricing Engine

export interface ServiceItemInput {
  serviceId?: string;
  serviceSlug: string;
  serviceName: string;
  variantKey?: '2BHK' | '3BHK' | '4BHK' | 'OFFICE';
  quantity?: number;
  sqft?: number;
  customNotes?: string;
}

export interface PricingCalculationResult {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  gstRate: number; // 18%
  gstAmount: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  itemSnapshots: {
    serviceSlug: string;
    serviceName: string;
    variantKey?: string;
    quantity: number;
    sqft?: number;
    customNotes?: string;
    unitPrice: number;
    priceSnapshot: number;
    gstSnapshot: number;
    totalSnapshot: number;
    priceLabel: string;
  }[];
}

// Authoritative Rate Database Rules
export const OFFICIAL_SERVICE_RATES: Record<string, { basePrice: number; unit: string; name: string }> = {
  'deep-cleaning-2BHK': { basePrice: 9779, unit: 'PER_BHK', name: '2 BHK Deep Cleaning' },
  'deep-cleaning-3BHK': { basePrice: 12779, unit: 'PER_BHK', name: '3 BHK Deep Cleaning' },
  'deep-cleaning-4BHK': { basePrice: 14779, unit: 'PER_BHK', name: '4 BHK Deep Cleaning' },
  'deep-cleaning-OFFICE': { basePrice: 15, unit: 'PER_SQFT', name: 'Office Commercial Space' },
  'bathroom-cleaning': { basePrice: 1499, unit: 'PER_BATHROOM', name: 'Bathroom Cleaning' },
  'sofa-carpet': { basePrice: 1999, unit: 'PER_SET', name: 'Sofa & Carpet Shampooing' },
  'kitchen-cleaning': { basePrice: 2499, unit: 'FIXED', name: 'Kitchen Deep Cleaning' },
  'floor-stone': { basePrice: 25, unit: 'PER_SQFT', name: 'Floor & Stone Diamond Polish' },
  'stain-removal': { basePrice: 2999, unit: 'FIXED', name: 'Glue & Stain Removal' },
  'interior-handover': { basePrice: 4999, unit: 'FIXED', name: 'Interior Handover Mirror Polish' },
  'post-construction': { basePrice: 0, unit: 'CUSTOM', name: 'Post Construction Debris Clean' },
  'glass-facade': { basePrice: 0, unit: 'CUSTOM', name: 'Glass & Facade Polish' },
  'maintenance': { basePrice: 0, unit: 'CUSTOM', name: 'Periodic Site Maintenance' },
  'other': { basePrice: 0, unit: 'CUSTOM', name: 'Custom Cleaning Requirement' },
};

export function calculateBookingPrice(
  items: ServiceItemInput[],
  appliedDiscount: number = 0
): PricingCalculationResult {
  let subtotal = 0;
  const itemSnapshots = items.map((item) => {
    let unitPrice = 0;
    let itemTotal = 0;
    let priceLabel = '';

    if (item.serviceSlug === 'deep-cleaning') {
      const variant = item.variantKey || '3BHK';
      if (variant === 'OFFICE') {
        const sqft = item.sqft || item.quantity || 600;
        unitPrice = 15;
        itemTotal = sqft * 15;
        priceLabel = `₹${itemTotal.toLocaleString()}/- (${sqft} sqft @ ₹15/sqft)`;
      } else {
        const rateRule = OFFICIAL_SERVICE_RATES[`deep-cleaning-${variant}`] || OFFICIAL_SERVICE_RATES['deep-cleaning-3BHK'];
        unitPrice = rateRule.basePrice;
        itemTotal = unitPrice;
        priceLabel = `₹${unitPrice.toLocaleString()}/- (${variant})`;
      }
    } else if (item.serviceSlug === 'bathroom-cleaning') {
      const qty = item.quantity || 1;
      unitPrice = 1499;
      itemTotal = qty * unitPrice;
      priceLabel = `₹${itemTotal.toLocaleString()}/- (${qty} bathroom${qty > 1 ? 's' : ''})`;
    } else if (item.serviceSlug === 'sofa-carpet') {
      const qty = item.quantity || 1;
      unitPrice = 1999;
      itemTotal = qty * unitPrice;
      priceLabel = `₹${itemTotal.toLocaleString()}/- (${qty} set${qty > 1 ? 's' : ''})`;
    } else if (item.serviceSlug === 'floor-stone') {
      const sqft = item.sqft || 200;
      unitPrice = 25;
      itemTotal = sqft * unitPrice;
      priceLabel = `₹${itemTotal.toLocaleString()}/- (${sqft} sqft @ ₹25/sqft)`;
    } else {
      const rateRule = OFFICIAL_SERVICE_RATES[item.serviceSlug];
      unitPrice = rateRule ? rateRule.basePrice : 0;
      itemTotal = unitPrice * (item.quantity || 1);
      priceLabel = itemTotal > 0 ? `₹${itemTotal.toLocaleString()}/-` : 'Price to be confirmed upon site visit';
    }

    subtotal += itemTotal;
    const gstItem = Math.round(itemTotal * 0.18);

    return {
      serviceSlug: item.serviceSlug,
      serviceName: item.serviceName,
      variantKey: item.variantKey,
      quantity: item.quantity || 1,
      sqft: item.sqft,
      customNotes: item.customNotes,
      unitPrice,
      priceSnapshot: itemTotal,
      gstSnapshot: gstItem,
      totalSnapshot: itemTotal + gstItem,
      priceLabel,
    };
  });

  const discount = Math.min(subtotal, appliedDiscount);
  const taxableAmount = Math.max(0, subtotal - discount);
  const gstRate = 18.0;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + gstAmount;

  // Advance Payment: ₹2,500 minimum or full total if total < ₹2,500
  const advanceAmount = Math.min(2500, totalAmount);
  const balanceAmount = Math.max(0, totalAmount - advanceAmount);

  return {
    subtotal,
    discount,
    taxableAmount,
    gstRate,
    gstAmount,
    totalAmount,
    advanceAmount,
    balanceAmount,
    itemSnapshots,
  };
}

export const calculateBookingPricing = calculateBookingPrice;

