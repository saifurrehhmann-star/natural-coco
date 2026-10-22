import { Leaf, Truck, ShieldCheck, Heart } from 'lucide-react';
import { CITIES } from '@/data';

const VALUES = [
  { icon: Leaf, title: '100% Natural', text: 'No concentrates, no preservatives — just fresh fruit and coconut.' },
  { icon: Truck, title: 'Nationwide Delivery', text: 'Fresh coconuts shipped to every major city in Pakistan.' },
  { icon: ShieldCheck, title: 'Sourced with Care', text: 'Hand-picked from trusted farms across Sindh and Punjab.' },
  { icon: Heart, title: 'Made Fresh Daily', text: 'Juices cold-pressed every morning in our Karachi kitchen.' },
];

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-palm-50 py-16 sm:py-24">
      <span className="pointer-events-none absolute -left-10 top-10 text-palm-200/50 animate-floatySlow">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7 6 4 11 4 16c0 3 2 5 5 5 4 0 8-5 8-12 0-3-2-6-5-7Z" />
        </svg>
      </span>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-palm-500">
              Our Story
            </p>
            <h2 className="mt-1 text-3xl font-extrabold leading-tight text-palm-900 sm:text-4xl text-balance">
              Nature already makes the perfect drink.
            </h2>
            <p className="mt-4 text-base text-palm-700">
              Natura Coco was born from a simple belief: real, fresh, hydrating goodness
              needs no shortcuts. We source fresh coconuts from farms across Pakistan and
              cold-press natural juices daily in our Karachi kitchen — no concentrates, no
              preservatives, no added nonsense.
            </p>
            <p className="mt-3 text-base text-palm-700">
              From a tender coconut on a Lahore rooftop to a chilled bottle of mango juice
              on a Karachi afternoon, we’re here to keep Pakistan hydrated the natural way.
            </p>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-palm-500">
                Delivering to
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <span
                    key={c.id}
                    className="chip bg-white text-xs text-palm-700 shadow-soft"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="reveal rounded-3xl bg-white p-5 shadow-card"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-palm-100 text-palm-700">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-3 text-base font-extrabold text-palm-900">{v.title}</h3>
                  <p className="mt-1 text-sm text-palm-600">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
