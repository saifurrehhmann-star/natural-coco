export type CityId =
  | 'karachi'
  | 'lahore'
  | 'islamabad'
  | 'rawalpindi'
  | 'faisalabad'
  | 'multan'
  | 'peshawar'
  | 'quetta';

export interface City {
  id: CityId;
  name: string;
  province: string;
  deliveryFee: number;
  deliveryEta: string;
  karachiOnly: boolean;
}

export interface PickupLocation {
  id: string;
  city: string;
  name: string;
  address: string;
  mapUrl: string;
  hours: string;
  readyIn: string;
}

export type VariationType = 'single' | 'multi';

export interface VariationOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface VariationGroup {
  id: string;
  name: string;
  type: VariationType;
  required: boolean;
  options: VariationOption[];
}

export type CategoryId = string;

export interface Category {
  id: string;
  name: string;
  tagline: string;
  nationwide: boolean;
  emoji: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export type CityVisibility = 'nationwide' | 'karachi_only' | 'custom';

export interface Product {
  id: string;
  categoryId: CategoryId;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  unit?: string;
  badge?: string;
  description: string;
  size?: string;
  howToUse?: string;
  benefits?: string[];
  faqs?: ProductFAQ[];
  cityVisibility?: CityVisibility;
  allowedCityIds?: CityId[];
  inStock?: boolean;
  variations?: VariationGroup[];
}

export interface CartVariation {
  groupId: string;
  groupName: string;
  optionId: string;
  label: string;
  priceDelta: number;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  variations: CartVariation[];
  quantity: number;
}

export type FulfillmentMode = 'delivery' | 'pickup';

export interface LocationState {
  mode: FulfillmentMode;
  cityId: CityId | null;
  pickupId: string | null;
  phone: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  price: string;
  cta: string;
  image: string;
  align?: 'left' | 'right';
  tone: 'palm' | 'cream' | 'coral';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

export interface OrderDetails {
  ref: string;
  mode: FulfillmentMode;
  cityId: CityId | null;
  pickup: PickupLocation | null;
  address: string;
  phone: string;
  customerName?: string;
  customerEmail?: string;
  customerId?: string;
  items: CartItem[];
  itemsTotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: string;
  notes?: string;
  placedAt: string;
  eta: string;
  stage?: OrderStage;
}

export type OrderStage = 'placed' | 'prep' | 'transit' | 'delivered';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  city?: string;
  address?: string;
  registeredAt: string;
  totalOrders?: number;
  totalSpent?: number;
  status: 'active' | 'blocked';
  notes?: string;
}
