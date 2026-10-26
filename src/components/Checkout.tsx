import { useState, useEffect } from 'react';
import { X, ArrowLeft, MapPin, Phone, CreditCard, Banknote, Check, Store, Truck } from 'lucide-react';
import type { CartItem, LocationState, OrderDetails, Customer } from '@/types';
import {
  cartTotal,
  getDeliveryFee,
  activeCity,
  activeCityName,
  activePickup,
  generateOrderRef,
} from '@/state';
import { rs } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Props {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  items: CartItem[];
  location: LocationState;
  customerUser?: Customer | null;
  onPlaceOrder: (order: OrderDetails) => void;
}

export function Checkout({ open, onClose, onBack, items, location, customerUser, onPlaceOrder }: Props) {
  const [address, setAddress] = useState(customerUser?.address || '');
  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || location.phone || '');
  const [payment, setPayment] = useState<'cod' | 'online'>('cod');
  const [error, setError] = useState<string | null>(null);

  // Auto-fill customer details whenever modal opens or customerUser changes
  useEffect(() => {
    if (open && customerUser) {
      if (customerUser.name) setName(customerUser.name);
      if (customerUser.phone) setPhone(customerUser.phone);
      if (customerUser.address) setAddress(customerUser.address);
    }
  }, [open, customerUser]);

  if (!open) return null;

  const subtotal = cartTotal(items);
  const deliveryFee = getDeliveryFee(location);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;
  const isPickup = location.mode === 'pickup';
  const city = activeCity(location);

  const handlePlace = () => {
    if (!name.trim()) return setError('Please enter your name');
    if (!phone.trim()) return setError('Please enter your phone number');
    if (!isPickup && !address.trim()) return setError('Please enter your delivery address');
    setError(null);
    const order: OrderDetails = {
      ref: generateOrderRef(),
      mode: location.mode,
      cityId: location.cityId,
      pickup: activePickup(location),
      address: isPickup ? activePickup(location)?.address ?? '' : address.trim(),
      phone: phone.trim(),
      customerName: name.trim() || customerUser?.name,
      customerEmail: customerUser?.email || '',
      customerId: customerUser?.id,
      items,
      itemsTotal: subtotal,
      tax,
      deliveryFee,
      total,
      paymentMethod: payment === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      placedAt: new Date().toLocaleString('en-PK', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      eta: isPickup
        ? activePickup(location)?.readyIn ?? '20–30 min'
        : city?.deliveryEta ?? '—',
    };
    onPlaceOrder(order);
  };

  return (
    <div className="fixed inset-0 z-[88] flex justify-end">
      <div className="absolute inset-0 bg-palm-950/50 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-cream-50 shadow-lift animate-sheetUp sm:animate-popIn">
        <div className="flex items-center gap-3 border-b border-palm-100 px-5 py-4">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-palm-100 text-palm-700 active:scale-90 transition"
            aria-label="Back to cart"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="flex-1 text-lg font-extrabold text-palm-900">Checkout</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-palm-500 hover:bg-palm-100 active:scale-90 transition"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
          {/* mode banner */}
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-palm-50 px-3 py-2.5 text-xs font-semibold text-palm-700">
            {isPickup ? <Store size={15} /> : <Truck size={15} />}
            {isPickup ? (
              <span>
                Pickup at <span className="text-palm-900">{activePickup(location)?.name}</span>
              </span>
            ) : (
              <span>
                Delivery to <span className="text-palm-900">{activeCityName(location)}</span> · ETA {city?.deliveryEta}
              </span>
            )}
          </div>

          {customerUser && (
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200/90 p-3 text-xs text-emerald-900 shadow-soft animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs">
                  {customerUser.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-extrabold text-emerald-900 leading-tight">
                    Welcome, {customerUser.name}
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Your details have been automatically filled from your profile.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/80 px-2.5 py-1 text-[10px] font-black text-emerald-900 uppercase tracking-wider">
                <Check size={11} className="stroke-[3]" /> Auto-Filled
              </span>
            </div>
          )}

          <h3 className="text-sm font-bold uppercase tracking-wider text-palm-500">
            {isPickup ? 'Contact Details' : 'Delivery Details'}
          </h3>

          <div className="mt-3 space-y-3">
            <Field label="Full Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="checkout-input"
              />
            </Field>
            <Field label="Phone Number" icon={<Phone size={16} />}>
              <input
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX XXX XXXX"
                className="checkout-input pl-10"
              />
            </Field>
            {!isPickup && (
              <Field label="Delivery Address" icon={<MapPin size={16} />}>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, street, area, nearest landmark"
                  rows={3}
                  className="checkout-input pl-10 resize-none"
                />
              </Field>
            )}
            {isPickup && (
              <div className="rounded-2xl border border-palm-200 bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-palm-500">
                  Pickup Address
                </p>
                <p className="mt-1 text-sm font-medium text-palm-900">
                  {activePickup(location)?.address}
                </p>
                <a
                  href={activePickup(location)?.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-palm-600 underline underline-offset-2"
                >
                  <MapPin size={13} /> Open in Maps
                </a>
              </div>
            )}
          </div>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-palm-500">
            Payment Method
          </h3>
          <div className="mt-3 space-y-2">
            <PaymentOption
              active={payment === 'cod'}
              onClick={() => setPayment('cod')}
              icon={<Banknote size={20} />}
              label="Cash on Delivery"
              hint="Pay with cash when your order arrives"
            />
            <PaymentOption
              active={payment === 'online'}
              onClick={() => setPayment('online')}
              icon={<CreditCard size={20} />}
              label="Online Payment"
              hint="Card / mobile wallet — coming soon"
              disabled
            />
          </div>

          {/* summary */}
          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-palm-500">
            Order Summary
          </h3>
          <div className="mt-3 rounded-2xl bg-white p-4 shadow-soft">
            {items.map((i) => (
              <div key={i.key} className="flex justify-between py-1 text-sm">
                <span className="text-palm-700">
                  {i.quantity}× {i.name}
                </span>
                <span className="font-semibold text-palm-900">
                  {rs(i.basePrice * i.quantity)}
                </span>
              </div>
            ))}
            <div className="mt-2 border-t border-palm-100 pt-2">
              <SummaryLine label="Items" value={rs(subtotal)} />
              <SummaryLine label="GST (5%)" value={rs(tax)} />
              <SummaryLine
                label={isPickup ? 'Pickup' : 'Delivery'}
                value={isPickup ? 'Free' : rs(deliveryFee)}
              />
              <div className="mt-2 flex items-center justify-between border-t border-palm-100 pt-2">
                <span className="font-extrabold text-palm-900">Total</span>
                <span className="text-lg font-extrabold text-coral-600">{rs(total)}</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-coral-50 px-3 py-2 text-xs font-semibold text-coral-700">
              {error}
            </p>
          )}
          <p className="mt-3 text-center text-[11px] text-palm-400">
            By placing your order you agree to our Terms & Privacy Policy.
          </p>
        </div>

        <div className="border-t border-palm-100 bg-white px-5 py-4">
          <button onClick={handlePlace} className="btn-primary w-full py-4">
            <Check size={18} /> Place Order — {rs(total)}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-palm-500">
        {label}
      </label>
      <div className="relative mt-1.5">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-3.5 text-palm-400">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  label,
  hint,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition',
        active
          ? 'border-palm-600 bg-palm-50'
          : 'border-palm-200 bg-white hover:border-palm-300',
        disabled && 'opacity-60'
      )}
    >
      <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', active ? 'bg-palm-600 text-white' : 'bg-palm-100 text-palm-600')}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-palm-900">{label}</span>
        <span className="block text-xs text-palm-500">{hint}</span>
      </span>
      {active && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-palm-600 text-white">
          <Check size={14} />
        </span>
      )}
    </button>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5 text-sm">
      <span className="text-palm-600">{label}</span>
      <span className="font-semibold text-palm-900">{value}</span>
    </div>
  );
}
