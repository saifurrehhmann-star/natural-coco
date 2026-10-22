import { useEffect, useMemo, useState } from 'react';
import {
  X,
  Minus,
  Plus,
  Check,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Info,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { CartVariation, Product } from '@/types';
import { rs } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, variations: CartVariation[], quantity: number) => void;
}

export function ProductModal({ product, onClose, onAdd }: Props) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // first FAQ open by default

  useEffect(() => {
    if (product) {
      const init: Record<string, string> = {};
      product.variations?.forEach((g) => {
        if (g.options.length > 0 && g.required) init[g.id] = g.options[0].id;
      });
      setSelections(init);
      setQuantity(1);
      setError(null);
      setOpenFaqIndex(0);
    }
  }, [product]);

  const resolvedVariations: CartVariation[] = useMemo(() => {
    if (!product?.variations) return [];
    return product.variations
      .filter((g) => selections[g.id])
      .map((g) => {
        const opt = g.options.find((o) => o.id === selections[g.id])!;
        return {
          groupId: g.id,
          groupName: g.name,
          optionId: opt.id,
          label: opt.label,
          priceDelta: opt.priceDelta,
        };
      });
  }, [product, selections]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    const delta = resolvedVariations.reduce((s, v) => s + v.priceDelta, 0);
    return product.price + delta;
  }, [product, resolvedVariations]);

  const total = unitPrice * quantity;

  if (!product) return null;

  const handleAdd = () => {
    const missing = product.variations?.find(
      (g) => g.required && !selections[g.id]
    );
    if (missing) {
      setError(`Please select ${missing.name}`);
      return;
    }
    onAdd(product, resolvedVariations, quantity);
    onClose();
  };

  const cityLabel =
    product.cityVisibility === 'nationwide'
      ? 'Delivered Nationwide'
      : product.cityVisibility === 'karachi_only'
      ? 'Karachi Express Only'
      : 'Select Cities';

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-palm-950/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl bg-cream-50 rounded-t-4xl sm:rounded-4xl shadow-lift animate-sheetUp sm:animate-popIn max-h-[92vh] flex flex-col overflow-hidden">
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 bg-cream-50">
          <span className="h-1.5 w-12 rounded-full bg-palm-200" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-palm-700 shadow-soft hover:bg-white active:scale-90 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Product image */}
            <div className="relative h-64 sm:h-auto min-h-[18rem] bg-palm-100">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                {product.badge && (
                  <span className="chip bg-palm-800/90 text-[11px] font-bold uppercase tracking-wider text-cream-50 backdrop-blur shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="chip bg-white/95 text-[11px] font-semibold text-palm-800 backdrop-blur shadow-sm">
                  <MapPin size={12} className="text-coral-500" /> {cityLabel}
                </span>
              </div>
            </div>

            {/* Product Details Overview */}
            <div className="flex flex-col p-5 sm:p-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-palm-500">
                {product.categoryId.replace(/-/g, ' ')}
              </span>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight text-palm-900">
                {product.name}
              </h2>

              {/* Price & Discount */}
              <div className="mt-2 flex items-baseline gap-2.5">
                <span className="text-2xl font-extrabold text-palm-900">
                  {rs(unitPrice)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-palm-400 line-through">
                    {rs(product.originalPrice)}
                  </span>
                )}
                {product.unit && (
                  <span className="text-xs font-medium text-palm-500">
                    / {product.unit}
                  </span>
                )}
              </div>

              {/* Size Tag if present */}
              {product.size && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-palm-100/70 px-3 py-1.5 text-xs font-semibold text-palm-800">
                  <span className="text-palm-500 font-bold">Size / Spec:</span>
                  <span>{product.size}</span>
                </div>
              )}

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-palm-700">
                {product.description}
              </p>

              {/* Variations */}
              {product.variations && product.variations.length > 0 && (
                <div className="mt-5 space-y-4 border-t border-palm-100 pt-4">
                  {product.variations.map((g) => (
                    <div key={g.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-palm-900">
                          {g.name}
                        </span>
                        {g.required && (
                          <span className="text-[10px] font-semibold uppercase text-coral-500">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {g.options.map((o) => {
                          const active = selections[g.id] === o.id;
                          return (
                            <button
                              key={o.id}
                              onClick={() =>
                                setSelections((s) => ({ ...s, [g.id]: o.id }))
                              }
                              className={cn(
                                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition active:scale-95',
                                active
                                  ? 'border-palm-600 bg-palm-600 text-white shadow-soft'
                                  : 'border-palm-200 bg-white text-palm-800 hover:border-palm-400'
                              )}
                            >
                              {active && <Check size={13} />}
                              <span>{o.label}</span>
                              {o.priceDelta !== 0 && (
                                <span
                                  className={cn(
                                    'text-[11px]',
                                    active ? 'text-cream-200' : 'text-palm-500'
                                  )}
                                >
                                  {o.priceDelta > 0 ? '+' : ''}
                                  {rs(o.priceDelta)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="mt-3 rounded-xl bg-coral-50 px-3 py-2 text-xs font-semibold text-coral-700">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Deep Details: Benefits, How to Use, & FAQs */}
          <div className="border-t border-palm-200/80 bg-white px-5 py-6 sm:px-8 space-y-6">
            {/* Key Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-palm-900">
                  <Sparkles size={18} className="text-coral-500" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider">
                    Key Health & Taste Benefits
                  </h3>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-2xl bg-cream-50/80 border border-palm-100 p-3 text-xs font-medium text-palm-800"
                    >
                      <CheckCircle2 size={16} className="text-palm-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use */}
            {product.howToUse && (
              <div className="rounded-2xl border border-palm-200 bg-palm-50/60 p-4">
                <div className="flex items-center gap-2 text-palm-900">
                  <Info size={17} className="text-palm-700" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider">
                    How to Use & Enjoy
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-palm-700">
                  {product.howToUse}
                </p>
              </div>
            )}

            {/* Unique 5 to 10 FAQs Accordion */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-palm-900">
                    <HelpCircle size={18} className="text-palm-600" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider">
                      Frequently Asked Questions ({product.faqs.length})
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-palm-500">
                    Click to view answers
                  </span>
                </div>

                <div className="mt-3 divide-y divide-palm-100 rounded-2xl border border-palm-200 bg-white">
                  {product.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="transition-colors">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-3 p-3.5 text-left text-xs font-bold text-palm-900 hover:text-palm-700"
                        >
                          <span className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-palm-100 text-[10px] text-palm-700">
                              {idx + 1}
                            </span>
                            <span>{faq.question}</span>
                          </span>
                          <ChevronDown
                            size={16}
                            className={cn(
                              'text-palm-500 shrink-0 transition-transform duration-200',
                              isOpen && 'rotate-180 text-coral-500'
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-3.5 pt-0 text-xs leading-relaxed text-palm-600 border-t border-dashed border-palm-100/80 bg-cream-50/40">
                            <p className="mt-2">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky bottom add bar */}
        <div className="sticky bottom-0 left-0 right-0 flex items-center gap-3 border-t border-palm-100 bg-white p-4 shadow-lift sm:rounded-b-4xl">
          <div className="flex items-center gap-1 rounded-full border border-palm-200 bg-cream-50 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-palm-700 active:scale-90 transition disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span className="w-8 text-center text-sm font-bold text-palm-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-palm-700 active:scale-90 transition"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-coral-500 py-3.5 text-sm sm:text-base font-bold text-white shadow-soft transition hover:bg-coral-600 active:scale-95"
          >
            Add to Cart — {rs(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
