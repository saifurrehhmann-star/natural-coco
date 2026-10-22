import { Leaf, Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, MapPin } from 'lucide-react';
import { BRAND, NAV_LINKS, CITIES } from '@/data';

export function Footer() {
  return (
    <footer id="contact" className="bg-palm-900 text-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-palm-600 text-white">
                <Leaf size={20} />
              </span>
              <span className="font-display text-lg font-extrabold text-cream-50">
                Natura Coco
              </span>
            </div>
            <p className="mt-3 text-sm text-cream-200/80">{BRAND.about}</p>
            <div className="mt-4 flex gap-2">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-palm-800 text-cream-200 transition hover:bg-palm-700 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cream-300">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream-200/80 transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li><a href="#" className="text-cream-200/80 transition hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-cream-200/80 transition hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cream-300">
              Get in Touch
            </h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 text-cream-200/80 transition hover:text-white">
                  <Phone size={16} className="text-cream-300" /> {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cream-200/80 transition hover:text-white">
                  <MessageCircle size={16} className="text-cream-300" /> WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 text-cream-200/80 transition hover:text-white">
                  <Mail size={16} className="text-cream-300" /> {BRAND.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-cream-200/80">
                <MapPin size={16} className="text-cream-300" /> Karachi, Pakistan
              </li>
            </ul>
          </div>

          {/* delivery cities */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-cream-300">
              We Deliver To
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {CITIES.map((c) => (
                <span
                  key={c.id}
                  className="chip bg-palm-800 text-[11px] text-cream-200/80"
                >
                  {c.name}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-cream-300/60">
              Fresh coconuts ship nationwide. Juices & bottled drinks available in Karachi.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-palm-800 pt-6 text-xs text-cream-300/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Natura Coco. All rights reserved.</p>
          <p>Made with care in Pakistan · Fresh · Natural · No preservatives</p>
        </div>
      </div>
    </footer>
  );
}
