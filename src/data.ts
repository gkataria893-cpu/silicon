import { Product, Review, Coupon } from './types';

export const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 8 },
  { id: 'computing', name: 'Workstations', count: 2 },
  { id: 'mobile', name: 'Mobile Kits', count: 2 },
  { id: 'audio', name: 'Premium Audio', count: 2 },
  { id: 'developer', name: 'Silicon Kits', count: 2 }
];

export const PRODUCTS: Product[] = [
  {
    id: 'sp-workstation-x',
    name: 'Silicon Workstation X1',
    description: 'The ultimate professional desktop workstation powered by our custom Silicon-X octa-core neural processor. Features liquid-metal thermal phase cooling, modular expansion architecture, and an enterprise-grade hardware security enclave.',
    price: 2499,
    rating: 4.9,
    reviewsCount: 142,
    category: 'computing',
    images: [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'Processor': 'Silicon-X Neural (32-core)',
      'Memory': '64GB Unified LPDDR5X',
      'Storage': '2TB PCIe Gen5 NVMe SSD',
      'Graphics': 'Silicon-GPU Core (48-core)',
      'OS': 'SiliconOS Developer Edition',
      'Dimensions': '38.2 x 18.0 x 42.5 cm'
    },
    inStock: true,
    isFeatured: true,
    isRecommended: true,
    colors: ['Space Gray', 'Titanium Silver']
  },
  {
    id: 'sp-phone-12',
    name: 'Silicon Phone 12 Pro',
    description: 'A masterpiece of mobile engineering. Built with aerospace-grade titanium frame, dynamic micro-lens array screen, and the revolutionary Silicon-A16 neural core. Incredible triple lens camera with 8K ultra-wide cinematographic capture.',
    price: 1199,
    rating: 4.8,
    reviewsCount: 312,
    category: 'mobile',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1533228894074-8f47025702e7?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'Display': '6.7" OLED 120Hz LTPO Pro',
      'Chipset': 'Silicon-A16 Bionic Neural Core',
      'Camera': '50MP Main + 48MP Zoom + 48MP Wide',
      'Battery': '5000mAh with 65W HyperCharge',
      'Water Resistance': 'IP68 Certified',
      'Weight': '204 grams'
    },
    inStock: true,
    isFeatured: true,
    isRecommended: true,
    colors: ['Carbon Black', 'Titanium Gray', 'Deep Aurora']
  },
  {
    id: 'sp-buds-pro',
    name: 'Silicon Buds Pro Studio',
    description: 'Experience pure high-fidelity sound. Features our industry-leading Hybrid Adaptive Active Noise Cancellation, personalized spatial spatializer, and ultra-low latency direct stream lossless audio over LE wireless standard.',
    price: 249,
    rating: 4.7,
    reviewsCount: 88,
    category: 'audio',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'Driver Type': '11mm Dynamic + Balanced Armature',
      'Noise Cancellation': 'Adaptive Hybrid ANC (-48dB)',
      'Battery Life': '10 Hours (40 Hours total with case)',
      'Connectivity': 'Bluetooth 5.4 LE Audio',
      'Codecs Supported': 'LDAC, AAC, aptX Adaptive, SBC',
      'Charging': 'Wireless Qi + USB-C Quick Charge'
    },
    inStock: true,
    isFeatured: true,
    isRecommended: false,
    colors: ['Obsidian Black', 'Alabaster White']
  },
  {
    id: 'sp-dev-kit-v2',
    name: 'Silicon Developer Kit v2',
    description: 'The pre-eminent development kit for embedded neural computation. Designed for engineers and hackers building next-gen AI applications, edge intelligence, and robotics. Includes pre-flashed SDK and dynamic debugging suite.',
    price: 399,
    rating: 4.9,
    reviewsCount: 57,
    category: 'developer',
    images: [
      'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'AI Processing Power': '45 TOPS INT8',
      'CPU': '6-core ARM v8.2 64-bit Processor',
      'Memory': '16GB 128-bit LPDDR4x',
      'Interfaces': 'Gigabit Ethernet, 4x USB 3.2, 40-pin GPIO, HDMI 2.1',
      'Voltage Range': '9V - 20V DC Jack input',
      'Software Support': 'Full Ubuntu Linux + TensorRT SDK'
    },
    inStock: true,
    isFeatured: false,
    isRecommended: true,
    colors: ['Classic Green', 'Bare Metal Black']
  },
  {
    id: 'sp-keyboard-custom',
    name: 'Silicon Mech-1 Keyboard',
    description: 'A 75% layout premium hot-swappable mechanical keyboard designed for extreme tactile precision. Carved from a single block of solid 6063 aluminum, featuring gasket-mounted structure and pre-lubed mechanical switches.',
    price: 189,
    rating: 4.6,
    reviewsCount: 74,
    category: 'computing',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'Form Factor': '75% Compact Layout',
      'Chassis': 'CNC Anodized Aluminum',
      'Switches': 'Silicon Custom Linear Cream (Pre-lubed)',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Backlight': 'South-facing Customizable RGB',
      'Connectivity': 'USB-C / 2.4G Wireless / Bluetooth 5.1'
    },
    inStock: true,
    isFeatured: false,
    isRecommended: false,
    colors: ['Slate Gray', 'Pure White']
  },
  {
    id: 'sp-watch-active',
    name: 'Silicon Watch Active Pro',
    description: 'An advanced health, sports, and connectivity watch. Tracks critical biometrics like dynamic ECG, heart rate variability, blood oxygen, and sleep phases. Up to 14 days of battery life on a single fast-charge cycle.',
    price: 329,
    rating: 4.5,
    reviewsCount: 104,
    category: 'mobile',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'Display': '1.43" Always-on AMOLED (466x466 px)',
      'Sensors': 'Optical HR, ECG, Accelerometer, SpO2, Gyroscope',
      'GPS': 'Dual-band Multi-constellation GNSS',
      'Battery Life': '14 days typical usage',
      'Strap Material': 'Fluoroelastomer Sports Band',
      'Water Resistance': '5ATM (up to 50 meters)'
    },
    inStock: true,
    isFeatured: false,
    isRecommended: true,
    colors: ['Active Silver', 'Stealth Black']
  },
  {
    id: 'sp-sensor-hub',
    name: 'Silicon IoT Hub Gateway',
    description: 'The smart coordinator for your intelligent workspace or connected lab. Integrates seamlessly with hundreds of sensors to coordinate automation scripts locally, keeping your home telemetry completely private.',
    price: 149,
    rating: 4.8,
    reviewsCount: 39,
    category: 'developer',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'Wireless Protocols': 'Zigbee 3.0, Thread, Bluetooth Mesh, Wi-Fi 6',
      'Processor': 'Dual-core Silicon IoT chip',
      'Local Storage': '32GB eMMC for offline automation scripts',
      'Security': 'Hardware Cryptographic Enclave',
      'Power Source': 'USB-C 5V/2A',
      'Integration': 'Home Assistant Compatible / Local UI'
    },
    inStock: true,
    isFeatured: false,
    isRecommended: false,
    colors: ['Pure White', 'Matte Black']
  },
  {
    id: 'sp-anc-headphones',
    name: 'Silicon Studio Headset H1',
    description: 'Studio-reference over-ear headphones that bring pure studio acoustics into your commute. Impeccable spatial separation, high-resolution audio certification, and comfortable memory-foam ear cushions wrapped in premium lambskin leather.',
    price: 449,
    rating: 4.9,
    reviewsCount: 95,
    category: 'audio',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600'
    ],
    specs: {
      'Driver Type': '40mm Custom Liquid Crystal Polymer (LCP) diaphragms',
      'Frequency Response': '4Hz - 40,000Hz (Lossless Hi-Res)',
      'Battery Life': '35 Hours with ANC on, 45 Hours ANC off',
      'Microphones': '8 Beamforming mics with wind reduction',
      'Foldable': 'Yes, flat-folding with premium traveling case',
      'Weight': '250g'
    },
    inStock: true,
    isFeatured: true,
    isRecommended: false,
    colors: ['Mineral Silver', 'Obsidian Black']
  }
];

export const REVIEWS: Record<string, Review[]> = {
  'sp-workstation-x': [
    { id: '1', userName: 'Linus T.', rating: 5, date: '2026-05-15', comment: 'Compiled my entire custom kernel in under 4 seconds. The silicon-X processor is a complete game changer for development workloads.', verified: true },
    { id: '2', userName: 'Sarah M. (AI Engineer)', rating: 5, date: '2026-04-10', comment: 'Running local LLM models on the Edge has never been this smooth. The 48-core unified memory allows loading multi-billion parameter models directly. Recommended.', verified: true },
    { id: '3', userName: 'David K.', rating: 4, date: '2026-03-22', comment: 'Extremely fast, but the fan gets a bit audible under massive compiler benchmarks. Modular build quality is second to none though.', verified: true }
  ],
  'sp-phone-12': [
    { id: '1', userName: 'Amanda L.', rating: 5, date: '2026-06-01', comment: 'The titanium finish feels amazing. Screen brightness in peak daylight is unbelievable. Batter life easily lasts 2 full days.', verified: true },
    { id: '2', userName: 'Marcus G.', rating: 4, date: '2026-05-18', comment: 'Camera is incredible, especially in low light. 8K video is great, but fills up the storage quickly. Get the larger storage model!', verified: false }
  ]
};

export const COUPONS: Coupon[] = [
  { code: 'SILICON10', discountType: 'percentage', value: 10, minSpend: 100 },
  { code: 'TECHSAVER50', discountType: 'fixed', value: 50, minSpend: 500 },
  { code: 'FREESHIP', discountType: 'fixed', value: 15, minSpend: 50 }
];
