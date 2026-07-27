export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: number;
  categoryName?: string;
  images: string[];
  badge: string | null;
  featured: boolean;
  rating: number;
  reviewCount: number;
  specs: Record<string, string>;
  createdAt?: string;
}

export interface ReviewData {
  id: number;
  productId: number;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt?: string;
}

export const FALLBACK_CATEGORIES: CategoryData[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronic devices and gadgets",
    image: "https://images.pexels.com/photos/4533076/pexels-photo-4533076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 2,
    name: "Smartphones",
    slug: "smartphones",
    description: "Premium smartphones and mobile devices",
    image: "https://images.pexels.com/photos/36680544/pexels-photo-36680544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 3,
    name: "Audio",
    slug: "audio",
    description: "Headphones, speakers and audio equipment",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 4,
    name: "Wearables",
    slug: "wearables",
    description: "Smartwatches and fitness trackers",
    image: "https://images.pexels.com/photos/12564670/pexels-photo-12564670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 5,
    name: "Gaming",
    slug: "gaming",
    description: "Gaming peripherals and accessories",
    image: "https://images.pexels.com/photos/4225229/pexels-photo-4225229.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 6,
    name: "Jerseys",
    slug: "jerseys",
    description: "Sports jerseys and athletic wear",
    image: "https://images.pexels.com/photos/15986812/pexels-photo-15986812.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 7,
    name: "Photography",
    slug: "photography",
    description: "Cameras, lenses and photography gear",
    image: "https://images.pexels.com/photos/9660955/pexels-photo-9660955.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

export const FALLBACK_PRODUCTS: ProductData[] = [
  {
    id: 1,
    name: "ProBook Laptop 15\" Ultra",
    slug: "probook-laptop-15-ultra",
    description: "Experience unparalleled performance with the ProBook Laptop 15\" Ultra. Powered by the latest Intel Core i7 processor and 16GB RAM, this sleek aluminum-body laptop delivers blazing-fast speeds for work and play. The stunning 15.6\" 4K IPS display brings every detail to life with vibrant colors and deep blacks.",
    price: 89999,
    compareAtPrice: 109999,
    categoryId: 1,
    categoryName: "Electronics",
    images: [
      "https://images.pexels.com/photos/4533076/pexels-photo-4533076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/8346916/pexels-photo-8346916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "Best Seller",
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    specs: {
      Processor: "Intel Core i7-13700H",
      RAM: "16GB DDR5",
      Storage: "512GB NVMe SSD",
      Display: "15.6\" 4K IPS",
    },
  },
  {
    id: 2,
    name: "Galaxy Nova X Pro",
    slug: "galaxy-nova-x-pro",
    description: "The Galaxy Nova X Pro redefines mobile photography with its groundbreaking 200MP main camera and AI-powered image processing. The 6.8\" Dynamic AMOLED display delivers breathtaking visuals at 120Hz.",
    price: 119999,
    compareAtPrice: 134999,
    categoryId: 2,
    categoryName: "Smartphones",
    images: [
      "https://images.pexels.com/photos/11120516/pexels-photo-11120516.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/14979013/pexels-photo-14979013.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "Flagship",
    featured: true,
    rating: 4.9,
    reviewCount: 215,
    specs: {
      Display: "6.8\" Dynamic AMOLED 2X",
      Processor: "Snapdragon 8 Gen 3",
      RAM: "12GB",
      Storage: "256GB",
    },
  },
  {
    id: 3,
    name: "SoundElite Pro ANC Headphones",
    slug: "soundelite-pro-anc",
    description: "Immerse yourself in pure sound with the SoundElite Pro. Industry-leading Active Noise Cancellation blocks out the world while premium 40mm drivers deliver rich, detailed audio.",
    price: 29999,
    compareAtPrice: 39999,
    categoryId: 3,
    categoryName: "Audio",
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "Top Rated",
    featured: true,
    rating: 4.7,
    reviewCount: 342,
    specs: {
      Driver: "40mm",
      NoiseCancellation: "Hybrid ANC",
      BatteryLife: "40 Hours",
    },
  },
  {
    id: 4,
    name: "FitPulse Ultra Smartwatch",
    slug: "fitpulse-ultra-smartwatch",
    description: "The FitPulse Ultra is your ultimate health and fitness companion with ECG, SpO2, and 7-day battery life.",
    price: 24999,
    compareAtPrice: 29999,
    categoryId: 4,
    categoryName: "Wearables",
    images: [
      "https://images.pexels.com/photos/31541678/pexels-photo-31541678.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "Popular",
    featured: true,
    rating: 4.6,
    reviewCount: 267,
    specs: {
      Display: "1.5\" AMOLED",
      BatteryLife: "7 Days",
    },
  },
  {
    id: 5,
    name: "StrikeForce Mechanical Keyboard",
    slug: "strikeforce-mechanical-keyboard",
    description: "Featuring Cherry MX switches, per-key RGB lighting, and aluminum frame for competitive gaming.",
    price: 12999,
    compareAtPrice: 15999,
    categoryId: 5,
    categoryName: "Gaming",
    images: [
      "https://images.pexels.com/photos/8219211/pexels-photo-8219211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "Hot",
    featured: true,
    rating: 4.7,
    reviewCount: 189,
    specs: {
      SwitchType: "Cherry MX Red",
      Layout: "Full-size",
    },
  },
  {
    id: 6,
    name: "Bangladesh Cricket Team Jersey 2025",
    slug: "bangladesh-cricket-jersey-2025",
    description: "Official Bangladesh Cricket Team Jersey 2025 edition with moisture-wicking DryFit fabric.",
    price: 2499,
    compareAtPrice: 3499,
    categoryId: 6,
    categoryName: "Jerseys",
    images: [
      "https://images.pexels.com/photos/15986812/pexels-photo-15986812.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "Limited Edition",
    featured: true,
    rating: 4.8,
    reviewCount: 312,
    specs: {
      Material: "100% Polyester DryFit",
      Sizes: "S, M, L, XL, XXL",
    },
  },
  {
    id: 7,
    name: "OptiLens DSLR Camera Kit",
    slug: "optilens-dslr-camera-kit",
    description: "Professional-grade bundle with 24.2MP full-frame body, 18-55mm and 55-200mm lenses.",
    price: 159999,
    compareAtPrice: 189999,
    categoryId: 7,
    categoryName: "Photography",
    images: [
      "https://images.pexels.com/photos/9660955/pexels-photo-9660955.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "Pro Choice",
    featured: true,
    rating: 4.9,
    reviewCount: 78,
    specs: {
      Sensor: "24.2MP Full Frame",
      Video: "4K 60fps",
    },
  },
  {
    id: 8,
    name: "UltraView 27\" 4K Monitor",
    slug: "ultraview-27-4k-monitor",
    description: "3840x2160 IPS panel with 99% sRGB coverage, HDR400 support, and 144Hz refresh rate.",
    price: 44999,
    compareAtPrice: 54999,
    categoryId: 1,
    categoryName: "Electronics",
    images: [
      "https://images.pexels.com/photos/5552789/pexels-photo-5552789.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ],
    badge: "New",
    featured: true,
    rating: 4.6,
    reviewCount: 87,
    specs: {
      Resolution: "3840x2160",
      RefreshRate: "144Hz",
    },
  },
];

export const FALLBACK_REVIEWS: ReviewData[] = [
  {
    id: 1,
    productId: 1,
    author: "Rahim Khan",
    rating: 5,
    title: "Absolutely love it!",
    body: "This laptop exceeded all my expectations. Fast performance and premium screen quality.",
    verified: true,
  },
  {
    id: 2,
    productId: 1,
    author: "Fatima Begum",
    rating: 5,
    title: "Best purchase this year",
    body: "Delivered promptly by TRUSTWAVE BD. Highly satisfied!",
    verified: true,
  },
];
