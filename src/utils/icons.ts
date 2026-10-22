import {
  Palmtree,
  Droplet,
  Citrus,
  Package,
  Cookie,
  Leaf,
  ShoppingBag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const map: Record<string, LucideIcon> = {
  coconut: Palmtree,
  bottle: Droplet,
  juice: Citrus,
  bundle: Package,
  extra: Cookie,
  leaf: Leaf,
  bag: ShoppingBag,
};

export function categoryIcon(emoji: string): LucideIcon {
  return map[emoji] ?? Leaf;
}
