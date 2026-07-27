export interface ValidationResult {
  isValid: boolean;
  zone: 'dhaka_metro' | 'regional_hub' | 'suburban_district' | 'remote_logistics' | 'invalid';
  zoneName: string;
  shippingFee: number;
  freeShippingThreshold: number;
  estimatedDelivery: string;
  badgeColor: string;
  message: string;
  suggestions?: string[];
  details?: {
    matchedCity?: string;
    matchedPostalCode?: string;
    normalizedAddress?: string;
    isExpressAvailable: boolean;
  };
}

// Supported Delivery Zones in Bangladesh
const DHAKA_METRO_AREAS = [
  "dhaka", "gulshan", "banani", "dhanmondi", "uttara", "mirpur", "mohammadpur",
  "motijheel", "badda", "tejgaon", "ramna", "khilgaon", "lalbagh", "old dhaka",
  "bashundhara", "nikunja", "baridhara", "malibagh", "moghbazar", "kalyanpur",
  "farmgate", "agargaon", "paltan", "shahbagh", "jatra bari", "demra", "sutrapur",
  "keraniganj", "savar", "tongi"
];

const REGIONAL_HUBS = [
  "chittagong", "chatogram", "sylhet", "rajshahi", "khulna", "barisal",
  "rangpur", "mymensingh", "comilla", "cumilla", "gazipur", "narayanganj",
  "bogura", "bogra", "cox's bazar", "feni", "noakhali", "jessore", "jashore"
];

const REMOTE_CHAR_LOGISTICS = [
  "saint martin", "st. martin", "sandwip", "hatiya", "kutubdia", "manpura",
  "char fashion", "chilmari", "bhurungamari", "thanchi", "ruma"
];

export function validateShippingAddress(
  address: string,
  city: string,
  postalCode: string,
  subtotal: number = 0
): ValidationResult {
  const combinedText = `${address} ${city} ${postalCode}`.toLowerCase().trim();

  // Basic check for empty or too short address
  if (!address.trim() || address.trim().length < 5) {
    return {
      isValid: false,
      zone: 'invalid',
      zoneName: 'Incomplete Address',
      shippingFee: 120,
      freeShippingThreshold: 2000,
      estimatedDelivery: '2 - 4 Days',
      badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
      message: 'Please enter a complete street address (house/road/area) for accurate delivery calculation.',
      suggestions: [
        'Include house or apartment number',
        'Add road/street name or block',
        'Mention nearby prominent landmark'
      ]
    };
  }

  // Check remote island / char area
  const isRemote = REMOTE_CHAR_LOGISTICS.some(term => combinedText.includes(term));
  if (isRemote) {
    return {
      isValid: true,
      zone: 'remote_logistics',
      zoneName: 'Special Island / Remote Logistics Zone',
      shippingFee: 180,
      freeShippingThreshold: 5000,
      estimatedDelivery: '5 - 7 Business Days',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      message: '⚠️ Special riverine/island transit location detected. Phone confirmation will be required before dispatch.',
      details: {
        isExpressAvailable: false,
        normalizedAddress: `${address}, ${city}`
      }
    };
  }

  // Check Dhaka Metro Zone
  const isDhaka = DHAKA_METRO_AREAS.some(area => combinedText.includes(area)) || city.toLowerCase().includes("dhaka");
  if (isDhaka) {
    const fee = subtotal >= 2000 ? 0 : 60;
    return {
      isValid: true,
      zone: 'dhaka_metro',
      zoneName: 'Dhaka Metropolitan (Express Zone)',
      shippingFee: fee,
      freeShippingThreshold: 2000,
      estimatedDelivery: 'Same-Day or Next-Day (24 Hours)',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      message: fee === 0 
        ? '🎉 FREE Express Shipping unlocked for Dhaka Metro!' 
        : `⚡ Express 24-Hour Delivery available! Add ৳${Math.max(0, 2000 - subtotal).toLocaleString()} more for FREE shipping.`,
      details: {
        matchedCity: 'Dhaka',
        isExpressAvailable: true,
        normalizedAddress: `${address}, Dhaka`
      }
    };
  }

  // Check Regional Hubs
  const isRegional = REGIONAL_HUBS.some(hub => combinedText.includes(hub));
  if (isRegional) {
    const fee = subtotal >= 2500 ? 0 : 100;
    return {
      isValid: true,
      zone: 'regional_hub',
      zoneName: 'Major Divisional / City Hub',
      shippingFee: fee,
      freeShippingThreshold: 2500,
      estimatedDelivery: '2 - 3 Business Days',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      message: fee === 0 
        ? '🎉 FREE Courier Delivery unlocked!' 
        : `🚚 Verified Regional Delivery Service area. Add ৳${Math.max(0, 2500 - subtotal).toLocaleString()} more for FREE shipping.`,
      details: {
        matchedCity: city || 'Divisional Hub',
        isExpressAvailable: false,
        normalizedAddress: `${address}, ${city}`
      }
    };
  }

  // General Nationwide District Zone
  const fee = subtotal >= 3000 ? 0 : 130;
  return {
    isValid: true,
    zone: 'suburban_district',
    zoneName: 'Nationwide Courier Coverage Zone',
    shippingFee: fee,
    freeShippingThreshold: 3000,
    estimatedDelivery: '3 - 5 Business Days',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    message: fee === 0 
      ? '🎉 FREE Countrywide Delivery unlocked!' 
      : '📦 Standard Doorstep Courier Delivery available across Bangladesh.',
    details: {
      matchedCity: city || 'District Hub',
      isExpressAvailable: false,
      normalizedAddress: `${address}${city ? `, ${city}` : ''}`
    }
  };
}
