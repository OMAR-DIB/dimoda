import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cx } from '../../lib/format'

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  link?: { label: string; to: string }
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cx(
        'mb-8 flex flex-col gap-3 sm:mb-10',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cx('max-w-xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-3xl leading-[1.05] sm:text-4xl lg:text-[44px]">{title}</h2>
        {description && <p className="mt-3 text-stone">{description}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          className="link-underline inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide2 text-ink"
        >
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
