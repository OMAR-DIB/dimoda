import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ChevronRight, Heart, MessageCircle, Star, Truck, RefreshCcw, Ruler } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectProducts, selectCatalogStatus } from '../store/catalogSlice'
import { addToCart } from '../store/cartSlice'
import { openCart, pushToast } from '../store/uiSlice'
import { toggleWishlist, selectWishlistIds } from '../store/wishlistSlice'
import { Price } from '../components/ui/Price'
import { Badge } from '../components/ui/Badge'
import { ProductImage } from '../components/ui/ProductImage'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { ProductGrid } from '../components/product/ProductGrid'
import { SectionHeading } from '../components/ui/SectionHeading'
import { categoryName } from '../data/categories'
import { cx, discountPercent, formatPrice } from '../lib/format'
import { site, isWhatsappConfigured } from '../config/site'
import { whatsappLink, buildProductInquiry } from '../lib/whatsapp'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectCatalogStatus)
  const wishlist = useAppSelector(selectWishlistIds)
  const dispatch = useAppDispatch()

  const product = products.find((p) => p.slug === slug)
  const [image, setImage] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState<'details' | 'delivery' | 'sizing'>('details')

  useEffect(() => {
    setImage(0)
    setQty(1)
    setSizeError(false)
    setAdded(false)
    if (product) {
      setSize(product.sizes.length === 1 ? product.sizes[0] : null)
      setColor(product.colors[0]?.name ?? null)
      document.title = `${product.name} — ${site.name}`
    }
    return () => {
      document.title = `${site.name} — Fashion for Women & Men`
    }
  }, [product])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
      .sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1))
      .slice(0, 4)
  }, [products, product])

  if (status !== 'ready') {
    return (
      <div className="container-x grid gap-10 pt-10 lg:grid-cols-2">
        <div className="skeleton aspect-[3/4]" />
        <div className="space-y-4 pt-4">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-10 w-2/3" />
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    )
  }
  if (!product) return <NotFound />

  const wished = wishlist.includes(product.id)
  const off = discountPercent(product.price, product.compareAtPrice)

  const handleAdd = () => {
    if (!size) {
      setSizeError(true)
      return
    }
    dispatch(addToCart({ product, size, color: color ?? 'Default', quantity: qty }))
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
    dispatch(
      pushToast({
        title: 'Added to bag',
        description: `${product.name} · ${size}${color ? ` · ${color}` : ''}`,
        image: product.images[0],
        action: { label: 'Checkout', to: '/checkout' },
      }),
    )
  }
  const handleBuyNow = () => {
    if (!size) {
      setSizeError(true)
      return
    }
    dispatch(addToCart({ product, size, color: color ?? 'Default', quantity: qty }))
    dispatch(openCart())
  }

  return (
    <>
      <div className="container-x pt-5 sm:pt-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-wide2 text-stone-light" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/shop/${product.gender}`} className="capitalize hover:text-ink">{product.gender}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/shop/${product.gender}/${product.category}`} className="hover:text-ink">{categoryName(product.category)}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* gallery */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {product.images.length > 1 && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto sm:w-20 sm:flex-col">
                {product.images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setImage(i)}
                    aria-label={`Image ${i + 1}`}
                    className={cx(
                      'w-16 shrink-0 overflow-hidden border-2 transition sm:w-full',
                      image === i ? 'border-gold-500' : 'border-transparent hover:border-ivory-300',
                    )}
                  >
                    <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex-1 animate-fadeIn" key={image}>
              <ProductImage src={product.images[image]} alt={product.name} eager className="aspect-[3/4] w-full" />
              {product.tags && (
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {product.tags.map((t) => <Badge key={t} tag={t} />)}
                </div>
              )}
              {off > 0 && (
                <span className="absolute right-3 top-3 bg-[#6E1E2B] px-2.5 py-1 text-[11px] font-medium text-ivory">-{off}%</span>
              )}
            </div>
          </div>

          {/* info */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{categoryName(product.category)} · {product.gender}</p>
            <h1 className="mt-2 text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Price price={product.price} compareAt={product.compareAtPrice} size="lg" />
              {product.rating && (
                <span className="flex items-center gap-1.5 text-sm text-stone">
                  <span className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cx('h-3.5 w-3.5', i < Math.round(product.rating!) ? 'fill-current' : 'opacity-30')} />
                    ))}
                  </span>
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              )}
            </div>
            <p className="mt-5 leading-relaxed text-stone">{product.description}</p>

            <div className="hairline my-7" />

            {/* color */}
            {product.colors.length > 0 && (
              <div>
                <p className="label">
                  Colour: <span className="normal-case tracking-normal text-ink">{color}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={color === c.name}
                      onClick={() => setColor(c.name)}
                      className={cx(
                        'relative h-9 w-9 rounded-full ring-1 ring-ivory-300 ring-offset-2 ring-offset-ivory transition',
                        color === c.name && 'ring-2 ring-ink',
                      )}
                      style={{ backgroundColor: c.hex }}
                    >
                      {color === c.name && (
                        <Check className={cx('absolute inset-0 m-auto h-4 w-4', ['#F6F5F1', '#EDE8DC', '#C9C2B4', '#E8C4C4', '#A9C7E6'].includes(c.hex) ? 'text-ink' : 'text-ivory')} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* size */}
            <div className="mt-6">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="label !mb-0">
                  Size{size && <>: <span className="normal-case tracking-normal text-ink">{size}</span></>}
                </p>
                <button onClick={() => setTab('sizing')} className="flex items-center gap-1 text-[11px] uppercase tracking-wide2 text-stone hover:text-ink">
                  <Ruler className="h-3.5 w-3.5" /> Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSize(s); setSizeError(false) }}
                    aria-pressed={size === s}
                    className={cx(
                      'min-w-[52px] border px-3 py-2.5 text-sm transition',
                      size === s ? 'border-ink bg-ink text-ivory' : 'border-ivory-300 hover:border-ink',
                      sizeError && !size && 'border-[#B3261E]',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <p className="mt-2 text-xs text-[#B3261E]">Please select a size.</p>}
            </div>

            {/* actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <QuantityStepper value={qty} onChange={setQty} className="self-start" />
              <button
                onClick={handleAdd}
                className={cx('btn-primary flex-1', added && '!bg-gold-500 !text-ink')}
              >
                {added ? (<><Check className="h-4 w-4" /> Added</>) : 'Add to bag'}
              </button>
              <button
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => dispatch(toggleWishlist(product.id))}
                className={cx('btn-outline !px-4', wished && 'border-gold-500 text-gold-600')}
              >
                <Heart className={cx('h-4 w-4', wished && 'fill-current')} />
              </button>
            </div>
            <button onClick={handleBuyNow} className="btn-gold mt-3 w-full">
              Buy now via WhatsApp
            </button>
            {isWhatsappConfigured() && (
              <a
                href={whatsappLink(buildProductInquiry(product, size ?? undefined, color ?? undefined))}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-wide2 text-stone hover:text-[#1EBE5A]"
              >
                <MessageCircle className="h-4 w-4" /> Ask about this item
              </a>
            )}

            <div className="mt-7 grid grid-cols-2 gap-3 text-xs text-stone">
              <div className="flex items-start gap-2">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>Free delivery over {formatPrice(site.freeDeliveryOver)}. Pay on delivery.</span>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>Exchange within 7 days in original condition.</span>
              </div>
            </div>

            {/* tabs */}
            <div className="mt-8 border-t border-ivory-300">
              <div className="flex gap-6">
                {(['details', 'delivery', 'sizing'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cx(
                      'border-t-2 py-3 text-[11px] font-medium uppercase tracking-wide2 transition',
                      tab === t ? 'border-gold-500 text-ink' : 'border-transparent text-stone hover:text-ink',
                    )}
                  >
                    {t === 'details' ? 'Details' : t === 'delivery' ? 'Delivery & returns' : 'Size guide'}
                  </button>
                ))}
              </div>
              <div className="pb-2 text-sm leading-relaxed text-stone animate-fadeIn" key={tab}>
                {tab === 'details' && (
                  <ul className="list-disc space-y-1 pl-5">
                    {(product.details ?? []).map((d) => <li key={d}>{d}</li>)}
                  </ul>
                )}
                {tab === 'delivery' && (
                  <p>
                    We deliver within 1–3 business days. Delivery fee is {formatPrice(site.deliveryFee)}, free for orders over{' '}
                    {formatPrice(site.freeDeliveryOver)}. Store pickup is always free. Exchanges are accepted within 7 days
                    with tags attached.
                  </p>
                )}
                {tab === 'sizing' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase tracking-wide2 text-stone-light">
                        <tr><th className="py-1.5 pr-4">Size</th><th className="pr-4">Chest / Bust</th><th className="pr-4">Waist</th><th>Hips</th></tr>
                      </thead>
                      <tbody className="divide-y divide-ivory-300">
                        {[['XS','80–84','62–66','86–90'],['S','84–88','66–70','90–94'],['M','88–94','70–76','94–100'],['L','94–100','76–82','100–106'],['XL','100–108','82–90','106–114']].map((r) => (
                          <tr key={r[0]}>{r.map((c, i) => <td key={i} className={cx('py-1.5 pr-4', i === 0 && 'font-medium text-ink')}>{c}{i > 0 && ' cm'}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-2 text-xs">Not sure? Message us on WhatsApp with your height and usual size, we will help.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x mt-24">
          <SectionHeading eyebrow="Complete the look" title="You may also like" link={{ label: `More ${product.gender}`, to: `/shop/${product.gender}` }} />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  )
}
