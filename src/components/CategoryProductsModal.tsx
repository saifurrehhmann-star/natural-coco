import { useState, useMemo } from 'react';
import { X, Search, ArrowUpDown } from 'lucide-react';
import type { Category, Product } from '@/types';
import { ProductCard } from './ProductCard';
import { categoryIcon } from '@/utils/icons';

interface Props {
  open: boolean;
  category: Category | null;
  products: Product[];
  onClose: () => void;
  onOpenProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export function CategoryProductsModal({
  open,
  category,
  products,
  onClose,
  onOpenProduct,
  onQuickAdd,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchQuery, sortBy]);

  if (!open || !category) return null;

  const Icon = categoryIcon(category.emoji);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col h-[90vh] w-full max-w-5xl rounded-3xl bg-cream-50 shadow-lift border border-palm-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-palm-200/80 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-palm-100 text-palm-700 shadow-soft">
              <Icon size={24} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-palm-900">
                  {category.name}
                </h2>
                <span className="chip bg-palm-100 text-palm-800 text-[10px] font-bold py-0.5 px-2">
                  {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </span>
              </div>
              <p className="text-xs text-palm-500 line-clamp-1">{category.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-palm-200 text-palm-500 hover:text-palm-900 hover:bg-palm-50 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Search and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 px-5 py-3 border-b border-palm-200/60">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-2.5 text-palm-400" />
            <input
              type="text"
              placeholder={`Search within ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-palm-200 bg-cream-50/80 py-2 pl-9 pr-3 text-xs font-medium text-palm-900 outline-none focus:border-palm-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-palm-400 hover:text-palm-700 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <ArrowUpDown size={14} className="text-palm-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-2xl border border-palm-200 bg-white px-3 py-1.5 text-xs font-semibold text-palm-800 outline-none cursor-pointer focus:border-palm-500"
            >
              <option value="featured">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search size={36} className="text-palm-300" />
              <p className="mt-3 font-display text-sm font-bold text-palm-800">
                No products found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-coral-600 hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredProducts.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpen={onOpenProduct}
                  onQuickAdd={onQuickAdd}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
