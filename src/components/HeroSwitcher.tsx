import { LayoutGrid, Rows3, GalleryHorizontalEnd } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  variant: 'full' | 'split' | 'cards';
  onChange: (v: 'full' | 'split' | 'cards') => void;
}

const OPTIONS = [
  { id: 'full' as const, label: 'Full-bleed', icon: GalleryHorizontalEnd },
  { id: 'split' as const, label: 'Split', icon: Rows3 },
  { id: 'cards' as const, label: 'Cards', icon: LayoutGrid },
];

export function HeroSwitcher({ variant, onChange }: Props) {
  return (
    <div className="mx-auto mt-3 flex max-w-6xl items-center justify-center px-4 sm:px-6">
      <div className="inline-flex items-center gap-1 rounded-full border border-palm-200 bg-white/80 p-1 shadow-soft backdrop-blur">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          const active = variant === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                active
                  ? 'bg-palm-600 text-white'
                  : 'text-palm-600 hover:text-palm-800'
              )}
              aria-pressed={active}
              title={`${o.label} hero`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
