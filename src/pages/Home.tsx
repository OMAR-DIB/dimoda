import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Truck, RefreshCcw, ShieldCheck } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import { selectProducts, selectCatalogStatus } from '../store/catalogSlice'
import { ProductGrid } from '../components/product/ProductGrid'
import { SectionHeading } from '../components/ui/SectionHeading'
import { categoriesByGender } from '../data/categories'
import { site, isWhatsappConfigured } from '../config/site'
import { whatsappLink, buildGeneralMessage } from '../lib/whatsapp'

const HERO_W = 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1400&q=80'
const HERO_M = 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1400&q=80'
const STORY = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80'

export default function Home() {
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectCatalogStatus)
  const loading = status !== 'ready'

  const newIn = [...products]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 8)
  const bestsellers = products.filter((p) => p.tags?.includes('bestseller')).slice(0, 4)
  const sale = products.filter((p) => p.tags?.includes('sale')).slice(0, 4)

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden">
        <div className="container-x grid gap-4 py-4 lg:grid-cols-2 lg:gap-6 lg:py-6">
          <HeroPanel
            img={HERO_W}
            eyebrow="Women"
            title="Soft power, sharp lines."
            cta="Shop women"
            to="/shop/women"
            delay={0}
          />
          <HeroPanel
            img={HERO_M}
            eyebrow="Men"
            title="Quiet luxury, everyday."
            cta="Shop men"
            to="/shop/men"
            delay={120}
          />
        </div>
        <div className="container-x pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center lg:flex">
          <div className="pointer-events-auto flex h-36 w-36 items-center justify-center rounded-full border-[5px] border-gold-500 bg-ivory shadow-soft animate-fadeIn">
            <div className="text-center">
              <svg viewBox="0 0 64 64" className="mx-auto h-9 w-9" aria-hidden="true">
                <path d="M38 14v26.5a8.5 8.5 0 1 1-8.5-8.5H36" fill="none" stroke="#C8911B" strokeWidth="5" strokeLinecap="round" />
                <circle cx="42" cy="12" r="4" fill="#C8911B" />
              </svg>
              <p className="font-brand text-[13px] tracking-[0.16em] text-gold-500">DI MODA</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Trust bar ───── */}
      <section className="container-x mt-6">
        <div className="grid grid-cols-2 gap-px bg-ivory-300 sm:grid-cols-4">
          {[
            { icon: MessageCircle, t: 'Order via WhatsApp', d: 'Chat, confirm, done.' },
            { icon: Truck, t: 'Fast delivery', d: `Free over ${site.freeDeliveryOver} ${site.currency}` },
            { icon: RefreshCcw, t: 'Easy exchanges', d: 'Within 7 days.' },
            { icon: ShieldCheck, t: 'Pay on delivery', d: 'No card needed.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-center gap-3 bg-ivory px-4 py-5">
              <Icon className="h-5 w-5 shrink-0 text-gold-500" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{t}</p>
                <p className="text-xs text-stone">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── New arrivals ───── */}
      <section className="container-x mt-20">
        <SectionHeading
          eyebrow="Just landed"
          title="New arrivals"
          description="Fresh pieces for the season, added weekly."
          link={{ label: 'View all new', to: '/shop?tag=new' }}
        />
        <ProductGrid products={newIn} loading={loading} />
      </section>

      {/* ───── Categories ───── */}
      <section className="container-x mt-24">
        <SectionHeading eyebrow="Browse" title="Shop by category" align="center" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[...categoriesByGender('women').slice(0, 4), ...categoriesByGender('men').slice(0, 4)].map((c, i) => (
            <Link
              key={c.slug}
              to={`/shop/${c.gender}/${c.slug}`}
              className="group relative overflow-hidden animate-fadeUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-ivory">
                <div>
                  <p className="text-[10px] uppercase tracking-luxe text-gold-300">{c.gender}</p>
                  <p className="font-display text-2xl">{c.name}</p>
                </div>
                <ArrowRight className="mb-1 h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── Bestsellers ───── */}
      <section className="container-x mt-24">
        <SectionHeading
          eyebrow="Most loved"
          title="Bestsellers"
          link={{ label: 'Shop all', to: '/shop' }}
        />
        <ProductGrid products={bestsellers} loading={loading} />
      </section>

      {/* ───── Story / WhatsApp CTA ───── */}
      <section className="mt-24 bg-ink text-ivory">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="relative order-2 lg:order-1">
            <img src={STORY} alt="Inside the DI MODA store" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute -bottom-5 -right-3 bg-gold-500 px-5 py-4 text-ink shadow-gold sm:-right-5">
              <p className="font-display text-3xl leading-none">500+</p>
              <p className="text-[10px] uppercase tracking-wide2">pieces in store</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow !text-gold-400">The DI MODA way</p>
            <h2 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">
              Browse online.<br />
              <span className="italic font-normal text-gold-300">Order on WhatsApp.</span>
            </h2>
            <p className="mt-5 max-w-md text-ivory/70">
              Add your favourites to the bag and send your order in one tap. We confirm availability, arrange
              delivery or pickup, and you pay when you receive it. No accounts, no cards, no friction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-gold">
                Start shopping
              </Link>
              {isWhatsappConfigured() && (
                <a href={whatsappLink(buildGeneralMessage())} target="_blank" rel="noreferrer" className="btn border border-ivory/30 text-ivory hover:border-gold-400 hover:text-gold-400">
                  <MessageCircle className="h-4 w-4" /> Ask a question
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Sale ───── */}
      {sale.length > 0 && (
        <section className="container-x mt-24">
          <SectionHeading
            eyebrow="Limited time"
            title="On sale now"
            link={{ label: 'All sale', to: '/shop?tag=sale' }}
          />
          <ProductGrid products={sale} loading={loading} />
        </section>
      )}
    </>
  )
}

function HeroPanel({
  img,
  eyebrow,
  title,
  cta,
  to,
  delay,
}: {
  img: string
  eyebrow: string
  title: string
  cta: string
  to: string
  delay: number
}) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden animate-fadeUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img
        src={img}
        alt={eyebrow}
        className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 sm:aspect-[3/2] lg:aspect-[4/5] xl:aspect-[5/6]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-ivory sm:p-10">
        <p className="text-[11px] font-medium uppercase tracking-luxe text-gold-300">{eyebrow}</p>
        <h1 className="mt-2 max-w-sm text-4xl leading-[1.02] sm:text-5xl lg:text-[56px]">{title}</h1>
        <span className="mt-6 inline-flex items-center gap-2 border-b border-ivory pb-1 text-[12px] font-medium uppercase tracking-wide2 transition-colors group-hover:border-gold-400 group-hover:text-gold-300">
          {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
