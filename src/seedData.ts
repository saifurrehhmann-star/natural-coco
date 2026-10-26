import type { Product, HeroSlide, Customer } from './types';

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
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
    eyebrow: 'Seasonal Special',
    title: 'Fresh Mango Juice is Back',
    subtitle: 'Cold-pressed Sindhri mango juice, bottled fresh in Karachi. Limited season.',
    price: 'Rs. 320',
    cta: 'Try It Now',
    image: 'https://images.pexels.com/photos/6174874/pexels-photo-6174874.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    align: 'right',
    tone: 'coral',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'fc-tender-6',
    categoryId: 'fresh-coconuts',
    name: 'Tender Young Coconuts',
    image: 'https://images.pexels.com/photos/16005627/pexels-photo-16005627.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1200,
    originalPrice: 1500,
    unit: 'pack of 6',
    badge: 'Nationwide',
    size: 'Pack of 6 (Approx. 1.8L - 2.2L total water)',
    cityVisibility: 'nationwide',
    inStock: true,
    description: 'Hand-picked green tender coconuts sourced directly from coastal farms. Packed with naturally sweet water rich in vital potassium, magnesium, and natural electrolytes.',
    howToUse: 'Chill the coconuts in the refrigerator for 2-3 hours for best taste. Cut off the top crown with a heavy kitchen knife or coconut opener, insert a straw, and drink immediately. Once finished, scoop out the thin, jelly-like tender flesh with a spoon.',
    benefits: [
      '100% Raw & unprocessed natural isotonic beverage',
      'Rich in potassium and magnesium for instant muscle recovery',
      'Naturally low in calories with zero cholesterol and zero fat',
      'Promotes digestive wellness and maintains electrolyte balance',
      'Helps maintain clear, hydrated, and glowing skin'
    ],
    faqs: [
      {
        question: 'How much water does each tender coconut contain?',
        answer: 'Each fresh tender coconut contains approximately 300ml to 400ml of pure, sweet coconut water.'
      },
      {
        question: 'How long can I store these coconuts at home?',
        answer: 'Whole, uncut tender coconuts can be kept at room temperature in a dry and shaded place for up to 7-10 days, or refrigerated for up to 3 weeks.'
      },
      {
        question: 'How do you ship fresh coconuts nationwide without damage?',
        answer: 'We pack our coconuts in custom heavy-duty shock-absorbing ventilated crates with protective padding, ensuring they arrive completely undamaged and fresh.'
      },
      {
        question: 'Is any sugar, water, or preservative added?',
        answer: 'Absolutely nothing! These are 100% natural, intact whole coconuts straight from the palm tree.'
      },
      {
        question: 'Is coconut water safe for children and pregnant women?',
        answer: 'Yes, natural coconut water is gentle, clean, and nutritious for people of all ages. However, consult your doctor for any specific dietary limits.'
      },
      {
        question: 'How do I open the coconut at home easily?',
        answer: 'Slice away the fibrous green tip using a chef knife or cleaver until you see the round hard shell, then give 2-3 firm taps with the back of the knife to crack the lid open.'
      },
      {
        question: 'Does this tender coconut have malai (meat)?',
        answer: 'Yes, tender young coconuts have soft, translucent, jelly-like malai which is very light and delicious to scoop.'
      }
    ],
    variations: [
      {
        id: 'size',
        name: 'Pack Size',
        type: 'single',
        required: true,
        options: [
          { id: 'pack-6', label: 'Pack of 6', priceDelta: 0 },
          { id: 'pack-12', label: 'Pack of 12', priceDelta: 2200 },
        ],
      },
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
    size: 'Pack of 9 Medium-Large Coconuts',
    cityVisibility: 'nationwide',
    inStock: true,
    description: 'Semi-mature coconuts prized for their thick, rich, and creamy coconut malai. Perfect for making traditional desserts, coconut curries, or eating fresh with a touch of honey.',
    howToUse: 'Crack open the coconut, pour out the sweet water into a glass, and use a sturdy spoon or scraper to collect the thick, velvety white meat. Ideal for blending into shakes, curries, or baking.',
    benefits: [
      'High in healthy Medium-Chain Triglycerides (MCTs) that boost metabolism',
      'Excellent source of dietary fiber that supports gut health',
      'Provides sustained, clean energy throughout the day',
      'Rich in antioxidants and beneficial plant fats'
    ],
    faqs: [
      {
        question: 'What is the texture of the malai in these coconuts?',
        answer: 'The meat is firm yet tender and creamy, significantly thicker than tender young coconuts, giving a rich coconut flavor.'
      },
      {
        question: 'Can I use this malai for cooking and desserts?',
        answer: 'Yes! It is ideal for kheer, coconut barfi, smoothies, coastal curries, and healthy keto snacks.'
      },
      {
        question: 'Does it still have coconut water inside?',
        answer: 'Yes, each coconut still holds about 200ml to 250ml of naturally sweet, refreshing coconut water.'
      },
      {
        question: 'How long can the extracted malai stay fresh?',
        answer: 'Once scooped out, store the malai in an airtight container in your refrigerator and consume within 3-4 days, or freeze for up to 1 month.'
      },
      {
        question: 'Do you deliver this to Lahore, Islamabad, and other cities?',
        answer: 'Yes, this product is eligible for nationwide courier delivery across all major cities of Pakistan.'
      },
      {
        question: 'What if a coconut arrives dried out or spoiled?',
        answer: 'We offer a 100% Freshness Guarantee. Simply send a photo on our WhatsApp number within 24 hours of delivery for an instant replacement or refund.'
      }
    ],
    variations: [
      {
        id: 'size',
        name: 'Pack Size',
        type: 'single',
        required: true,
        options: [
          { id: 'pack-9', label: 'Pack of 9', priceDelta: 0 },
          { id: 'pack-18', label: 'Pack of 18', priceDelta: 3000 },
        ],
      },
    ],
  },
  {
    id: 'fc-mixed-12',
    categoryId: 'fresh-coconuts',
    name: 'Mixed Box (Tender + Malai)',
    image: 'https://images.pexels.com/photos/18139256/pexels-photo-18139256.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2100,
    unit: 'pack of 12',
    badge: 'Popular',
    size: '12 Coconuts (6 Tender + 6 Malai)',
    cityVisibility: 'nationwide',
    inStock: true,
    description: 'The ultimate sampler box: 6 tender young coconuts loaded with refreshing water, plus 6 semi-mature coconuts rich with thick malai meat. The best of both worlds in one delivery.',
    howToUse: 'Enjoy the tender coconuts first for instant hydration after workouts or hot afternoons, and use the malai coconuts for morning breakfast smoothies or family desserts.',
    benefits: [
      'Complete coconut experience with both drinking water and edible meat',
      'Saves money compared to purchasing individual packs',
      'Provides daily natural hydration for the entire family'
    ],
    faqs: [
      {
        question: 'How are the tender and malai coconuts differentiated in the box?',
        answer: 'Each coconut is labeled or color-marked so you can easily distinguish between the drinking coconuts and the malai coconuts.'
      },
      {
        question: 'What is the shelf life of this mixed box?',
        answer: 'Keep the crate in a cool, ventilated area. The tender coconuts are best consumed within 7 days, and malai coconuts within 14 days.'
      },
      {
        question: 'Can I customize the ratio of tender vs malai?',
        answer: 'Yes, you can leave a note during checkout or message our customer care on WhatsApp if you prefer an 8/4 split.'
      },
      {
        question: 'How fast is nationwide delivery for this box?',
        answer: 'Orders to Lahore, Islamabad, Rawalpindi, and Faisalabad typically take 2-3 business days via priority express logistics.'
      },
      {
        question: 'Is COD available for nationwide orders?',
        answer: 'Yes! Cash on Delivery is available across all serviceable cities in Pakistan.'
      }
    ],
  },
  {
    id: 'cw-pure-500',
    categoryId: 'bottled-coconut-water',
    name: 'Pure Raw Coconut Water',
    image: 'https://images.pexels.com/photos/8995296/pexels-photo-8995296.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 220,
    unit: '500ml bottle',
    badge: 'Chilled Daily',
    size: '500ml Chilled Bottle',
    cityVisibility: 'karachi_only',
    inStock: true,
    description: '100% pure tender coconut water, extracted and bottled fresh on the day of delivery in Karachi. Never heated, never concentrated, zero additives.',
    howToUse: 'Keep refrigerated between 2°C and 4°C at all times. Shake gently before drinking and consume within 24 to 36 hours of delivery.',
    benefits: [
      'Zero added sugars, syrups, or artificial flavors',
      'Naturally isotonic with 5 essential electrolytes (K, Na, Mg, Ca, P)',
      'Aids in rapid hydration during Karachi heatwaves',
      'Gentle on the stomach and supports healthy blood pressure'
    ],
    faqs: [
      {
        question: 'Why is this product only available in Karachi?',
        answer: 'Because we do not add chemical preservatives or use high-heat pasteurization, our fresh bottled water requires cold-chain delivery within 30-45 minutes.'
      },
      {
        question: 'How long will it stay fresh in my fridge?',
        answer: 'Keep it sealed in the coldest part of your refrigerator and enjoy within 36 hours for peak freshness and flavor.'
      },
      {
        question: 'Are there any preservatives in the bottle?',
        answer: 'None whatsoever. We use sterile cold bottling techniques straight from freshly cracked young coconuts.'
      },
      {
        question: 'Can I freeze the bottle for later use?',
        answer: 'Yes, you can freeze it for up to 2 weeks. Thaw in the refrigerator before drinking.'
      },
      {
        question: 'Is this good for workout hydration?',
        answer: 'It is the perfect post-workout drink, replenishing fluids and electrolytes faster than plain water or commercial sports drinks.'
      }
    ],
    variations: [
      {
        id: 'size',
        name: 'Size',
        type: 'single',
        required: true,
        options: [
          { id: '500', label: '500ml', priceDelta: 0 },
          { id: '1l', label: '1 Litre', priceDelta: 160 },
        ],
      },
    ],
  },
  {
    id: 'cw-mint-500',
    categoryId: 'bottled-coconut-water',
    name: 'Mint Infused Coconut Water',
    image: 'https://images.pexels.com/photos/1413469/pexels-photo-1413469.png?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 250,
    unit: '500ml bottle',
    badge: 'Refreshing',
    size: '500ml Bottle',
    cityVisibility: 'karachi_only',
    inStock: true,
    description: 'Pure cold coconut water steeped with hand-crushed garden fresh mint leaves and a squeeze of natural lime. Ultra-refreshing and cooling.',
    howToUse: 'Serve ice-cold over crushed ice with a fresh mint sprig for a luxury tropical mocktail experience.',
    benefits: [
      'Natural body cooling properties especially during hot weather',
      'Mint aids in soothing indigestion and relieving bloating',
      'Delivers an invigorating and crisp refreshing herbal flavor',
      'Rich in vitamin C from fresh lime'
    ],
    faqs: [
      {
        question: 'Does this contain artificial mint flavoring or syrup?',
        answer: 'No! We use real organic garden mint leaves and real lime juice.'
      },
      {
        question: 'Is it sweet or sour?',
        answer: 'It is naturally sweet from the coconut water with a light tangy and zesty mint finish.'
      },
      {
        question: 'How long can I keep it refrigerated?',
        answer: 'Consume within 24-36 hours for optimal taste.'
      },
      {
        question: 'Is it suitable for diet and fitness routines?',
        answer: 'Yes, it has fewer than 70 calories per bottle and zero refined sugars.'
      },
      {
        question: 'Can I order a 1-litre version?',
        answer: 'Yes, select the 1 Litre option from the size dropdown.'
      }
    ],
    variations: [
      {
        id: 'size',
        name: 'Size',
        type: 'single',
        required: true,
        options: [
          { id: '500', label: '500ml', priceDelta: 0 },
          { id: '1l', label: '1 Litre', priceDelta: 180 },
        ],
      },
    ],
  },
  {
    id: 'fj-mango',
    categoryId: 'fresh-juices',
    name: 'Cold-Pressed Sindhri Mango Juice',
    image: 'https://images.pexels.com/photos/6174874/pexels-photo-6174874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 320,
    unit: '500ml bottle',
    badge: 'Seasonal',
    size: '500ml Bottle',
    cityVisibility: 'karachi_only',
    inStock: true,
    description: 'Luscious, ripe Sindhri mangoes cold-pressed daily with a splash of pure coconut water. Pure liquid gold with no artificial colors or flavors.',
    howToUse: 'Shake vigorously before pouring. Best enjoyed chilled as a morning boost or afternoon sweet indulgence.',
    benefits: [
      'High in Vitamin A and Vitamin C for immune strength and vision',
      'Rich in natural enzymes that support digestion',
      'Made from 100% real tree-ripened Sindhri mangoes'
    ],
    faqs: [
      {
        question: 'Is there any added sugar?',
        answer: 'We do not add any sugar by default because Sindhri mangoes are naturally sweet. You can select your sugar preference if desired.'
      },
      {
        question: 'Is water added to dilute the juice?',
        answer: 'We never dilute with plain tap water; only a touch of pure coconut water is used for the perfect pouring consistency.'
      },
      {
        question: 'How long can I store this in the fridge?',
        answer: 'Consume within 48 hours of delivery as this contains no chemical preservatives.'
      },
      {
        question: 'Is this available year-round?',
        answer: 'This is a seasonal specialty available during the Pakistani mango season.'
      },
      {
        question: 'Can I order this for events or parties?',
        answer: 'Yes, for large bulk orders please contact our WhatsApp hotline 24 hours in advance.'
      }
    ],
    variations: [
      {
        id: 'size',
        name: 'Size',
        type: 'single',
        required: true,
        options: [
          { id: '500', label: '500ml', priceDelta: 0 },
          { id: '1l', label: '1 Litre', priceDelta: 260 },
        ],
      },
    ],
  },
  {
    id: 'b-cw6',
    categoryId: 'bundles',
    name: 'Coconut Water 6-Pack',
    image: 'https://images.pexels.com/photos/1413469/pexels-photo-1413469.png?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1100,
    originalPrice: 1320,
    unit: '6 × 500ml',
    badge: 'Save 17%',
    size: '6 × 500ml Bottles (3 Litres Total)',
    cityVisibility: 'karachi_only',
    inStock: true,
    description: 'Six bottles of pure coconut water at a bundled savings price. Stock your refrigerator with clean, healthy daily hydration for the whole family.',
    howToUse: 'Keep all bottles refrigerated upon arrival. Drink one bottle each morning or carry one with you to work or gym.',
    benefits: [
      'Save 17% compared to individual bottle purchases',
      'Convenient ready-to-drink format with resealable caps',
      'Ensures continuous healthy hydration for you and your family'
    ],
    faqs: [
      {
        question: 'Can I mix original and mint flavors in the 6-pack?',
        answer: 'Yes! Select the "Flavour Mix" option to receive 3 Original and 3 Mint bottles.'
      },
      {
        question: 'How fast is delivery in Karachi?',
        answer: 'Our Karachi riders deliver within 30 to 45 minutes of order confirmation.'
      },
      {
        question: 'Do the bottles come chilled?',
        answer: 'Yes, our riders use insulated thermal cooler bags with ice packs to ensure your bottles arrive frosty cold.'
      },
      {
        question: 'Are the bottles BPA-free?',
        answer: 'Yes, we use food-grade, 100% recyclable, BPA-free PET bottles.'
      },
      {
        question: 'Can I place a recurring weekly subscription?',
        answer: 'Yes, reach out via WhatsApp and we will set up automatic scheduled deliveries for your home.'
      }
    ],
  },
  {
    id: 'x-meat-250',
    categoryId: 'extras',
    name: 'Fresh Coconut Malai Tub',
    image: 'https://images.pexels.com/photos/8995296/pexels-photo-8995296.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 250,
    unit: '250g tub',
    badge: 'Fresh Daily',
    size: '250g Sealed Tub',
    cityVisibility: 'karachi_only',
    inStock: true,
    description: 'Scooped fresh daily from young coconuts: pure, creamy tender malai packaged in a sealed food-safe container. Ready to eat or blend.',
    howToUse: 'Enjoy directly with a spoon, top your breakfast oatmeal, blend into protein smoothies, or use in desserts and fruit salads.',
    benefits: [
      'Rich in healthy plant-based fats and energy-dense MCTs',
      'No added sugars, sweeteners, or preservatives',
      'Convenient and zero waste — no cracking shells at home'
    ],
    faqs: [
      {
        question: 'Is the malai sweetened?',
        answer: 'No, it has only its natural subtle sweetness directly from the coconut.'
      },
      {
        question: 'How long can I keep the opened tub in my fridge?',
        answer: 'Keep sealed in your refrigerator and consume within 3 days of opening.'
      },
      {
        question: 'Can I freeze this tub?',
        answer: 'Yes, it freezes exceptionally well for up to 30 days.'
      },
      {
        question: 'Is this suitable for vegan and keto diets?',
        answer: 'Absolutely. It is 100% plant-based, raw, and keto-friendly.'
      },
      {
        question: 'How many coconuts are used to make one 250g tub?',
        answer: 'Each tub contains the hand-scooped meat of approximately 3 to 4 fresh coconuts.'
      }
    ],
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];
