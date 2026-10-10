// ==========================================================================
// NOVA MALL - Premium Fallback & Enriched Product Catalog
// Every product features multi-angle 360° frames, specs, ratings, and luxury assets.
// ==========================================================================

export const fallbackProducts = [
  {
    id: 101,
    title: "Nova Horizon Pro ANC Spatial Wireless Headphones",
    brand: "Nova Acoustics",
    category: "electronics",
    price: 24999,
    originalPrice: 32999,
    discountPercentage: 24,
    rating: 4.9,
    reviewsCount: 342,
    stock: 18,
    isFlashSale: true,
    isTrending: true,
    isNew: true,
    description: "Equipped with bespoke 50mm beryllium transducers, custom aerospace-grade aluminum chassis, lossless spatial audio tracking, and 60-hour ultra-endurance battery life.",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"
    ],
    // 360 viewer simulated frames for different rotation angles (0° - 360°)
    frames360: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", // 0 deg Front
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80", // 45 deg Front Right
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", // 90 deg Side Profile
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", // 135 deg Back Right
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", // 180 deg Back
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80", // 225 deg Back Left
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", // 270 deg Left Profile
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"  // 315 deg Front Left
    ],
    specs: {
      "Driver Unit": "50mm Beryllium Custom",
      "Frequency Response": "5Hz - 45,000Hz",
      "Battery Life": "Up to 60 hours with ANC",
      "Connectivity": "Bluetooth 5.4 LE / Ultra-low latency 2.4GHz / Lossless USB-C",
      "Weight": "268g",
      "Warranty": "2 Years Global Luxury Care"
    },
    reviews: [
      { id: 1, user: "Aarav Sharma", rating: 5, date: "2 days ago", comment: "The soundstage is unmatched. Build quality feels like a ₹60,000 audiophile pair." },
      { id: 2, user: "Elena Rostova", rating: 5, date: "1 week ago", comment: "360 spatial audio feels like having a private orchestra in your room. Fast 2-hour delivery!" }
    ]
  },
  {
    id: 102,
    title: "Apex Celestial Titanium Automatic Chronograph Watch",
    brand: "Apex Horology",
    category: "accessories",
    price: 89999,
    originalPrice: 119999,
    discountPercentage: 25,
    rating: 5.0,
    reviewsCount: 188,
    stock: 7,
    isFlashSale: true,
    isTrending: true,
    isNew: true,
    description: "Handcrafted Swiss-engineered caliber with 72-hour power reserve, grade-5 titanium brushed bezel, sapphire crystal open caseback, and 200m water resistance.",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
    ],
    specs: {
      "Movement": "Swiss Automatic Calibre NH70",
      "Case Material": "Grade-5 Aerospace Titanium",
      "Crystal": "Double-domed Anti-reflective Sapphire",
      "Water Resistance": "20 ATM / 200 Meters",
      "Strap": "Interchangeable FKM Rubber & Titanium Bracelet"
    },
    reviews: [
      { id: 1, user: "Vikram Malhotra", rating: 5, date: "3 days ago", comment: "Stunning craftsmanship. The titanium finish is exceptionally lightweight." }
    ]
  },
  {
    id: 103,
    title: "Verve Cyber-OLED Ultra Smartphone (16GB + 512GB)",
    brand: "Verve Tech",
    category: "electronics",
    price: 64999,
    originalPrice: 79999,
    discountPercentage: 18,
    rating: 4.8,
    reviewsCount: 512,
    stock: 25,
    isFlashSale: false,
    isTrending: true,
    isNew: true,
    description: "Powered by 3nm Octa-core Neural Engine, 165Hz LTPO AMOLED curved display, 200MP periscope zoom sensor, and 120W HyperCharge.",
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    ],
    specs: {
      "Display": "6.82\" 165Hz LTPO 4K Curved AMOLED (3000 nits)",
      "Processor": "Snapdragon 8 Gen 3 Elite 3nm",
      "Camera": "200MP OIS Main + 50MP Periscope 10x + 50MP Ultrawide",
      "Battery": "5500mAh with 120W wired + 50W wireless",
      "OS": "NovaOS 4.0 Pure Ambient"
    },
    reviews: [
      { id: 1, user: "Rohan Patel", rating: 5, date: "Yesterday", comment: "The gaming performance is insane! 120fps steady in Genshin with zero throttling." }
    ]
  },
  {
    id: 104,
    title: "Atelier Italian Velvet Ergonomic Lounge Chair",
    brand: "Atelier Casa",
    category: "furniture",
    price: 34999,
    originalPrice: 45999,
    discountPercentage: 23,
    rating: 4.9,
    reviewsCount: 120,
    stock: 12,
    isFlashSale: false,
    isTrending: false,
    isNew: false,
    description: "Sculpted organic silhouette upholstered in hydrophobic Italian velvet with solid walnut dowel frame and high-density memory cushion support.",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
    ],
    specs: {
      "Fabric": "Hydrophobic Italian Micro-Velvet",
      "Frame": "FSC-Certified Solid American Walnut",
      "Cushion": "High-Resilience Dual-Density Foam",
      "Dimensions": "84cm W x 88cm D x 92cm H",
      "Weight Capacity": "220 kg"
    },
    reviews: [
      { id: 1, user: "Priya Nair", rating: 5, date: "5 days ago", comment: "Transformed my reading nook completely. Extremely comfortable and elegant." }
    ]
  },
  {
    id: 105,
    title: "Maison De Nuit 24K Gold Botanical Elixir & Fragrance",
    brand: "Maison De Nuit",
    category: "beauty",
    price: 12499,
    originalPrice: 16999,
    discountPercentage: 26,
    rating: 4.9,
    reviewsCount: 230,
    stock: 30,
    isFlashSale: true,
    isTrending: true,
    isNew: true,
    description: "Infused with pure 24K colloidal gold flakes, organic Bulgarian rose extract, damascena essence, and cold-pressed squalane for radiant skin rebirth.",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
    ],
    specs: {
      "Volume": "100ml / 3.4 fl. oz",
      "Skin Type": "All skin types (Dermatologist Tested)",
      "Key Ingredients": "24K Colloidal Gold, Rose Absolute, Peptides, Niacinamide",
      "Origin": "Grasse, France"
    },
    reviews: [
      { id: 1, user: "Ananya Deshmukh", rating: 5, date: "4 days ago", comment: "Smells divine and leaves a luminous glass-skin glow without feeling greasy." }
    ]
  },
  {
    id: 106,
    title: "Lumix Quantum 4K Laser Cinema Projector",
    brand: "Lumix Vision",
    category: "electronics",
    price: 119999,
    originalPrice: 149999,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 94,
    stock: 5,
    isFlashSale: false,
    isTrending: false,
    isNew: true,
    description: "Ultra-short throw triple laser optics delivering 3,500 ANSI Lumens, 150-inch native 4K display from just 8 inches away, and Dolby Atmos audio.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80"
    ],
    specs: {
      "Brightness": "3,500 ANSI Lumens",
      "Resolution": "True 4K UHD (3840 x 2160)",
      "Throw Ratio": "0.21:1 Ultra Short Throw",
      "Audio": "Harman Kardon 40W Spatial Soundbar"
    },
    reviews: [
      { id: 1, user: "Karan Johar", rating: 5, date: "1 week ago", comment: "The cinematic depth in my living room is unbelievable. Daytime viewing is crystal clear." }
    ]
  },
  {
    id: 107,
    title: "AeroStrata Carbon Fiber Ultralight Road Bike",
    brand: "AeroStrata",
    category: "sports",
    price: 145000,
    originalPrice: 175000,
    discountPercentage: 17,
    rating: 5.0,
    reviewsCount: 68,
    stock: 4,
    isFlashSale: false,
    isTrending: true,
    isNew: true,
    description: "Toray T1000 high-modulus aerodynamic monocoque carbon frame, Shimano Dura-Ace Di2 12-speed electronic shifting, and hydraulic disc braking.",
    thumbnail: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80"
    ],
    specs: {
      "Weight": "6.8 kg complete",
      "Groupset": "Shimano Dura-Ace Di2 Electronic",
      "Wheelset": "50mm Carbon Aero Tubeless-Ready",
      "Frame": "Torayca T1000 High-Modulus Carbon"
    },
    reviews: [
      { id: 1, user: "Sameer Kapoor", rating: 5, date: "2 weeks ago", comment: "Featherlight, lightning fast acceleration, effortlessly climbs hills." }
    ]
  },
  {
    id: 108,
    title: "Sartorial Cashmere Overcoat with Silk Lining",
    brand: "Sartoria Milano",
    category: "fashion",
    price: 28999,
    originalPrice: 38999,
    discountPercentage: 25,
    rating: 4.8,
    reviewsCount: 145,
    stock: 14,
    isFlashSale: true,
    isTrending: true,
    isNew: false,
    description: "Woven from 100% Mongolian grade-A double-faced cashmere with bespoke horn buttons, tailored peak lapels, and hand-stitched silk lining.",
    thumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
    ],
    specs: {
      "Material": "100% Pure Mongolian Cashmere",
      "Lining": "100% Mulberry Jacquard Silk",
      "Cut": "Modern Tailored Regular Fit",
      "Care": "Dry Clean Only"
    },
    reviews: [
      { id: 1, user: "Devansh Mehta", rating: 5, date: "6 days ago", comment: "Incredibly soft and keeps you warm while looking exceptionally sharp." }
    ]
  },
  {
    id: 109,
    title: "Aura Smart Ambient Sonic Lamp & Diffuser",
    brand: "Aura Living",
    category: "home-living",
    price: 8499,
    originalPrice: 11999,
    discountPercentage: 29,
    rating: 4.7,
    reviewsCount: 310,
    stock: 45,
    isFlashSale: false,
    isTrending: false,
    isNew: true,
    description: "Multi-sensory wellness device combining soothing 16-million-color sunset illumination, 360° relaxing spatial white noise, and ultrasonic essential oil vapor.",
    thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"
    ],
    specs: {
      "Capacity": "450ml ultrasonic mist tank",
      "Lighting": "Full RGBW Smart Tunable LED",
      "Audio": "Built-in Nature & Binaural Beats Sound Machine",
      "App Control": "Apple HomeKit, Google Home & NOVA App"
    },
    reviews: [
      { id: 1, user: "Shruti Sen", rating: 5, date: "3 days ago", comment: "My sleep quality improved dramatically within a week. The sunset fade is magical." }
    ]
  },
  {
    id: 110,
    title: "Sanctuary Reserve White Truffle Gourmet Oil & Salt Set",
    brand: "Sanctuary Gourmet",
    category: "grocery",
    price: 4999,
    originalPrice: 6499,
    discountPercentage: 23,
    rating: 4.9,
    reviewsCount: 89,
    stock: 20,
    isFlashSale: false,
    isTrending: false,
    isNew: false,
    description: "First cold-pressed extra virgin olive oil from Umbria infused with pure Italian Alba white winter truffle essence and hand-harvested fleur de sel.",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
    ],
    specs: {
      "Origin": "Umbria, Italy",
      "Contents": "250ml White Truffle Oil + 100g Black Truffle Sea Salt",
      "Shelf Life": "24 Months"
    },
    reviews: [
      { id: 1, user: "Chef Rajesh", rating: 5, date: "1 week ago", comment: "Authentic, robust aroma. Perfect finish for risottos and handmade pastas." }
    ]
  }
];
