import { Product, PriceHistoryRecord } from '../types';

export interface MarketSourceFeed {
  mandiHub: string;
  district: string;
  auctionSession: string;
  sentiment: 'Surplus' | 'Moderate' | 'Tight Supply' | 'Monsoon Influx';
  weatherImpact: string;
}

export const KERALA_MANDI_HUBS: MarketSourceFeed[] = [
  {
    mandiHub: 'Aluva Central Mandi Yard',
    district: 'Ernakulam',
    auctionSession: 'Morning Primary Auction (04:00 AM - 07:30 AM)',
    sentiment: 'Moderate',
    weatherImpact: 'Normal coastal arrivals; steady logistics from Idukki',
  },
  {
    mandiHub: 'Chalai Market Wholesale Yard',
    district: 'Thiruvananthapuram',
    auctionSession: 'Dawn Border Consignment (03:30 AM - 06:45 AM)',
    sentiment: 'Surplus',
    weatherImpact: 'Heavy cross-border inflows from Nagercoil & Tenkasi',
  },
  {
    mandiHub: 'Vengeri Agricultural Wholesale Market',
    district: 'Kozhikode',
    auctionSession: 'Malabar Regional Dispatch (05:00 AM - 08:30 AM)',
    sentiment: 'Moderate',
    weatherImpact: 'Steady Wayanad and Mysore produce arrivals',
  },
  {
    mandiHub: 'Vattavada & Kanthalloor High-Altitude Hub',
    district: 'Idukki',
    auctionSession: 'Farm Gate Cooperative Collection (06:00 AM)',
    sentiment: 'Surplus',
    weatherImpact: 'Cool mountain harvest: excellent cabbage, carrot, and beans',
  },
];

export interface AutoPriceUpdateResult {
  updatedProducts: Product[];
  newHistoryRecords: PriceHistoryRecord[];
  timestamp: string;
  summary: {
    totalUpdated: number;
    droppedCount: number;
    increasedCount: number;
    stableCount: number;
    headline: string;
    mandiSource: string;
  };
}

/**
 * Deterministic or simulated daily market rate fluctuation engine
 * Generates realistic wholesale mandi daily price movements (-12% to +10%)
 * respecting wholesale tier ratios, seasonal volatility, and Kerala mandi rules.
 */
export function simulateDailyMarketPrices(
  currentProducts: Product[],
  options: {
    sourceHub?: string;
    intensity?: 'normal' | 'volatile' | 'surplus';
    customTimestamp?: string;
    changedBy?: string;
  } = {}
): AutoPriceUpdateResult {
  const now = new Date();
  const timeString = options.customTimestamp ||
    `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;
  const dateStr = now.toISOString().split('T')[0];

  const sourceHub = options.sourceHub ||
    KERALA_MANDI_HUBS[Math.floor(Math.random() * KERALA_MANDI_HUBS.length)].mandiHub;

  const newHistoryRecords: PriceHistoryRecord[] = [];
  let droppedCount = 0;
  let increasedCount = 0;
  let stableCount = 0;

  // Commodity price volatility profile multipliers
  const categoryVolatility: Record<string, number> = {
    'Daily Cooking Staples': 0.08, // 8% range (Tomatoes, Onions, Potatoes fluctuate daily)
    'Kerala Staples & Tubers': 0.05, // 5% range (Chena, Tapioca, Plantain are more resilient)
    'Leafy Greens & Cheera': 0.12, // 12% range (Perishable greens change rapidly based on rain/arrivals)
    'Gourds, Beans & Drumstick': 0.09, // 9% range (Pavakka, Yard beans fluctuate by harvest)
    'Chillies, Ginger & Spices': 0.07, // 7% range (Pachamulaku, Inji)
    'Wholesale Crates & Sacks': 0.06, // Bulk sacks
  };

  const updatedProducts = currentProducts.map((product) => {
    const baseVolatility = categoryVolatility[product.category] || 0.07;
    const mult = options.intensity === 'volatile' ? 1.4 : options.intensity === 'surplus' ? 0.8 : 1.0;
    const maxChangePercent = baseVolatility * mult;

    // Pseudo-random fluctuation centered around slight buyer savings (-3% bias for market freshness)
    // Range between -maxChangePercent and +(maxChangePercent * 0.85)
    const randomFactor = (Math.random() * 2 - 1.15); // slightly skewed towards downward bargain rates
    const percentDelta = randomFactor * maxChangePercent;

    // Minimum rate step is ₹1.00 or ₹0.50
    const rawNewRetail = product.retailPrice * (1 + percentDelta);
    let newRetailPrice = Math.round(rawNewRetail);

    // Keep minimum safety floor
    if (newRetailPrice < 15) newRetailPrice = 15;

    // Calculate wholesale discount (typically 20% to 28% below retail in Kerala mandis)
    const wholesaleDiscountRatio = product.wholesalePrice && product.retailPrice
      ? product.wholesalePrice / product.retailPrice
      : 0.74;
    let newWholesalePrice = Math.round(newRetailPrice * wholesaleDiscountRatio);
    if (newWholesalePrice >= newRetailPrice) {
      newWholesalePrice = Math.max(12, newRetailPrice - 4);
    }

    // Determine direction
    let changeDirection: 'up' | 'down' | 'unchanged' = 'unchanged';
    if (newRetailPrice > product.retailPrice) {
      changeDirection = 'up';
      increasedCount++;
    } else if (newRetailPrice < product.retailPrice) {
      changeDirection = 'down';
      droppedCount++;
    } else {
      stableCount++;
    }

    // Update wholesale tiers if present
    const updatedTiers = (product.wholesaleTiers || []).map((tier) => {
      if (tier.minQty <= 9) {
        return { ...tier, price: newRetailPrice };
      }
      if (tier.minQty >= 25) {
        // Bulk sack tier gets additional volume price
        return { ...tier, price: Math.max(10, Math.round(newWholesalePrice * 0.88)) };
      }
      return { ...tier, price: newWholesalePrice };
    });

    // Create history entry if price actually altered
    if (newRetailPrice !== product.retailPrice || newWholesalePrice !== product.wholesalePrice) {
      const reasonPrefix =
        changeDirection === 'down'
          ? `Mandi surplus arrivals at ${sourceHub}`
          : `Higher farmgate procurement cost at ${sourceHub}`;

      newHistoryRecords.push({
        id: `ph-auto-${Date.now()}-${product.id}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        productName: product.name,
        oldPrice: product.retailPrice,
        newPrice: newRetailPrice,
        priceType: 'retail',
        unit: String(product.unit),
        effectiveAt: `${dateStr} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        changedBy: options.changedBy || `Automated Mandi Sync (${sourceHub.split(' ')[0]})`,
        reason: `${reasonPrefix} • Daily morning rate benchmark`,
      });
    }

    return {
      ...product,
      previousRetailPrice: product.retailPrice,
      previousWholesalePrice: product.wholesalePrice,
      retailPrice: newRetailPrice,
      wholesalePrice: newWholesalePrice,
      wholesaleTiers: updatedTiers,
      priceChangeDirection: changeDirection,
      lastPriceUpdate: timeString,
      priceUpdatedToday: true,
    };
  });

  const headline =
    droppedCount >= increasedCount
      ? `Morning market arrivals dropped rates on ${droppedCount} produce items across Kerala mandis.`
      : `Market update calibrated: ${increasedCount} items firmer, ${droppedCount} bargain price drops.`;

  return {
    updatedProducts,
    newHistoryRecords,
    timestamp: timeString,
    summary: {
      totalUpdated: currentProducts.length,
      droppedCount,
      increasedCount,
      stableCount,
      headline,
      mandiSource: sourceHub,
    },
  };
}
