import { Info, X, Store } from 'lucide-react';
import type { LocationState } from '@/types';
import { isKarachiCatalog } from '@/state';

interface Props {
  location: LocationState;
  onOpenLocation: () => void;
  dismissed: boolean;
  onDismiss: () => void;
}

export function CityBanner({ location, onOpenLocation, dismissed, onDismiss }: Props) {
  if (dismissed) return null;
  const karachi = isKarachiCatalog(location);
  if (karachi) return null;

  return (
    <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
      <div className="reveal is-visible flex items-center gap-3 rounded-2xl border border-cream-300 bg-cream-100 px-4 py-3 text-sm text-palm-800">
        <Info size={18} className="shrink-0 text-cream-700" />
        <p className="flex-1">
          You’re outside Karachi — fresh coconuts ship nationwide, but juices, bottled
          drinks and bundles are <span className="font-semibold">Karachi-exclusive</span>.
          <button onClick={onOpenLocation} className="ml-1 font-semibold text-palm-700 underline underline-offset-2">
            Change city
          </button>
        </p>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-full p-1 text-palm-500 hover:bg-palm-100"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function PickupBanner({ location, onOpenLocation }: { location: LocationState; onOpenLocation: () => void }) {
  if (location.mode !== 'pickup') return null;
  return (
    <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
      <div className="flex items-center gap-3 rounded-2xl border border-palm-200 bg-palm-50 px-4 py-3 text-sm text-palm-800">
        <Store size={18} className="shrink-0 text-palm-600" />
        <p className="flex-1">
          Pickup selected — full Karachi catalog available for collection at our store.
          <button onClick={onOpenLocation} className="ml-1 font-semibold text-palm-700 underline underline-offset-2">
            View store
          </button>
        </p>
      </div>
    </div>
  );
}
