import { ShoppingBag } from 'lucide-react';
import { rs } from '@/utils/format';
import { cartTotal } from '@/state';
import type { CartItem } from '@/types';

interface Props {
  items: CartItem[];
  onOpen: () => void;
  visible: boolean;
}

export function FloatingCartBar({ items, onOpen, visible }: Props) {
  if (items.length === 0 || !visible) return null;
  const total = cartTotal(items);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:hidden animate-slideUp">
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between rounded-2xl bg-palm-700 px-4 py-3.5 text-white shadow-lift active:scale-[0.98] transition"
      >
        <span className="flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-palm-600">
            <ShoppingBag size={18} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-coral-500 px-1 text-[11px] font-bold ring-2 ring-palm-700">
              {count}
            </span>
          </span>
          <span className="text-sm font-semibold">View cart</span>
        </span>
        <span className="text-base font-extrabold">{rs(total)}</span>
      </button>
    </div>
  );
}
