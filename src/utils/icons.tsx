import {
  Palmtree,
  Droplet,
  Citrus,
  Package,
  Cookie,
  Leaf,
  ShoppingBag,
  Sparkles,
  Coffee,
  Heart,
  Flame,
  Sun,
  Snowflake,
  Gift,
  Award,
  Zap,
  Tag,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryIconOption {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
  { id: 'coconut', label: 'Coconut / Palm', icon: Palmtree, description: 'Whole & raw coconuts' },
  { id: 'bottle', label: 'Bottled Water', icon: Droplet, description: 'Chilled pure coconut water' },
  { id: 'juice', label: 'Fresh Juices', icon: Citrus, description: 'Cold-pressed tropical juices' },
  { id: 'bundle', label: 'Bundles & Combos', icon: Package, description: 'Multi-packs & value deals' },
  { id: 'extra', label: 'Treats & Extras', icon: Cookie, description: 'Desserts, malai & snacks' },
  { id: 'leaf', label: 'Organic & Pure', icon: Leaf, description: '100% raw and farm fresh' },
  { id: 'bag', label: 'Store Packs', icon: ShoppingBag, description: 'Cartons & bulk orders' },
  { id: 'sparkles', label: 'Special & Premium', icon: Sparkles, description: 'Signature premium items' },
  { id: 'cup', label: 'Beverages', icon: Coffee, description: 'Shakes, blends & drinks' },
  { id: 'wellness', label: 'Health & Wellness', icon: Heart, description: 'Hydration & electrolytes' },
  { id: 'hot', label: 'Hot Deals', icon: Flame, description: 'Special seasonal offers' },
  { id: 'summer', label: 'Summer Fresh', icon: Sun, description: 'Refreshing chillers' },
  { id: 'ice', label: 'Ice Cold', icon: Snowflake, description: 'Chilled express delivery' },
  { id: 'gift', label: 'Gift Boxes', icon: Gift, description: 'Festive & corporate hampers' },
  { id: 'bestseller', label: 'Best Sellers', icon: Award, description: 'Customer top favorites' },
  { id: 'energy', label: 'Energy Boost', icon: Zap, description: 'Workout & stamina drinks' },
  { id: 'deal', label: 'Special Discounts', icon: Tag, description: 'Promotional categories' },
  { id: 'favorite', label: 'Staff Pick', icon: Star, description: 'Featured selection' },
];

export const POPULAR_CATEGORY_EMOJIS = [
  '🥥', '🥤', '🌴', '🍹', '🍯', '🍦', '🥭', '🍍',
  '🥛', '🍨', '🍪', '🌿', '💧', '✨', '📦', '🥇',
  '🍋', '🍉', '🍇', '🌱', '☕', '🧁', '🥗', '⚡'
];

const map: Record<string, LucideIcon> = {
  coconut: Palmtree,
  bottle: Droplet,
  juice: Citrus,
  bundle: Package,
  extra: Cookie,
  leaf: Leaf,
  bag: ShoppingBag,
  sparkles: Sparkles,
  cup: Coffee,
  wellness: Heart,
  hot: Flame,
  summer: Sun,
  ice: Snowflake,
  gift: Gift,
  bestseller: Award,
  energy: Zap,
  deal: Tag,
  favorite: Star,
};

export function isCustomImageIcon(emoji?: string): boolean {
  if (!emoji) return false;
  return emoji.startsWith('http://') || emoji.startsWith('https://') || emoji.startsWith('data:image');
}

export function isPresetIcon(emoji?: string): boolean {
  if (!emoji) return false;
  return emoji in map;
}

export function categoryIcon(emoji?: string): LucideIcon {
  if (!emoji) return Palmtree;
  if (isCustomImageIcon(emoji)) return ImageIcon;
  return map[emoji] ?? Palmtree;
}

export function getCategoryIconMeta(emoji?: string): CategoryIconOption {
  if (!emoji) return CATEGORY_ICON_OPTIONS[0];
  const match = CATEGORY_ICON_OPTIONS.find((opt) => opt.id === emoji);
  if (match) return match;

  if (isCustomImageIcon(emoji)) {
    return {
      id: emoji,
      label: 'Custom Image Icon',
      icon: ImageIcon,
      description: 'Custom uploaded image icon',
    };
  }

  return {
    id: emoji,
    label: `Custom Emoji: ${emoji}`,
    icon: Sparkles,
    description: 'Custom selected emoji',
  };
}

export function CategoryIcon({
  emoji,
  size = 20,
  className = '',
}: {
  emoji?: string;
  size?: number;
  className?: string;
}) {
  if (!emoji) {
    const Fallback = Palmtree;
    return <Fallback size={size} className={className} />;
  }

  if (isCustomImageIcon(emoji)) {
    return (
      <img
        src={emoji}
        alt="Category icon"
        className={`inline-block object-contain rounded-lg ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  if (isPresetIcon(emoji)) {
    const IconComp = map[emoji];
    return <IconComp size={size} className={className} />;
  }

  // Custom emoji or unicode character
  return (
    <span
      className={`inline-flex items-center justify-center select-none leading-none ${className}`}
      style={{ fontSize: `${Math.round(size * 0.9)}px`, width: `${size}px`, height: `${size}px` }}
      role="img"
      aria-label="category icon"
    >
      {emoji}
    </span>
  );
}
