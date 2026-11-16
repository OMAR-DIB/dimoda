import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { site, isWhatsappConfigured } from '../../config/site'
import { whatsappLink, buildGeneralMessage } from '../../lib/whatsapp'
import { categoriesByGender } from '../../data/categories'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5H16l.4-3H13.5V8.3c0-.9.3-1.5 1.6-1.5H16.5V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10.5H8v3h2.3V21h3.2z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ivory">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tone="ivory" />
          <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-ivory/70">{site.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-ivory/20 p-2.5 transition hover:border-gold-400 hover:text-gold-400">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-ivory/20 p-2.5 transition hover:border-gold-400 hover:text-gold-400">
              <FacebookIcon className="h-4 w-4" />
            </a>
            {isWhatsappConfigured() && (
              <a href={whatsappLink(buildGeneralMessage())} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full border border-ivory/20 p-2.5 transition hover:border-gold-400 hover:text-gold-400">
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-gold-400">Women</p>
          <ul className="space-y-2 text-sm text-ivory/70">
            {categoriesByGender('women').slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/shop/women/${c.slug}`} className="hover:text-ivory">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-gold-400">Men</p>
          <ul className="space-y-2 text-sm text-ivory/70">
            {categoriesByGender('men').slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/shop/men/${c.slug}`} className="hover:text-ivory">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-gold-400">Help</p>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/about" className="hover:text-ivory">About us</Link></li>
            <li><Link to="/about#delivery" className="hover:text-ivory">Delivery & returns</Link></li>
            <li><Link to="/about#sizing" className="hover:text-ivory">Size guide</Link></li>
            <li><Link to="/wishlist" className="hover:text-ivory">Wishlist</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-gold-400">Visit</p>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {site.address}</li>
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-[11px] uppercase tracking-wide2 text-ivory/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>Orders fulfilled via WhatsApp</span>
        </div>
      </div>
    </footer>
  )
}
