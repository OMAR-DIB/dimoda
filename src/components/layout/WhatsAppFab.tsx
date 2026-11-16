import { useLocation } from 'react-router-dom'
import { isWhatsappConfigured } from '../../config/site'
import { whatsappLink, buildGeneralMessage } from '../../lib/whatsapp'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.6 28.4 13.7 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1.1 1.1-3.9-.3-.4A10.5 10.5 0 0 1 5.4 16C5.4 10.2 10.2 5.4 16 5.4S26.6 10.2 26.6 16 21.8 26.6 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.4c.2.2 2.3 3.5 5.6 4.9 2.1.9 2.9.9 3.9.8.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z" />
    </svg>
  )
}

export function WhatsAppFab() {
  const { pathname } = useLocation()
  if (!isWhatsappConfigured() || pathname.startsWith('/checkout')) return null
  return (
    <a
      href={whatsappLink(buildGeneralMessage())}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-[70] flex items-center gap-0 rounded-full bg-[#25D366] text-white shadow-soft transition-all duration-300 hover:gap-2 hover:pr-5 sm:bottom-6 sm:right-6"
    >
      <span className="flex h-14 w-14 items-center justify-center">
        <WhatsAppIcon className="h-7 w-7" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12px] font-medium uppercase tracking-wide2 transition-all duration-300 group-hover:max-w-[120px]">
        Chat with us
      </span>
    </a>
  )
}
