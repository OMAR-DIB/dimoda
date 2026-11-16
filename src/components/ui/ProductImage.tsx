import { useState } from 'react'
import { cx } from '../../lib/format'

/**
 * Image with a graceful branded fallback when the remote URL fails,
 * plus a soft fade-in once loaded.
 */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  eager?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={cx('relative overflow-hidden bg-ivory-200', className)}>
      {!loaded && !failed && <div className="skeleton absolute inset-0" />}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-ivory-100 to-ivory-300 text-gold-500">
          <svg viewBox="0 0 64 64" className="h-10 w-10 opacity-70" aria-hidden="true">
            <path d="M38 14v26.5a8.5 8.5 0 1 1-8.5-8.5H36" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <circle cx="42" cy="12" r="4" fill="currentColor" />
          </svg>
          <span className="font-brand text-[10px] tracking-luxe">DI MODA</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cx(
            'h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
