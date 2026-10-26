import { useEffect, useState } from 'react';
import { Menu, X, ShoppingCart, MapPin, ChevronDown, Leaf, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import { NAV_LINKS } from '@/data';
import type { Customer, LocationState } from '@/types';
import { activeCityName, getEta } from '@/state';
import { cn } from '@/utils/cn';

interface Props {
  location: LocationState;
  cartCount: number;
  isAdminLoggedIn?: boolean;
  customerUser?: Customer | null;
  onOpenLocation: () => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onLogoutAdmin?: () => void;
  onLogoutCustomer?: () => void;
}

export function Header({
  location,
  cartCount,
  isAdminLoggedIn = false,
  customerUser = null,
  onOpenLocation,
  onOpenCart,
  onOpenAdmin,
  onOpenAuth,
  onLogoutAdmin,
  onLogoutCustomer,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cityName = activeCityName(location);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-soft' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* logo */}
        <a href="#home" className="flex items-center gap-2 hide-tap-highlight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-palm-600 text-white shadow-soft">
            <Leaf size={20} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold text-palm-900">
              Natura <span className="text-palm-600">Coco</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-palm-500">
              Fresh · Natural
            </span>
          </span>
        </a>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-palm-800 transition hover:bg-palm-100 hover:text-palm-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* right cluster */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLocation}
            className="group flex items-center gap-1.5 rounded-full border border-palm-200 bg-white/80 px-3 py-2 text-xs font-semibold text-palm-800 transition hover:border-palm-400 active:scale-95"
          >
            <MapPin size={15} className="text-coral-500" />
            <span className="hidden sm:inline">Delivering to:</span>
            <span className="max-w-[7rem] truncate sm:max-w-none">
              {cityName ?? 'Select'}
            </span>
            <ChevronDown size={14} className="text-palm-400 transition group-hover:translate-y-0.5" />
          </button>

          {/* Authentication / Admin / Customer Buttons */}
          {isAdminLoggedIn ? (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 rounded-full border border-palm-300 bg-palm-100/90 px-3 py-2 text-xs font-bold text-palm-900 shadow-soft transition hover:bg-palm-200 active:scale-95"
              title="Open Admin Dashboard"
            >
              <ShieldCheck size={15} className="text-palm-700" />
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          ) : customerUser ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-full border border-palm-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-palm-900 shadow-soft transition hover:border-palm-300 hover:bg-palm-50 active:scale-95"
              title={`Logged in as ${customerUser.name} (${customerUser.email || customerUser.phone})`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-[11px] text-white font-black shadow-xs">
                {customerUser.name.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[5.5rem] sm:max-w-[7.5rem] truncate font-extrabold text-palm-900">
                {customerUser.name.split(' ')[0]}
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-full border border-palm-200 bg-white/90 px-3 py-2 text-xs font-bold text-palm-800 shadow-soft transition hover:border-palm-300 hover:bg-palm-50 active:scale-95"
              title="Sign In"
            >
              <LogIn size={15} className="text-coral-500" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-palm-600 text-white shadow-soft transition hover:bg-palm-700 active:scale-90"
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-coral-500 px-1 text-[11px] font-bold text-white ring-2 ring-cream-50 animate-popIn">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-palm-200 bg-white/80 text-palm-800 md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-palm-100 animate-slideDown">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-palm-800 hover:bg-palm-100"
              >
                {l.label}
              </a>
            ))}
            {isAdminLoggedIn ? (
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center justify-between rounded-xl bg-palm-100 px-3 py-3 text-sm font-bold text-palm-900 shadow-soft"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-palm-700" />
                    <span>Admin Dashboard</span>
                  </span>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </button>

                {onLogoutAdmin && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogoutAdmin();
                    }}
                    className="flex items-center justify-between rounded-xl bg-coral-50 px-3 py-2.5 text-xs font-bold text-coral-700 hover:bg-coral-100"
                  >
                    <span>Sign Out of Admin</span>
                    <LogOut size={16} />
                  </button>
                )}
              </div>
            ) : customerUser ? (
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="flex items-center justify-between rounded-xl bg-palm-100 px-3 py-3 text-sm font-bold text-palm-900 shadow-soft"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-xs text-white font-extrabold">
                      {customerUser.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{customerUser.name} (Account)</span>
                  </span>
                  <span className="text-xs text-palm-500">View</span>
                </button>
                {onLogoutCustomer && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogoutCustomer();
                    }}
                    className="flex items-center justify-between rounded-xl bg-coral-50 px-3 py-2.5 text-xs font-bold text-coral-700 hover:bg-coral-100"
                  >
                    <span>Sign Out</span>
                    <LogOut size={16} />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAuth();
                }}
                className="flex items-center justify-between rounded-xl bg-palm-800 text-cream-50 px-3 py-3 text-sm font-bold shadow-soft"
              >
                <span className="flex items-center gap-2">
                  <LogIn size={18} className="text-cream-300" />
                  <span>Sign In</span>
                </span>
                <span className="text-xs text-cream-300">→</span>
              </button>
            )}
            <div className="mt-1 flex items-center justify-between rounded-xl bg-palm-50 px-3 py-2.5 text-xs text-palm-600">
              <span>Estimated {location.mode === 'pickup' ? 'pickup' : 'delivery'} time</span>
              <span className="font-bold text-palm-800">{getEta(location)}</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
