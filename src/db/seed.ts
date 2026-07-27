import { db } from "./index";
import { categories, products, reviews, admins } from "./schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  if (!db) {
    console.error("DATABASE_URL is not set. Skipping seed.");
    return;
  }

  // Check if already seeded admins
  const existingAdmins = await db.execute(sql`SELECT count(*) as c FROM admins`);
  const adminCount = Number((existingAdmins.rows[0] as Record<string, unknown>).c);
  if (adminCount === 0) {
    console.log("Seeding admins...");
    const passwordHash = await bcrypt.hash("nrmsa", 10);
    await db.insert(admins).values([
      { username: "Rusafi", passwordHash, name: "Rusafi", role: "superadmin" },
      { username: "Mahir", passwordHash, name: "Mahir", role: "admin" },
      { username: "Nirob", passwordHash, name: "Nirob", role: "admin" },
      { username: "Alhan", passwordHash, name: "Alhan", role: "admin" },
    ]);
    console.log("Admins seeded.");
  }

  // Check if already seeded products
  const existing = await db.execute(sql`SELECT count(*) as c FROM products`);
  const count = Number((existing.rows[0] as Record<string, unknown>).c);
  if (count > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database...");

  // Insert categories
  const cats = await db
    .insert(categories)
    .values([
      {
        name: "Electronics",
        slug: "electronics",
        description: "Latest electronic devices and gadgets",
        image: "https://images.pexels.com/photos/4533076/pexels-photo-4533076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        name: "Smartphones",
        slug: "smartphones",
        description: "Premium smartphones and mobile devices",
        image: "https://images.pexels.com/photos/36680544/pexels-photo-36680544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        name: "Audio",
        slug: "audio",
        description: "Headphones, speakers and audio equipment",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        name: "Wearables",
        slug: "wearables",
        description: "Smartwatches and fitness trackers",
        image: "https://images.pexels.com/photos/12564670/pexels-photo-12564670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        name: "Gaming",
        slug: "gaming",
        description: "Gaming peripherals and accessories",
        image: "https://images.pexels.com/photos/4225229/pexels-photo-4225229.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        name: "Jerseys",
        slug: "jerseys",
        description: "Sports jerseys and athletic wear",
        image: "https://images.pexels.com/photos/15986812/pexels-photo-15986812.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        name: "Photography",
        slug: "photography",
        description: "Cameras, lenses and photography gear",
        image: "https://images.pexels.com/photos/9660955/pexels-photo-9660955.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
    ])
    .returning();

  const catMap: Record<string, number> = {};
  cats.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // Insert products
  const prods = await db
    .insert(products)
    .values([
      // Electronics
      {
        name: "ProBook Laptop 15\" Ultra",
        slug: "probook-laptop-15-ultra",
        description:
          "Experience unparalleled performance with the ProBook Laptop 15\" Ultra. Powered by the latest Intel Core i7 processor and 16GB RAM, this sleek aluminum-body laptop delivers blazing-fast speeds for work and play. The stunning 15.6\" 4K IPS display brings every detail to life with vibrant colors and deep blacks. With 512GB NVMe SSD storage, Wi-Fi 6E, and a battery that lasts up to 12 hours, it's the perfect companion for professionals on the go.",
        price: "89999",
        compareAtPrice: "109999",
        categoryId: catMap["electronics"],
        images: [
          "https://images.pexels.com/photos/4533076/pexels-photo-4533076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/8346916/pexels-photo-8346916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/12880803/pexels-photo-12880803.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Best Seller",
        featured: true,
        rating: "4.8",
        reviewCount: 124,
        specs: {
          Processor: "Intel Core i7-13700H",
          RAM: "16GB DDR5",
          Storage: "512GB NVMe SSD",
          Display: '15.6" 4K IPS',
          Battery: "12 Hours",
          Weight: "1.8 kg",
        },
      },
      {
        name: "UltraView 27\" 4K Monitor",
        slug: "ultraview-27-4k-monitor",
        description:
          "Transform your workspace with the UltraView 27\" 4K Monitor. Featuring a stunning 3840x2160 IPS panel with 99% sRGB coverage, HDR400 support, and a 144Hz refresh rate. USB-C connectivity with 65W power delivery means you can charge your laptop while you work. The ergonomic stand adjusts for height, tilt, and pivot to keep you comfortable all day long.",
        price: "44999",
        compareAtPrice: "54999",
        categoryId: catMap["electronics"],
        images: [
          "https://images.pexels.com/photos/5552789/pexels-photo-5552789.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/29283981/pexels-photo-29283981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "New",
        featured: true,
        rating: "4.6",
        reviewCount: 87,
        specs: {
          Resolution: "3840x2160",
          "Panel Type": "IPS",
          "Refresh Rate": "144Hz",
          HDR: "HDR400",
          Connectivity: "USB-C, HDMI 2.1, DP 1.4",
        },
      },
      {
        name: "MiniPC Pro Desktop",
        slug: "minipc-pro-desktop",
        description:
          "Don't let the size fool you — the MiniPC Pro packs serious performance into a compact form factor. With AMD Ryzen 7, 32GB RAM, and 1TB SSD, it handles everything from video editing to software development with ease. Silent cooling system, dual monitor support, and extensive I/O ports make it perfect for any desk setup.",
        price: "64999",
        categoryId: catMap["electronics"],
        images: [
          "https://images.pexels.com/photos/3568521/pexels-photo-3568521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.5",
        reviewCount: 56,
        specs: {
          Processor: "AMD Ryzen 7 7800X",
          RAM: "32GB DDR5",
          Storage: "1TB NVMe SSD",
          "GPU": "Integrated Radeon 780M",
        },
      },

      // Smartphones
      {
        name: "Galaxy Nova X Pro",
        slug: "galaxy-nova-x-pro",
        description:
          "The Galaxy Nova X Pro redefines mobile photography with its groundbreaking 200MP main camera and AI-powered image processing. The 6.8\" Dynamic AMOLED display delivers breathtaking visuals at 120Hz, while the Snapdragon 8 Gen 3 processor ensures seamless multitasking. With 5000mAh battery, 45W fast charging, and IP68 water resistance, this flagship smartphone is built for the demands of modern life.",
        price: "119999",
        compareAtPrice: "134999",
        categoryId: catMap["smartphones"],
        images: [
          "https://images.pexels.com/photos/11120516/pexels-photo-11120516.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/14979013/pexels-photo-14979013.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/36680544/pexels-photo-36680544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Flagship",
        featured: true,
        rating: "4.9",
        reviewCount: 215,
        specs: {
          Display: '6.8" Dynamic AMOLED 2X',
          Processor: "Snapdragon 8 Gen 3",
          RAM: "12GB",
          Storage: "256GB",
          Camera: "200MP + 50MP + 12MP",
          Battery: "5000mAh",
        },
      },
      {
        name: "PixelEdge 8 Lite",
        slug: "pixeledge-8-lite",
        description:
          "Get flagship features at a mid-range price with the PixelEdge 8 Lite. Its 6.4\" OLED display, clean Android experience, and impressive 108MP camera deliver premium quality without breaking the bank. The 4500mAh battery with 30W fast charging keeps you going all day. Perfect for anyone who wants great performance at an affordable price.",
        price: "34999",
        categoryId: catMap["smartphones"],
        images: [
          "https://images.pexels.com/photos/17984647/pexels-photo-17984647.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/14979013/pexels-photo-14979013.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Value Pick",
        featured: false,
        rating: "4.4",
        reviewCount: 178,
        specs: {
          Display: '6.4" OLED',
          Processor: "Dimensity 9200",
          RAM: "8GB",
          Storage: "128GB",
          Camera: "108MP + 8MP + 2MP",
          Battery: "4500mAh",
        },
      },

      // Audio
      {
        name: "SoundElite Pro ANC Headphones",
        slug: "soundelite-pro-anc",
        description:
          "Immerse yourself in pure sound with the SoundElite Pro. Industry-leading Active Noise Cancellation blocks out the world while premium 40mm drivers deliver rich, detailed audio. With 40 hours of battery life, multipoint Bluetooth 5.3, and plush memory foam ear cushions, these headphones are designed for audiophiles who demand the best. Touch controls and built-in microphone array ensure crystal-clear calls.",
        price: "29999",
        compareAtPrice: "39999",
        categoryId: catMap["audio"],
        images: [
          "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/3394648/pexels-photo-3394648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/3394662/pexels-photo-3394662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Top Rated",
        featured: true,
        rating: "4.7",
        reviewCount: 342,
        specs: {
          "Driver Size": "40mm",
          "Noise Cancellation": "Hybrid ANC",
          "Battery Life": "40 Hours",
          Bluetooth: "5.3 with Multipoint",
          Weight: "250g",
          Codec: "LDAC, AAC, SBC",
        },
      },
      {
        name: "BassWave TWS Earbuds",
        slug: "basswave-tws-earbuds",
        description:
          "Compact yet powerful, the BassWave TWS earbuds deliver punchy bass and crystal-clear trebles. With ANC, transparency mode, IPX5 water resistance, and 8 hours of playback (32 hours with case), they're perfect for workouts and commutes. The ergonomic design ensures a secure, comfortable fit for all-day wear.",
        price: "7999",
        compareAtPrice: "9999",
        categoryId: catMap["audio"],
        images: [
          "https://images.pexels.com/photos/18311089/pexels-photo-18311089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.3",
        reviewCount: 198,
        specs: {
          "Driver Size": "12mm",
          ANC: "Yes",
          "Battery Life": "8h + 24h case",
          "Water Resistance": "IPX5",
          Bluetooth: "5.3",
        },
      },

      // Wearables
      {
        name: "FitPulse Ultra Smartwatch",
        slug: "fitpulse-ultra-smartwatch",
        description:
          "The FitPulse Ultra is your ultimate health and fitness companion. With advanced health monitoring including ECG, SpO2, body temperature, and stress tracking, it keeps you informed about your wellness 24/7. The 1.5\" AMOLED always-on display is bright enough for outdoor use, while 7-day battery life means less time charging and more time training. GPS, 100+ workout modes, and water resistance to 50m make it versatile for any activity.",
        price: "24999",
        compareAtPrice: "29999",
        categoryId: catMap["wearables"],
        images: [
          "https://images.pexels.com/photos/31541678/pexels-photo-31541678.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/12564670/pexels-photo-12564670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Popular",
        featured: true,
        rating: "4.6",
        reviewCount: 267,
        specs: {
          Display: '1.5" AMOLED',
          "Battery Life": "7 Days",
          "Health Sensors": "ECG, SpO2, Temp",
          GPS: "Dual-band GPS",
          "Water Resistance": "5ATM (50m)",
          Compatibility: "iOS & Android",
        },
      },
      {
        name: "TrackBand Fitness Tracker",
        slug: "trackband-fitness-tracker",
        description:
          "Stay motivated with the TrackBand Fitness Tracker. This sleek, lightweight band tracks your steps, heart rate, sleep quality, and calories burned throughout the day. With a 14-day battery life, water resistance, and smart notifications, it's the perfect entry point into the world of wearable technology.",
        price: "4999",
        categoryId: catMap["wearables"],
        images: [
          "https://images.pexels.com/photos/12880803/pexels-photo-12880803.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.2",
        reviewCount: 134,
        specs: {
          Display: '0.96" AMOLED',
          "Battery Life": "14 Days",
          Sensors: "Heart Rate, SpO2",
          "Water Resistance": "IP68",
        },
      },

      // Gaming
      {
        name: "StrikeForce Mechanical Keyboard",
        slug: "strikeforce-mechanical-keyboard",
        description:
          "Dominate every game with the StrikeForce Mechanical Keyboard. Featuring Cherry MX switches, per-key RGB lighting, and a durable aluminum frame, this keyboard is built for competitive gaming. Hot-swappable switches let you customize your typing feel, while the detachable wrist rest keeps you comfortable during marathon sessions. N-key rollover and 1ms polling rate ensure every keypress counts.",
        price: "12999",
        compareAtPrice: "15999",
        categoryId: catMap["gaming"],
        images: [
          "https://images.pexels.com/photos/8219211/pexels-photo-8219211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/12877898/pexels-photo-12877898.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Hot",
        featured: true,
        rating: "4.7",
        reviewCount: 189,
        specs: {
          "Switch Type": "Cherry MX Red",
          Layout: "Full-size (104 keys)",
          Lighting: "Per-key RGB",
          Connection: "USB-C (wired)",
          Frame: "Aluminum alloy",
          "Polling Rate": "1ms",
        },
      },
      {
        name: "ProGrip Gaming Mouse",
        slug: "progrip-gaming-mouse",
        description:
          "Engineered for precision, the ProGrip Gaming Mouse features a 25,600 DPI optical sensor, ultra-lightweight 58g design, and flexible paracord cable for friction-free movement. 6 programmable buttons, onboard memory for profiles, and durable PTFE feet ensure you have every advantage in competitive play.",
        price: "5999",
        categoryId: catMap["gaming"],
        images: [
          "https://images.pexels.com/photos/12877898/pexels-photo-12877898.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.5",
        reviewCount: 145,
        specs: {
          Sensor: "25,600 DPI Optical",
          Weight: "58g",
          Buttons: "6 Programmable",
          Cable: "Paracord",
          Polling: "1000Hz",
        },
      },
      {
        name: "GamePad Elite Controller",
        slug: "gamepad-elite-controller",
        description:
          "Take your console and PC gaming to the next level with the GamePad Elite. Featuring hall-effect analog sticks for zero drift, adjustable triggers, and textured grips for maximum comfort. Wireless Bluetooth 5.0 connectivity with 30+ hour battery life, plus motion controls and HD rumble for immersive gameplay.",
        price: "6999",
        categoryId: catMap["gaming"],
        images: [
          "https://images.pexels.com/photos/4225229/pexels-photo-4225229.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.4",
        reviewCount: 92,
        specs: {
          Connectivity: "Bluetooth 5.0 / USB-C",
          "Battery Life": "30+ Hours",
          "Analog Sticks": "Hall-Effect",
          Compatibility: "PC, Switch, Android, iOS",
        },
      },

      // Jerseys
      {
        name: "Bangladesh Cricket Team Jersey 2025",
        slug: "bangladesh-cricket-jersey-2025",
        description:
          "Show your support for the Tigers with the official Bangladesh Cricket Team Jersey 2025 edition. Made with moisture-wicking DryFit fabric, this premium jersey features the iconic green and red color scheme, embroidered team crest, and breathable mesh panels. Available in all sizes, it's perfect for match days, practice, or casual wear.",
        price: "2499",
        compareAtPrice: "3499",
        categoryId: catMap["jerseys"],
        images: [
          "https://images.pexels.com/photos/15986812/pexels-photo-15986812.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/38042402/pexels-photo-38042402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Limited Edition",
        featured: true,
        rating: "4.8",
        reviewCount: 312,
        specs: {
          Material: "100% Polyester DryFit",
          Fit: "Regular",
          Sizes: "S, M, L, XL, XXL",
          Care: "Machine Washable",
        },
      },
      {
        name: "Premium Football Club Jersey",
        slug: "premium-football-club-jersey",
        description:
          "Rep your favorite football club with this premium-quality replica jersey. Crafted with advanced Climalite technology for superior moisture management, this jersey features authentic team colors, printed sponsor logos, and a comfortable slim-fit design. The lightweight, stretchy fabric moves with you whether you're on the pitch or in the stands.",
        price: "3999",
        categoryId: catMap["jerseys"],
        images: [
          "https://images.pexels.com/photos/38042402/pexels-photo-38042402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/31105971/pexels-photo-31105971.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.5",
        reviewCount: 167,
        specs: {
          Material: "Polyester Climalite",
          Fit: "Slim Fit",
          Sizes: "S, M, L, XL, XXL",
          Care: "Machine Washable",
        },
      },
      {
        name: "Retro Basketball Jersey Classic",
        slug: "retro-basketball-jersey-classic",
        description:
          "A throwback to the golden era of basketball, this retro jersey combines classic styling with modern comfort. Features mesh construction for breathability, reinforced stitching for durability, and an authentic retro design that never goes out of style. Perfect for collectors, players, and fashion enthusiasts alike.",
        price: "2999",
        categoryId: catMap["jerseys"],
        images: [
          "https://images.pexels.com/photos/38042398/pexels-photo-38042398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.3",
        reviewCount: 89,
        specs: {
          Material: "Mesh Polyester",
          Fit: "Relaxed",
          Sizes: "S, M, L, XL, XXL, 3XL",
        },
      },

      // Photography
      {
        name: "OptiLens DSLR Camera Kit",
        slug: "optilens-dslr-camera-kit",
        description:
          "Capture stunning photos and 4K video with the OptiLens DSLR Camera Kit. This professional-grade bundle includes a 24.2MP full-frame body, 18-55mm and 55-200mm lenses, camera bag, 64GB SD card, and cleaning kit. The advanced autofocus system with 153 focus points ensures tack-sharp images in any condition, while the weather-sealed body protects your investment.",
        price: "159999",
        compareAtPrice: "189999",
        categoryId: catMap["photography"],
        images: [
          "https://images.pexels.com/photos/9660955/pexels-photo-9660955.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/13827131/pexels-photo-13827131.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/10972243/pexels-photo-10972243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/12716745/pexels-photo-12716745.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Pro Choice",
        featured: true,
        rating: "4.9",
        reviewCount: 78,
        specs: {
          Sensor: "24.2MP Full Frame CMOS",
          ISO: "100-51200",
          "AF Points": "153 Points",
          Video: "4K 60fps",
          "Shutter Speed": "1/8000s",
          "Body Weight": "840g",
        },
      },
      {
        name: "CompactShot Mirrorless Camera",
        slug: "compactshot-mirrorless",
        description:
          "The CompactShot Mirrorless combines portability with professional performance. Its 26MP APS-C sensor, 5-axis image stabilization, and lightning-fast autofocus make it ideal for travel, street, and portrait photography. Shoot 4K video with cinematic color profiles, and connect wirelessly to your phone for instant sharing.",
        price: "74999",
        categoryId: catMap["photography"],
        images: [
          "https://images.pexels.com/photos/10972243/pexels-photo-10972243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          "https://images.pexels.com/photos/9660955/pexels-photo-9660955.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.6",
        reviewCount: 112,
        specs: {
          Sensor: "26MP APS-C",
          Stabilization: "5-Axis IBIS",
          Video: "4K 30fps",
          Weight: "460g",
          Connectivity: "Wi-Fi, Bluetooth",
        },
      },

      // Digital / Accessories
      {
        name: "PowerVault 20000mAh Power Bank",
        slug: "powervault-20000-power-bank",
        description:
          "Never run out of power with the PowerVault 20000mAh portable charger. Featuring 65W USB-C PD output, it can fast-charge laptops, tablets, and phones simultaneously. The sleek aluminum design with LED battery indicator looks as good as it performs. Charge your iPhone up to 5 times or your laptop once on a single charge.",
        price: "3499",
        categoryId: catMap["electronics"],
        images: [
          "https://images.pexels.com/photos/4765366/pexels-photo-4765366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        badge: "Essential",
        featured: false,
        rating: "4.4",
        reviewCount: 256,
        specs: {
          Capacity: "20000mAh",
          Output: "65W USB-C PD",
          Ports: "2x USB-C, 1x USB-A",
          Weight: "380g",
        },
      },
      {
        name: "TechHub USB-C Docking Station",
        slug: "techhub-usbc-dock",
        description:
          "Expand your laptop's capabilities with the TechHub 12-in-1 USB-C Docking Station. Connect dual 4K monitors, charge your laptop at 100W, and access SD cards, USB drives, and Ethernet — all through a single cable. The compact design with built-in cable management keeps your desk clean and organized.",
        price: "8999",
        categoryId: catMap["electronics"],
        images: [
          "https://images.pexels.com/photos/3568521/pexels-photo-3568521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        featured: false,
        rating: "4.3",
        reviewCount: 87,
        specs: {
          Ports: "12-in-1",
          "Display Output": "Dual 4K@60Hz",
          "PD Charging": "100W",
          Ethernet: "Gigabit",
        },
      },
    ])
    .returning();

  // Insert reviews
  const reviewData: Array<{
    productId: number;
    author: string;
    rating: number;
    title: string;
    body: string;
    verified: boolean;
  }> = [];

  const reviewerNames = [
    "Rahim Khan", "Fatima Begum", "Arif Hossain", "Nusrat Jahan", "Kamal Ahmed",
    "Taslima Akter", "Md. Rafiq", "Sultana Razia", "Jahangir Alam", "Mithila Das",
    "Sohel Rana", "Ayesha Siddiqua", "Tanvir Hassan", "Rumana Parveen", "Shakib Al",
    "Nadia Islam", "Farhan Chowdhury", "Sabrina Haque", "Imran Hossain", "Moushumi Akter",
  ];

  const positiveReviews = [
    { title: "Absolutely love it!", body: "This product exceeded all my expectations. The build quality is outstanding and it works flawlessly. Highly recommended!" },
    { title: "Best purchase this year", body: "I've been using this for a month now and I'm incredibly impressed. The performance is top-notch and it looks fantastic." },
    { title: "Worth every taka", body: "Great value for money. The quality is premium and the features are exactly what I needed. Will definitely buy from TRUSTWAVE BD again." },
    { title: "Amazing quality", body: "The attention to detail is remarkable. Everything from the packaging to the product itself screams premium quality." },
    { title: "Highly recommended", body: "I researched extensively before buying and I'm glad I chose this. It performs exactly as advertised, if not better." },
    { title: "Perfect for daily use", body: "Been using this daily and it hasn't let me down once. Reliable, well-built, and great looking. Very satisfied with my purchase." },
    { title: "Exceeded expectations", body: "I was skeptical at first but this product truly delivers. The performance is incredible and the design is sleek and modern." },
    { title: "Five stars all the way", body: "From unboxing to daily use, everything about this product has been a 5-star experience. TRUSTWAVE BD delivers!" },
    { title: "Great product, fast delivery", body: "Received it within 2 days and it works perfectly. The quality matches the description exactly. Very happy customer!" },
    { title: "Premium feel and performance", body: "This feels like a much more expensive product. The build quality is solid, the performance is smooth, and it looks great on my desk." },
  ];

  for (const prod of prods) {
    const numReviews = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numReviews; i++) {
      const review = positiveReviews[Math.floor(Math.random() * positiveReviews.length)];
      const reviewer = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
      reviewData.push({
        productId: prod.id,
        author: reviewer,
        rating: Math.random() > 0.2 ? 5 : 4,
        title: review.title,
        body: review.body,
        verified: Math.random() > 0.3,
      });
    }
  }

  await db.insert(reviews).values(reviewData);

  console.log(`Seeded ${cats.length} categories, ${prods.length} products, ${reviewData.length} reviews`);
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
