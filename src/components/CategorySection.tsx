import { ChevronRight } from 'lucide-react';
import type { Category, Product } from '@/types';
import { ProductCard } from './ProductCard';
import { categoryIcon } from '@/utils/icons';

interface Props {
  category: Category;
  products: Product[];
  onOpenProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export function CategorySection({ category, products, onOpenProduct, onQuickAdd }: Props) {
  if (products.length === 0) return null;
  const Icon = categoryIcon(category.emoji);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="reveal mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-palm-100 text-palm-700">
            <Icon size={22} />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-palm-900 sm:text-2xl">
              {category.name}
            </h2>
            <p className="text-xs text-palm-500 sm:text-sm">
              {products.length} {products.length === 1 ? 'item' : 'items'} · {category.tagline}
            </p>
          </div>
        </div>
        <button className="hidden items-center gap-1 text-sm font-semibold text-palm-600 hover:text-palm-800 sm:flex">
          See All <ChevronRight size={16} />
        </button>
      </div>

      {/* horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-4 sm:snap-none sm:pb-0">
        {products.map((p, i) => (
          <div key={p.id} className="snap-start">
            <ProductCard
              product={p}
              onOpen={onOpenProduct}
              onQuickAdd={onQuickAdd}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
