import type {
  City,
  PickupLocation,
  Category,
  Product,
  HeroSlide,
  BlogPost,
} from './types';

export const CITIES: City[] = [
  { id: 'karachi', name: 'Karachi', province: 'Sindh', deliveryFee: 149, deliveryEta: '30–45 min', karachiOnly: true },
  { id: 'lahore', name: 'Lahore', province: 'Punjab', deliveryFee: 349, deliveryEta: '2–3 days', karachiOnly: false },
  { id: 'islamabad', name: 'Islamabad', province: 'ICT', deliveryFee: 349, deliveryEta: '2–3 days', karachiOnly: false },
  { id: 'rawalpindi', name: 'Rawalpindi', province: 'Punjab', deliveryFee: 349, deliveryEta: '2–3 days', karachiOnly: false },
  { id: 'faisalabad', name: 'Faisalabad', province: 'Punjab', deliveryFee: 399, deliveryEta: '2–3 days', karachiOnly: false },
  { id: 'multan', name: 'Multan', province: 'Punjab', deliveryFee: 399, deliveryEta: '3–4 days', karachiOnly: false },
  { id: 'peshawar', name: 'Peshawar', province: 'KP', deliveryFee: 449, deliveryEta: '3–4 days', karachiOnly: false },
  { id: 'quetta', name: 'Quetta', province: 'Balochistan', deliveryFee: 499, deliveryEta: '3–4 days', karachiOnly: false },
];

export const PICKUP_LOCATIONS: PickupLocation[] = [
  {
    id: 'khi-main',
    city: 'Karachi',
    name: 'Natura Coco Flagship Store',
    address: 'Shop 7, Bahadurabad Chowrangi, Karachi 74800',
    mapUrl: 'https://www.google.com/maps?q=Bahadurabad+Chowrangi+Karachi',
    hours: 'Open 24/7',
    readyIn: '20–30 min',
  },
];

export const CATEGORIES: Category[] = [
  { id: 'fresh-coconuts', name: 'Fresh Coconuts', tagline: 'Sourced fresh, delivered nationwide', nationwide: true, emoji: 'coconut' },
  { id: 'bottled-coconut-water', name: 'Bottled Coconut Water', tagline: 'Pure, chilled, no preservatives', nationwide: false, emoji: 'bottle' },
  { id: 'fresh-juices', name: 'Fresh Natural Juices', tagline: 'Cold-pressed daily in Karachi', nationwide: false, emoji: 'juice' },
  { id: 'bundles', name: 'Bundles & Combos', tagline: 'Save more on multi-packs', nationwide: false, emoji: 'bundle' },
  { id: 'extras', name: 'Extras & Add-ons', tagline: 'Little treats to complete your order', nationwide: false, emoji: 'extra' },
];

const sizeVariation = (sizes: { id: string; label: string; priceDelta: number }[]) => ({
  id: 'size',
  name: 'Size',
  type: 'single' as const,
  required: true,
  options: sizes,
});

const sugarVariation = () => ({
  id: 'sugar',
  name: 'Sugar Level',
  type: 'single' as const,
  required: true,
  options: [
    { id: 'no-sugar', label: 'No Added Sugar', priceDelta: 0 },
    { id: 'regular', label: 'Regular', priceDelta: 0 },
  ],
});

export const PRODUCTS: Product[] = [
  // Fresh Coconuts — nationwide
  {
    id: 'fc-tender-6',
    categoryId: 'fresh-coconuts',
    name: 'Tender Young Coconuts',
    image: 'https://images.pexels.com/photos/16005627/pexels-photo-16005627.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1200,
    originalPrice: 1500,
    unit: 'pack of 6',
    badge: 'Nationwide',
    description: 'Hand-picked tender coconuts, packed in protective crates and shipped across Pakistan. Each coconut holds pure, naturally sweet water.',
    variations: [
      sizeVariation([
        { id: 'pack-6', label: 'Pack of 6', priceDelta: 0 },
        { id: 'pack-12', label: 'Pack of 12', priceDelta: 2200 },
      ]),
    ],
  },
  {
    id: 'fc-malai-9',
    categoryId: 'fresh-coconuts',
    name: 'Malai Coconuts (Thick Meat)',
    image: 'https://images.pexels.com/photos/8995296/pexels-photo-8995296.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1650,
    unit: 'pack of 9',
    badge: 'Nationwide',
    description: 'Mature coconuts prized for their thick, creamy malai meat — ideal for cooking, desserts, and fresh snacking.',
    variations: [
      sizeVariation([
        { id: 'pack-9', label: 'Pack of 9', priceDelta: 0 },
        { id: 'pack-18', label: 'Pack of 18', priceDelta: 3000 },
      ]),
    ],
  },
  {
    id: 'fc-mixed-12',
    categoryId: 'fresh-coconuts',
    name: 'Mixed Box (Tender + Malai)',
    image: 'https://images.pexels.com/photos/18139256/pexels-photo-18139256.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2100,
    originalPrice: 2400,
    unit: 'pack of 12',
    badge: 'Bestseller',
    description: 'The best of both — six tender coconuts for drinking and six malai coconuts for eating. A complete coconut experience.',
    variations: [
      sizeVariation([
        { id: 'pack-12', label: 'Pack of 12', priceDelta: 0 },
      ]),
    ],
  },

  // Bottled Coconut Water — Karachi only
  {
    id: 'bcw-orig',
    categoryId: 'bottled-coconut-water',
    name: 'Pure Coconut Water',
    image: 'https://images.pexels.com/photos/16077079/pexels-photo-16077079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 180,
    originalPrice: 220,
    badge: 'Karachi only',
    description: 'Freshly extracted coconut water, bottled chilled with zero preservatives. Drink it cold for the most refreshing hit.',
    variations: [
      sizeVariation([
        { id: '250', label: '250ml', priceDelta: 0 },
        { id: '500', label: '500ml', priceDelta: 90 },
        { id: '1l', label: '1 Litre', priceDelta: 240 },
      ]),
      sugarVariation(),
    ],
  },
  {
    id: 'bcw-mint',
    categoryId: 'bottled-coconut-water',
    name: 'Coconut Water with Mint',
    image: 'https://images.pexels.com/photos/3651044/pexels-photo-3651044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 210,
    unit: '500ml',
    badge: 'Karachi only',
    description: 'Coconut water brightened with fresh mint — cooling, hydrating, and perfect for Karachi heat.',
    variations: [
      sizeVariation([
        { id: '250', label: '250ml', priceDelta: -30 },
        { id: '500', label: '500ml', priceDelta: 0 },
        { id: '1l', label: '1 Litre', priceDelta: 180 },
      ]),
    ],
  },
  {
    id: 'bcw-pulp',
    categoryId: 'bottled-coconut-water',
    name: 'Coconut Water with Malai Pulp',
    image: 'https://images.pexels.com/photos/13871766/pexels-photo-13871766.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 240,
    unit: '500ml',
    badge: 'New',
    description: 'Coconut water with soft, tender malai pieces floating inside — a drink and a snack in one bottle.',
    variations: [
      sizeVariation([
        { id: '500', label: '500ml', priceDelta: 0 },
        { id: '1l', label: '1 Litre', priceDelta: 210 },
      ]),
    ],
  },

  // Fresh Natural Juices — Karachi only
  {
    id: 'j-mango',
    categoryId: 'fresh-juices',
    name: 'Fresh Mango Juice',
    image: 'https://images.pexels.com/photos/6174874/pexels-photo-6174874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 320,
    originalPrice: 380,
    unit: '500ml',
    badge: 'Seasonal',
    description: 'Sindhri mangoes cold-pressed to a silky nectar. Available fresh only in mango season.',
    variations: [
      sizeVariation([
        { id: '250', label: '250ml', priceDelta: -110 },
        { id: '500', label: '500ml', priceDelta: 0 },
        { id: '1l', label: '1 Litre', priceDelta: 280 },
      ]),
      sugarVariation(),
    ],
  },
  {
    id: 'j-orange',
    categoryId: 'fresh-juices',
    name: 'Fresh Orange Juice',
    image: 'https://images.pexels.com/photos/6416553/pexels-photo-6416553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 300,
    unit: '500ml',
    badge: 'Karachi only',
    description: 'Hand-squeezed oranges, nothing added. Bright, tangy, and packed with vitamin C.',
    variations: [
      sizeVariation([
        { id: '250', label: '250ml', priceDelta: -100 },
        { id: '500', label: '500ml', priceDelta: 0 },
        { id: '1l', label: '1 Litre', priceDelta: 260 },
      ]),
      sugarVariation(),
    ],
  },
  {
    id: 'j-citrus-mint',
    categoryId: 'fresh-juices',
    name: 'Citrus Mint Cooler',
    image: 'https://images.pexels.com/photos/27287004/pexels-photo-27287004.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 290,
    unit: '500ml',
    badge: 'Karachi only',
    description: 'Orange, lemon, and lime shaken with mint and a touch of pink salt. A heatwave lifesaver.',
    variations: [
      sizeVariation([
        { id: '250', label: '250ml', priceDelta: -90 },
        { id: '500', label: '500ml', priceDelta: 0 },
        { id: '1l', label: '1 Litre', priceDelta: 240 },
      ]),
      sugarVariation(),
    ],
  },
  {
    id: 'j-dragonfruit',
    categoryId: 'fresh-juices',
    name: 'Dragon Fruit Smoothie',
    image: 'https://images.pexels.com/photos/34375012/pexels-photo-34375012.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 360,
    unit: '500ml',
    badge: 'New',
    description: 'Dragon fruit blended with coconut water for a vivid pink, antioxidant-rich smoothie.',
    variations: [
      sizeVariation([
        { id: '500', label: '500ml', priceDelta: 0 },
        { id: '1l', label: '1 Litre', priceDelta: 320 },
      ]),
      sugarVariation(),
    ],
  },
  {
    id: 'j-blood-orange',
    categoryId: 'fresh-juices',
    name: 'Blood Orange Press',
    image: 'https://images.pexels.com/photos/13546345/pexels-photo-13546345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 340,
    unit: '500ml',
    badge: 'Karachi only',
    description: 'Deep ruby blood oranges cold-pressed for a bold, berry-like citrus juice.',
    variations: [
      sizeVariation([
        { id: '250', label: '250ml', priceDelta: -110 },
        { id: '500', label: '500ml', priceDelta: 0 },
        { id: '1l', label: '1 Litre', priceDelta: 300 },
      ]),
      sugarVariation(),
    ],
  },

  // Bundles & Combos — Karachi only
  {
    id: 'b-cw6',
    categoryId: 'bundles',
    name: 'Coconut Water 6-Pack',
    image: 'https://images.pexels.com/photos/1413469/pexels-photo-1413469.png?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1100,
    originalPrice: 1320,
    unit: '6 × 500ml',
    badge: 'Save 17%',
    description: 'Six bottles of pure coconut water at a bundle price. Stock the fridge for the week.',
    variations: [
      {
        id: 'flavor',
        name: 'Flavour Mix',
        type: 'single',
        required: true,
        options: [
          { id: 'all-orig', label: 'All Original', priceDelta: 0 },
          { id: 'mix', label: 'Original + Mint Mix', priceDelta: 120 },
          { id: 'all-mint', label: 'All Mint', priceDelta: 180 },
        ],
      },
    ],
  },
  {
    id: 'b-juicebox',
    categoryId: 'bundles',
    name: 'Juice Variety Box',
    image: 'https://images.pexels.com/photos/8557143/pexels-photo-8557143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1450,
    originalPrice: 1700,
    unit: '5 × 500ml',
    badge: 'Best value',
    description: 'One each of mango, orange, citrus mint, blood orange, and dragon fruit. A full juice tasting.',
    variations: [
      sugarVariation(),
    ],
  },
  {
    id: 'b-family',
    categoryId: 'bundles',
    name: 'Family Hydration Bundle',
    image: 'https://images.pexels.com/photos/38853682/pexels-photo-38853682.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2200,
    originalPrice: 2600,
    unit: '10 bottles + 6 coconuts',
    badge: 'Save 15%',
    description: 'Ten bottles of coconut water plus six tender coconuts — the complete hydration kit for the whole family.',
    variations: [
      {
        id: 'size',
        name: 'Bottle Size',
        type: 'single',
        required: true,
        options: [
          { id: '500', label: '10 × 500ml', priceDelta: 0 },
          { id: '1l', label: '10 × 1 Litre', priceDelta: 1600 },
        ],
      },
    ],
  },

  // Extras — Karachi only
  {
    id: 'x-cookie',
    categoryId: 'extras',
    name: 'Coconut Cookies',
    image: 'https://images.pexels.com/photos/28664619/pexels-photo-28664619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 250,
    unit: 'box of 12',
    description: 'Buttery cookies baked with fresh coconut shavings. The perfect sweet finish to a coconut water.',
  },
  {
    id: 'x-water',
    categoryId: 'extras',
    name: 'Bottled Water 1.5L',
    image: 'https://images.pexels.com/photos/36183642/pexels-photo-36183642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 80,
    unit: '1.5L',
    description: 'Chilled mineral water — a handy add-on for your delivery.',
  },
  {
    id: 'x-straw',
    categoryId: 'extras',
    name: 'Reusable Bamboo Straws (4)',
    image: 'https://images.pexels.com/photos/2311854/pexels-photo-2311854.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 150,
    unit: 'pack of 4',
    badge: 'Eco',
    description: 'Washable bamboo straws for sipping coconut water the sustainable way.',
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'h1',
    eyebrow: 'Bundle Deal',
    title: 'Coconut Water 6-Pack',
    subtitle: 'Six chilled bottles of pure coconut water — delivered to your door in Karachi.',
    price: 'Rs. 1,100',
    cta: 'Order Now',
    image: 'https://images.pexels.com/photos/16077079/pexels-photo-16077079.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    align: 'right',
    tone: 'palm',
  },
  {
    id: 'h2',
    eyebrow: 'Nationwide Shipping',
    title: 'Fresh Coconuts, Anywhere in Pakistan',
    subtitle: 'Tender and malai coconuts packed in protective crates and shipped to every major city.',
    price: 'From Rs. 1,200',
    cta: 'Shop Coconuts',
    image: 'https://images.pexels.com/photos/18139256/pexels-photo-18139256.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    align: 'left',
    tone: 'cream',
  },
  {
    id: 'h3',
    eyebrow: 'Seasonal',
    title: 'Fresh Mango Juice is Back',
    subtitle: 'Cold-pressed Sindhri mango juice, bottled fresh in Karachi. Limited season.',
    price: 'Rs. 320',
    cta: 'Try It Now',
    image: 'https://images.pexels.com/photos/6174874/pexels-photo-6174874.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    align: 'right',
    tone: 'coral',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: '5 Benefits of Coconut Water You Should Know',
    excerpt: 'From natural hydration to a potassium boost, here is why coconut water beats every sports drink on the shelf.',
    image: 'https://images.pexels.com/photos/2470021/pexels-photo-2470021.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Wellness',
    readTime: '4 min read',
  },
  {
    id: 'b2',
    title: 'How to Store Fresh Coconuts at Home',
    excerpt: 'Keep your coconuts fresh for longer — the do’s and don’ts of storing both tender and mature coconuts.',
    image: 'https://images.pexels.com/photos/5008822/pexels-photo-5008822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Guides',
    readTime: '3 min read',
  },
  {
    id: 'b3',
    title: 'Natural Juice vs. Packaged Juice: The Real Difference',
    excerpt: 'What you lose when you choose a carton off the shelf — and what you gain by going fresh and preservative-free.',
    image: 'https://images.pexels.com/photos/1435824/pexels-photo-1435824.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Health',
    readTime: '5 min read',
  },
];

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#shop' },
  { label: 'Blog', href: '#blog' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const BRAND = {
  name: 'Natura Coco',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  email: 'hello@naturacoco.pk',
  about:
    'Natura Coco was born from a simple belief: nature already makes the perfect drink. We source fresh coconuts from farms across Pakistan and cold-press natural juices daily in our Karachi kitchen — no concentrates, no preservatives, no shortcuts. Just real, fresh, hydrating goodness, delivered to your door.',
};
