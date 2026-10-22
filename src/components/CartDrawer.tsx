import { useState } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
  Pencil,
} from 'lucide-react';
import type { CartItem, LocationState, Product } from '@/types';
import {
  cartItemLineTotal,
  cartTotal,
  getDeliveryFee,
  getEta,
  activeCityName,
  activePickup,
} from '@/state';
import { rs } from '@/utils/format';
import { PRODUCTS } from '@/data';
import { cn } from '@/utils/cn';

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  location: LocationState;
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
  onEditItem: (p: Product) => void;
}

const UPSERT_IDS = ['x-cookie', 'x-water'];

export function CartDrawer({
  open,
  onClose,
  items,
  location,
  onInc,
  onDec,
  onRemove,
  onCheckout,
  onEditItem,
}: Props) {
  const [voucher, setVoucher] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);

  if (!open) return null;

  const subtotal = cartTotal(items);
  const deliveryFee = getDeliveryFee(location);
  const tax = Math.round(subtotal * 0.05);
  const discount = appliedVoucher === 'COCO10' ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  const upsells = PRODUCTS.filter(
    (p) => UPSERT_IDS.includes(p.id) && !items.some((i) => i.productId === p.id)
  );

  return (
    <div className="fixed inset-0 z-[85] flex justify-end">
      <div className="absolute inset-0 bg-palm-950/50 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-cream-50 shadow-lift animate-sheetUp sm:animate-popIn">
        {/* header */}
        <div className="flex items-center justify-between border-b border-palm-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-palm-700" />
            <h2 className="text-lg font-extrabold text-palm-900">Your Order</h2>
            <span className="chip bg-palm-100 text-palm-700">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-palm-500 hover:bg-palm-100 active:scale-90 transition"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* delivery mode line */}
        <div className="flex items-center justify-between bg-palm-50 px-5 py-2.5 text-xs font-semibold text-palm-700">
          <span>
            {location.mode === 'pickup' ? 'Pickup from' : 'Delivering to'}{' '}
            <span className="text-palm-900">
              {location.mode === 'pickup'
                ? activePickup(location)?.name ?? 'Karachi store'
                : activeCityName(location) ?? '—'}
            </span>
          </span>
          <span className="text-palm-500">{getEta(location)}</span>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-palm-100 text-palm-400">
                <ShoppingBag size={28} />
              </span>
              <p className="text-sm font-medium text-palm-600">
                Your cart is empty.<br />Add some fresh coconuts to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.productId);
                const variationText = item.variations
                  .map((v) => v.label)
                  .join(' · ');
                return (
                  <li
                    key={item.key}
                    className="flex gap-3 rounded-2xl bg-white p-3 shadow-soft"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold leading-tight text-palm-900">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => onRemove(item.key)}
                          className="text-palm-400 hover:text-coral-600 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {variationText && (
                        <p className="mt-0.5 text-xs text-palm-500">{variationText}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 rounded-full border border-palm-200 bg-cream-50 p-0.5">
                          <button
                            onClick={() => onDec(item.key)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-palm-700 active:scale-90 transition"
                            aria-label="Decrease"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-palm-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onInc(item.key)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-palm-700 active:scale-90 transition"
                            aria-label="Increase"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {product && (
                            <button
                              onClick={() => onEditItem(product)}
                              className="text-palm-400 hover:text-palm-700 transition"
                              aria-label="Edit item"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <span className="text-sm font-extrabold text-palm-900">
                            {rs(cartItemLineTotal(item))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* upsells */}
          {items.length > 0 && upsells.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-palm-500">
                Complete your order
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {upsells.map((p) => (
                  <UpsertCard key={p.id} product={p} onAdd={() => onEditItem(p)} />
                ))}
              </div>
            </div>
          )}

          {/* voucher */}
          {items.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-2 rounded-2xl border border-palm-200 bg-white p-1.5">
                <Tag size={16} className="ml-2 text-palm-400" />
                <input
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value.toUpperCase())}
                  placeholder="Promo code (try COCO10)"
                  className="flex-1 bg-transparent px-1 py-2 text-sm font-medium text-palm-900 outline-none placeholder:text-palm-400"
                />
                <button
                  onClick={() => setAppliedVoucher(voucher || null)}
                  className="rounded-xl bg-palm-100 px-3 py-2 text-xs font-bold text-palm-800 active:scale-95 transition"
                >
                  Apply
                </button>
              </div>
              {appliedVoucher === 'COCO10' && (
                <p className="mt-2 text-xs font-semibold text-palm-600">
                  Code COCO10 applied — 10% off
                </p>
              )}
              {appliedVoucher && appliedVoucher !== 'COCO10' && (
                <p className="mt-2 text-xs font-semibold text-coral-600">
                  Invalid code
                </p>
              )}
            </div>
          )}
        </div>

        {/* totals + checkout */}
        {items.length > 0 && (
          <div className="border-t border-palm-100 bg-white px-5 py-4">
            <Line label="Items Total" value={rs(subtotal)} />
            {discount > 0 && (
              <Line label="Discount" value={`- ${rs(discount)}`} accent />
            )}
            <Line label="GST (5%)" value={rs(tax)} />
            <Line
              label={location.mode === 'pickup' ? 'Pickup' : 'Delivery Fee'}
              value={location.mode === 'pickup' ? 'Free' : rs(deliveryFee)}
            />
            <div className="mt-2 flex items-center justify-between border-t border-palm-100 pt-2">
              <span className="text-base font-extrabold text-palm-900">Total Payable</span>
              <span className="text-xl font-extrabold text-coral-600">{rs(total)}</span>
            </div>
            <button onClick={onCheckout} className="btn-primary mt-3 w-full py-4">
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function Line({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-palm-600">{label}</span>
      <span className={cn('font-semibold', accent ? 'text-palm-600' : 'text-palm-900')}>
        {value}
      </span>
    </div>
  );
}

function UpsertCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  return (
    <button
      onClick={onAdd}
      className="flex w-36 shrink-0 items-center gap-2 rounded-2xl bg-palm-50 p-2 text-left transition hover:bg-palm-100 active:scale-95"
    >
      <img src={product.image} alt={product.name} className="h-11 w-11 rounded-lg object-cover" />
      <span className="flex flex-col">
        <span className="text-xs font-bold leading-tight text-palm-900 line-clamp-1">
          {product.name}
        </span>
        <span className="text-xs font-semibold text-coral-600">{rs(product.price)}</span>
        <span className="text-[10px] font-semibold text-palm-500">+ Add</span>
      </span>
    </button>
  );
}
