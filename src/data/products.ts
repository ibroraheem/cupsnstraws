export interface Product {
  id: string;
  name: string;
  description: string;
  healthBenefits: string[];
  price: number;
  image: string;
  sizes: ProductSize[];
  featured: boolean;
  category: 'drinks';
}

export interface ProductSize {
  size: string;
  price: number;
}

export const products: Product[] = [
  {
    id: 'signature',
    name: 'Cups N Straws Signature',
    description: 'Our signature blend combines the finest natural ingredients to create a uniquely refreshing and healthy drink that embodies our commitment to pure, natural beverages.',
    healthBenefits: [
      'Packed with natural antioxidants',
      'Supports immune system health',
      'Natural energy boost',
      'Rich in vitamins and minerals'
    ],
    price: 1200,
    image: 'https://images.pexels.com/photos/1232152/pexels-photo-1232152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '50cl', price: 1200 },
      { size: '75cl', price: 1600 },
      { size: '1L', price: 2000 }
    ],
    featured: true,
    category: 'drinks'
  },
  {
    id: 'zobo',
    name: 'Zobo Juice',
    description: 'A refreshing hibiscus drink made from dried roselle leaves, infused with natural spices and sweetened with honey. Our Zobo is made fresh daily with zero preservatives.',
    healthBenefits: [
      'Rich in Vitamin C and antioxidants',
      'Supports digestive health',
      'Helps lower blood pressure',
      'Natural immune system booster'
    ],
    price: 800,
    image: 'https://images.pexels.com/photos/6544089/pexels-photo-6544089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '50cl', price: 800 },
      { size: '75cl', price: 1200 },
      { size: '1L', price: 1500 }
    ],
    featured: true,
    category: 'drinks'
  },
  {
    id: 'tigernut',
    name: 'Tigernut Drink',
    description: 'A creamy, naturally sweet drink made from tiger nuts soaked to perfection. Our tiger nut drink is dairy-free and packed with nutrients.',
    healthBenefits: [
      'High in fiber and protein',
      'Promotes heart health',
      'Supports digestive health',
      'Natural source of energy'
    ],
    price: 1000,
    image: 'https://images.pexels.com/photos/3680015/pexels-photo-3680015.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '50cl', price: 1000 },
      { size: '75cl', price: 1400 },
      { size: '1L', price: 1800 }
    ],
    featured: true,
    category: 'drinks'
  },
  {
    id: 'ginger',
    name: 'Ginger Juice',
    description: 'A zesty, invigorating drink made with freshly grated ginger, lemon, and a hint of honey. Perfect for a natural energy boost.',
    healthBenefits: [
      'Anti-inflammatory properties',
      'Helps with nausea and digestion',
      'Boosts immunity',
      'Natural pain reliever'
    ],
    price: 900,
    image: 'https://images.pexels.com/photos/5947361/pexels-photo-5947361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '50cl', price: 900 },
      { size: '75cl', price: 1300 },
      { size: '1L', price: 1600 }
    ],
    featured: false,
    category: 'drinks'
  },
  {
    id: 'beetroot',
    name: 'Beet Juice',
    description: 'Fresh and vibrant beetroot juice packed with essential nutrients. A perfect blend for health enthusiasts and natural living.',
    healthBenefits: [
      'Improves blood flow',
      'Supports athletic performance',
      'Rich in antioxidants',
      'Natural detoxifier'
    ],
    price: 1100,
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '50cl', price: 1100 },
      { size: '75cl', price: 1500 },
      { size: '1L', price: 1900 }
    ],
    featured: false,
    category: 'drinks'
  },
  {
    id: 'tamarind',
    name: 'Tamarind Juice',
    description: 'A sweet and tangy drink made from tamarind fruit, known for its unique flavor profile and refreshing taste. Our tamarind drink is naturally sweetened.',
    healthBenefits: [
      'Rich in antioxidants',
      'Contains essential minerals',
      'Supports heart health',
      'Aids digestion'
    ],
    price: 850,
    image: 'https://images.pexels.com/photos/14010886/pexels-photo-14010886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '50cl', price: 850 },
      { size: '75cl', price: 1250 },
      { size: '1L', price: 1550 }
    ],
    featured: false,
    category: 'drinks'
  },
  {
    id: 'pineapple',
    name: 'Pineapple Juice',
    description: 'Sweet and tropical juice made from freshly pressed pineapples. No added sugars or preservatives, just the natural goodness of fresh pineapple.',
    healthBenefits: [
      'High in Vitamin C',
      'Contains bromelain enzyme',
      'Supports immune function',
      'Helps with digestion'
    ],
    price: 950,
    image: 'https://images.pexels.com/photos/3652072/pexels-photo-3652072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '50cl', price: 950 },
      { size: '75cl', price: 1350 },
      { size: '1L', price: 1650 }
    ],
    featured: true,
    category: 'drinks'
  },
  {
    id: 'date-syrup',
    name: 'Date Syrup',
    description: 'Natural sweetener made from pure dates. A healthy alternative to refined sugar, perfect for sweetening drinks or as a topping.',
    healthBenefits: [
      'Natural source of energy',
      'Rich in minerals',
      'Contains dietary fiber',
      'Antioxidant properties'
    ],
    price: 1500,
    image: 'https://images.pexels.com/photos/7511669/pexels-photo-7511669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    sizes: [
      { size: '250ml', price: 1500 },
      { size: '500ml', price: 2800 },
      { size: '1L', price: 5000 }
    ],
    featured: false,
    category: 'drinks'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};