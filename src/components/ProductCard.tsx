import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { rs } from '@/utils/format';

interface Props {
  product: Product;
  onOpen: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
  index: number;
}

export function ProductCard({ product, onOpen, onQuickAdd, index }: Props) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  return (
    <article
      className="reveal group relative flex w-[44vw] max-w-[15rem] shrink-0 cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-full sm:max-w-none"
      style={{ transitionDelay: `${(index % 4) * 60}ms` }}
      onClick={() => onOpen(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-palm-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.badge && (
            <span className="chip bg-palm-700/90 text-[10px] uppercase tracking-wide text-cream-50 backdrop-blur">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="chip bg-coral-500 text-[10px] font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(product);
          }}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-coral-500 text-white shadow-lift transition active:scale-90 hover:bg-coral-600"
          aria-label={`Add ${product.name}`}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold leading-snug text-palm-900 line-clamp-2">
          {product.name}
        </h3>
        {product.unit && (
          <p className="mt-0.5 text-xs text-palm-500">{product.unit}</p>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-palm-900">{rs(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-palm-400 line-through">
              {rs(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
