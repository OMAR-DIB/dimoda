import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { site, isWhatsappConfigured } from '../config/site'
import { whatsappLink, buildGeneralMessage } from '../lib/whatsapp'
import { formatPrice } from '../lib/format'

const IMG_1 = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=80'
const IMG_2 = 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80'

export default function About() {
  return (
    <div className="container-x pt-10 sm:pt-16">
      <div className="mx-auto max-w-3xl text-center animate-fadeUp">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-3 text-5xl leading-[1.02] sm:text-6xl">Dressing people, <span className="italic font-normal text-gold-600">not trends.</span></h1>
        <p className="mt-6 text-lg text-stone">
          {site.name} started as a single store with a simple idea: clothes should make you feel like the best version of
          yourself. Today we carry hundreds of carefully chosen pieces for women and men, and we still know most of our
          customers by name.
        </p>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        <img src={IMG_1} alt="Inside the store" className="aspect-[4/5] w-full object-cover" loading="lazy" />
        <img src={IMG_2} alt="Our collection" className="aspect-[4/5] w-full object-cover sm:mt-16" loading="lazy" />
      </div>

      <section id="delivery" className="mt-24 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Delivery & returns</p>
          <h2 className="mt-3 text-4xl">Simple, honest, fast.</h2>
        </div>
        <div className="space-y-5 text-stone">
          <p><span className="font-medium text-ink">Ordering.</span> Build your bag, press checkout, and your order opens in WhatsApp. We confirm availability within minutes during store hours.</p>
          <p><span className="font-medium text-ink">Delivery.</span> {formatPrice(site.deliveryFee)} per order, free over {formatPrice(site.freeDeliveryOver)}. Typically 1–3 business days. Store pickup is always free.</p>
          <p><span className="font-medium text-ink">Payment.</span> Cash on delivery or at pickup. No card needed.</p>
          <p><span className="font-medium text-ink">Exchanges.</span> Within 7 days, unworn, with tags attached. Message us on WhatsApp to arrange.</p>
        </div>
      </section>

      <section id="sizing" className="mt-24 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Size guide</p>
          <h2 className="mt-3 text-4xl">Find your fit.</h2>
          <p className="mt-3 text-stone">Measurements in centimetres. Between sizes? Message us, we will advise per item.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] uppercase tracking-wide2 text-stone-light">
              <tr><th className="py-2 pr-4">Size</th><th className="pr-4">Chest / Bust</th><th className="pr-4">Waist</th><th>Hips</th></tr>
            </thead>
            <tbody className="divide-y divide-ivory-300">
              {[['XS','80–84','62–66','86–90'],['S','84–88','66–70','90–94'],['M','88–94','70–76','94–100'],['L','94–100','76–82','100–106'],['XL','100–108','82–90','106–114'],['XXL','108–116','90–98','114–122']].map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i} className={i === 0 ? 'py-2 pr-4 font-medium' : 'py-2 pr-4 text-stone'}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-24 bg-ink p-8 text-ivory sm:p-12">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
          <div className="lg:col-span-2">
            <p className="eyebrow !text-gold-400">Visit us</p>
            <h2 className="mt-3 text-4xl">Come say hello.</h2>
            <div className="mt-5 flex flex-col gap-2 text-ivory/70">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-400" /> {site.address}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold-400" /> {site.hours}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/shop" className="btn-gold">Shop the collection</Link>
            {isWhatsappConfigured() && (
              <a href={whatsappLink(buildGeneralMessage())} target="_blank" rel="noreferrer" className="btn border border-ivory/30 text-ivory hover:border-gold-400 hover:text-gold-400">
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
