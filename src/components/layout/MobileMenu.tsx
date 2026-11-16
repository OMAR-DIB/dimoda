import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Heart, MessageCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleMenu } from '../../store/uiSlice'
import { categoriesByGender } from '../../data/categories'
import { cx } from '../../lib/format'
import { whatsappLink, buildGeneralMessage } from '../../lib/whatsapp'
import { isWhatsappConfigured } from '../../config/site'

export function MobileMenu() {
  const open = useAppSelector((s) => s.ui.menuOpen)
  const dispatch = useAppDispatch()
  const [expanded, setExpanded] = useState<'women' | 'men' | null>('women')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null
  const close = () => dispatch(toggleMenu(false))

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-[55] overflow-y-auto bg-ivory lg:hidden animate-fadeIn">
      <div className="container-x py-6">
        {(['women', 'men'] as const).map((g) => (
          <div key={g} className="border-b border-ivory-300">
            <button
              className="flex w-full items-center justify-between py-4 text-left font-display text-2xl capitalize"
              onClick={() => setExpanded(expanded === g ? null : g)}
            >
              {g}
              <ChevronDown className={cx('h-5 w-5 transition-transform', expanded === g && 'rotate-180')} />
            </button>
            {expanded === g && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 pb-4 animate-fadeIn">
                <li className="col-span-2">
                  <Link to={`/shop/${g}`} onClick={close} className="text-sm font-medium">
                    View all {g}
                  </Link>
                </li>
                {categoriesByGender(g).map((c) => (
                  <li key={c.slug}>
                    <Link to={`/shop/${g}/${c.slug}`} onClick={close} className="text-sm text-stone">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <Link to="/shop?tag=new" onClick={close} className="block border-b border-ivory-300 py-4 font-display text-2xl">
          New In
        </Link>
        <Link to="/shop?tag=sale" onClick={close} className="block border-b border-ivory-300 py-4 font-display text-2xl text-[#6E1E2B]">
          Sale
        </Link>
        <Link to="/about" onClick={close} className="block border-b border-ivory-300 py-4 font-display text-2xl">
          About
        </Link>

        <div className="mt-6 flex flex-col gap-3">
          <Link to="/wishlist" onClick={close} className="btn-outline">
            <Heart className="h-4 w-4" /> Wishlist
          </Link>
          {isWhatsappConfigured() && (
            <a href={whatsappLink(buildGeneralMessage())} target="_blank" rel="noreferrer" className="btn-whatsapp">
              <MessageCircle className="h-4 w-4" /> Chat with us
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
