import { useEffect, useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Store,
  Truck,
  Phone,
  Check,
  X,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import type { FulfillmentMode, LocationState } from '@/types';
import { CITIES, PICKUP_LOCATIONS } from '@/data';
import { FULFILLMENT_MODES } from '@/state';
import { cn } from '@/utils/cn';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (next: Partial<LocationState>) => void;
  initial: LocationState;
  forceOpen?: boolean;
}

type GeoStatus = 'idle' | 'loading' | 'denied' | 'unavailable';

export function LocationSelector({ open, onClose, onSave, initial, forceOpen }: Props) {
  const [mode, setMode] = useState<FulfillmentMode>(initial.mode);
  const [cityId, setCityId] = useState<string>(initial.cityId ?? '');
  const [pickupId, setPickupId] = useState<string>(
    initial.pickupId ?? PICKUP_LOCATIONS[0]?.id ?? ''
  );
  const [phone, setPhone] = useState(initial.phone);
  const [geo, setGeo] = useState<GeoStatus>('idle');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initial.mode);
      setCityId(initial.cityId ?? '');
      setPickupId(initial.pickupId ?? PICKUP_LOCATIONS[0]?.id ?? '');
      setPhone(initial.phone);
      setGeo('idle');
      setTouched(false);
    }
  }, [open, initial]);

  if (!open) return null;

  const useMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeo('unavailable');
      return;
    }
    setGeo('loading');
    navigator.geolocation.getCurrentPosition(
      () => {
        setGeo('idle');
        setCityId('karachi');
        setMode('delivery');
      },
      () => setGeo('denied'),
      { timeout: 8000 }
    );
  };

  const canSave =
    mode === 'pickup' ? !!pickupId : !!cityId;

  const handleSave = () => {
    setTouched(true);
    if (!canSave) return;
    onSave({ mode, cityId: mode === 'delivery' ? (cityId as LocationState['cityId']) : null, pickupId: mode === 'pickup' ? pickupId : null, phone });
    onClose();
  };

  const geoBanner = () => {
    if (geo === 'denied')
      return { tone: 'warn', text: 'Location permission denied — pick your city manually below.' };
    if (geo === 'unavailable')
      return { tone: 'warn', text: 'Location not available on this device — pick your city below.' };
    if (mode === 'delivery' && !cityId && touched)
      return { tone: 'warn', text: 'Please select your delivery city to continue.' };
    return null;
  };
  const banner = geoBanner();

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-palm-950/50 backdrop-blur-sm animate-fadeIn"
        onClick={forceOpen ? undefined : onClose}
      />
      <div className="relative w-full sm:max-w-md bg-cream-50 rounded-t-4xl sm:rounded-4xl shadow-lift animate-sheetUp sm:animate-popIn max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <span className="h-1.5 w-12 rounded-full bg-palm-200" />
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-start justify-between pt-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-palm-500">
                Delivery Location
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-palm-900">
                Select Your Area
              </h2>
            </div>
            {!forceOpen && (
              <button
                onClick={onClose}
                className="rounded-full p-2 text-palm-500 hover:bg-palm-100 active:scale-90 transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* mode toggle */}
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-palm-100 p-1">
            {FULFILLMENT_MODES.map((m) => {
              const Icon = m.id === 'delivery' ? Truck : Store;
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl py-2.5 text-sm font-semibold transition-all',
                    active
                      ? 'bg-white text-palm-900 shadow-soft'
                      : 'text-palm-600 hover:text-palm-800'
                  )}
                >
                  <Icon size={18} />
                  <span>{m.label}</span>
                  <span className={cn('text-[11px] font-normal', active ? 'text-palm-500' : 'text-palm-400')}>
                    {m.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {/* use my location */}
          {mode === 'delivery' && (
            <button
              onClick={useMyLocation}
              disabled={geo === 'loading'}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-palm-300 bg-white py-3 text-sm font-semibold text-palm-800 transition hover:border-palm-500 active:scale-95 disabled:opacity-60"
            >
              <Navigation size={16} className={geo === 'loading' ? 'animate-spin' : ''} />
              {geo === 'loading' ? 'Detecting…' : 'Use My Location'}
            </button>
          )}

          {banner && (
            <div
              className={cn(
                'mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium',
                banner.tone === 'warn'
                  ? 'bg-coral-50 text-coral-700'
                  : 'bg-palm-50 text-palm-700'
              )}
            >
              <AlertCircle size={15} className="shrink-0" />
              {banner.text}
            </div>
          )}

          {mode === 'delivery' ? (
            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-palm-500">
                City
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-palm-400"
                />
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className={cn(
                    'w-full appearance-none rounded-2xl border bg-white py-3.5 pl-10 pr-10 text-sm font-medium text-palm-900 outline-none transition focus:border-palm-500',
                    touched && !cityId ? 'border-coral-400' : 'border-palm-200'
                  )}
                >
                  <option value="">Select your city</option>
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.province}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-palm-400"
                />
              </div>
              {cityId && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-palm-600">
                  <Truck size={14} /> Delivery fee{' '}
                  {CITIES.find((c) => c.id === cityId)?.deliveryFee} · ETA{' '}
                  {CITIES.find((c) => c.id === cityId)?.deliveryEta}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-palm-500">
                Pickup Location
              </label>
              {PICKUP_LOCATIONS.map((p) => {
                const active = pickupId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPickupId(p.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition',
                      active
                        ? 'border-palm-500 bg-palm-50'
                        : 'border-palm-200 bg-white hover:border-palm-300'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition',
                        active ? 'border-palm-600 bg-palm-600 text-white' : 'border-palm-300'
                      )}
                    >
                      {active && <Check size={14} />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-palm-900">{p.name}</span>
                      <span className="mt-0.5 block text-xs text-palm-600">{p.address}</span>
                      <span className="mt-1.5 flex flex-wrap gap-2 text-[11px] font-medium text-palm-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {p.hours}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Store size={12} /> Ready in {p.readyIn}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
              <a
                href={PICKUP_LOCATIONS[0]?.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-palm-600 underline underline-offset-2"
              >
                <MapPin size={13} /> Open in Maps
              </a>
            </div>
          )}

          {/* phone */}
          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-palm-500">
              Phone Number
            </label>
            <div className="relative mt-1.5">
              <Phone
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-palm-400"
              />
              <input
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX XXX XXXX"
                className="w-full rounded-2xl border border-palm-200 bg-white py-3.5 pl-10 pr-3 text-sm font-medium text-palm-900 outline-none transition focus:border-palm-500"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-coral-500 py-4 text-base font-bold text-white shadow-soft transition hover:bg-coral-600 active:scale-95 disabled:opacity-50"
          >
            Save Location
          </button>
        </div>

        {/* footer strip */}
        <div className="flex items-center justify-between rounded-b-4xl sm:rounded-b-4xl bg-palm-900 px-5 py-3 text-xs font-semibold text-cream-100">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-cream-300" /> Open 24/7
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} className="text-cream-300" />
            {mode === 'pickup'
              ? `Ready in ${PICKUP_LOCATIONS[0]?.readyIn}`
              : cityId
                ? CITIES.find((c) => c.id === cityId)?.deliveryEta
                : '30 min – 4 days'}
          </span>
        </div>
      </div>
    </div>
  );
}
