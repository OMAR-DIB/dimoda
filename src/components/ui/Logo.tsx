import { Link } from 'react-router-dom'
import { cx } from '../../lib/format'

/**
 * Brand lock-up drawn from the DI MODA identity: gold ring, "d" mark with a dot, serif wordmark.
 * Replace the mark with the real logo file by dropping it into /public/logo.png and using <img>.
 */
export function Mark({ className, stroke = '#C8911B' }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M38 14v26.5a8.5 8.5 0 1 1-8.5-8.5H36"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="42" cy="12" r="4" fill={stroke} />
    </svg>
  )
}

export function Logo({
  className,
  size = 'md',
  tone = 'gold',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'gold' | 'ivory'
}) {
  const color = tone === 'ivory' ? '#F6F5F1' : '#C8911B'
  const text =
    size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-[22px] sm:text-2xl'
  const mark = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  return (
    <Link to="/" className={cx('group inline-flex items-center gap-2', className)} aria-label="DI MODA home">
      <Mark className={cx(mark, '-mt-1 transition-transform duration-500 group-hover:rotate-[-8deg]')} stroke={color} />
      <span
        className={cx('font-brand font-medium tracking-[0.14em]', text)}
        style={{ color }}
      >
        DI MODA
      </span>
    </Link>
  )
}
