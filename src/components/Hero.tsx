import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '@/data';
import type { HeroSlide } from '@/types';
import { cn } from '@/utils/cn';

interface Props {
  variant: 'full' | 'split' | 'cards';
  slides?: HeroSlide[];
  onCta: () => void;
}

const toneBg: Record<HeroSlide['tone'], string> = {
  palm: 'from-palm-800 to-palm-600',
  cream: 'from-cream-200 to-cream-100',
  coral: 'from-coral-500 to-coral-400',
};
const toneText: Record<HeroSlide['tone'], string> = {
  palm: 'text-cream-50',
  cream: 'text-palm-900',
  coral: 'text-white',
};
const toneEyebrow: Record<HeroSlide['tone'], string> = {
  palm: 'text-cream-200',
  cream: 'text-palm-600',
  coral: 'text-white/90',
};

export function Hero({ variant, slides: propSlides, onCta }: Props) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slides = propSlides && propSlides.length > 0 ? propSlides : HERO_SLIDES;
  const count = slides.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  useEffect(() => {
    if (variant === 'cards') return; // cards scroll manually
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => window.clearInterval(id);
  }, [variant, count]);

  useEffect(() => {
    const onScroll = () => {
      if (!trackRef.current) return;
      const y = window.scrollY;
      if (y < 700) trackRef.current.style.setProperty('--drift', `${y * 0.12}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setDragX(e.touches[0].clientX - touchStartX.current);
  };
  const onTouchEnd = () => {
    if (Math.abs(dragX) > 50) go(dragX > 0 ? -1 : 1);
    setDragX(0);
    touchStartX.current = null;
  };

  if (variant === 'cards') return <CardHero onCta={onCta} />;

  return (
    <section id="home" className="relative pt-16">
      {/* floating decorative leaves */}
      <span className="pointer-events-none absolute left-4 top-24 z-10 hidden text-palm-300/40 animate-floaty sm:block">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7 6 4 11 4 16c0 3 2 5 5 5 4 0 8-5 8-12 0-3-2-6-5-7Z" />
        </svg>
      </span>
      <span className="pointer-events-none absolute right-6 top-40 z-10 hidden text-cream-300/40 animate-floatySlow sm:block">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7 6 4 11 4 16c0 3 2 5 5 5 4 0 8-5 8-12 0-3-2-6-5-7Z" />
        </svg>
      </span>

      <div
        ref={trackRef}
        className="relative mx-auto max-w-6xl px-4 sm:px-6"
        style={{ ['--drift' as string]: '0px' }}
      >
        <div
          className="relative overflow-hidden rounded-4xl sm:rounded-5xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
            }}
          >
            {slides.map((s, i) => (
              <div key={s.id} className="w-full shrink-0">
                {variant === 'full' ? (
                  <FullSlide slide={s} active={i === index} onCta={onCta} />
                ) : (
                  <SplitSlide slide={s} active={i === index} onCta={onCta} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-palm-800 shadow-soft backdrop-blur transition hover:bg-white sm:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-palm-800 shadow-soft backdrop-blur transition hover:bg-white sm:flex"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* indicators */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === index ? 'w-7 bg-palm-600' : 'w-2 bg-palm-300'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FullSlide({
  slide,
  active,
  onCta,
}: {
  slide: HeroSlide;
  active: boolean;
  onCta: () => void;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[58vh] items-end overflow-hidden bg-gradient-to-br sm:min-h-[64vh]',
        toneBg[slide.tone]
      )}
    >
      <img
        src={slide.image}
        alt={slide.title}
        loading="eager"
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out',
          active ? 'scale-105' : 'scale-100'
        )}
        style={{ transform: `translateY(var(--drift)) scale(${active ? 1.05 : 1})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="relative z-10 w-full p-5 sm:p-10">
        <div className={cn('max-w-xl', toneText[slide.tone])}>
          <span
            className={cn(
              'chip bg-white/20 text-[11px] uppercase tracking-wider backdrop-blur',
              toneEyebrow[slide.tone]
            )}
          >
            {slide.eyebrow}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-[1.1] text-balance sm:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-2 max-w-md text-sm opacity-90 sm:text-lg">{slide.subtitle}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-lg font-extrabold text-palm-900 shadow-soft">
              {slide.price}
            </span>
            <button
              onClick={onCta}
              className="btn-primary"
            >
              {slide.cta} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SplitSlide({
  slide,
  active,
  onCta,
}: {
  slide: HeroSlide;
  active: boolean;
  onCta: () => void;
}) {
  const imageFirst = slide.align === 'left';
  return (
    <div
      className={cn(
        'grid min-h-[58vh] grid-cols-1 overflow-hidden bg-gradient-to-br sm:grid-cols-2 sm:min-h-[60vh]',
        toneBg[slide.tone]
      )}
    >
      <div
        className={cn(
          'relative order-2 flex items-center justify-center p-6 sm:p-10',
          imageFirst ? 'sm:order-1' : 'sm:order-2'
        )}
      >
        <img
          src={slide.image}
          alt={slide.title}
          loading="eager"
          className={cn(
            'h-56 w-full rounded-3xl object-cover shadow-lift transition-transform duration-700 ease-out sm:h-[26rem]',
            active ? 'scale-100' : 'scale-95'
          )}
          style={{ transform: `translateY(var(--drift))` }}
        />
      </div>
      <div
        className={cn(
          'relative order-1 flex flex-col justify-center p-6 sm:p-12',
          imageFirst ? 'sm:order-2' : 'sm:order-1',
          toneText[slide.tone]
        )}
      >
        <span
          className={cn(
            'chip w-fit bg-white/20 text-[11px] uppercase tracking-wider backdrop-blur',
            toneEyebrow[slide.tone]
          )}
        >
          {slide.eyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.1] text-balance sm:text-4xl">
          {slide.title}
        </h1>
        <p className="mt-2 max-w-md text-sm opacity-90 sm:text-base">{slide.subtitle}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/95 px-4 py-1.5 text-lg font-extrabold text-palm-900 shadow-soft">
            {slide.price}
          </span>
          <button onClick={onCta} className="btn-primary">
            {slide.cta} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CardHero({ onCta }: { onCta: () => void }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollByCard = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const w = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };
  return (
    <section id="home" className="relative pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-palm-500">
              Today’s Offers
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-palm-900 sm:text-3xl">
              Swipe to explore deals
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scrollByCard(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-palm-200 bg-white text-palm-700 hover:border-palm-400"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-palm-200 bg-white text-palm-700 hover:border-palm-400"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 no-scrollbar sm:px-6"
      >
        {HERO_SLIDES.map((s) => (
          <article
            key={s.id}
            data-card
            className="snap-start shrink-0 w-[80vw] max-w-sm overflow-hidden rounded-3xl bg-white shadow-card sm:w-[22rem]"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 chip bg-white/90 text-[10px] uppercase tracking-wider text-palm-700">
                {s.eyebrow}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-extrabold leading-tight text-palm-900">{s.title}</h3>
              <p className="mt-1 text-sm text-palm-600">{s.subtitle}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-extrabold text-coral-600">{s.price}</span>
                <button onClick={onCta} className="btn-primary px-4 py-2 text-sm">
                  {s.cta}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
