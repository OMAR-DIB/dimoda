import { cx } from '../../lib/format'
import type { ProductTag } from '../../types'

const styles: Record<ProductTag, string> = {
  new: 'bg-ink text-ivory',
  bestseller: 'bg-gold-500 text-ink',
  sale: 'bg-burgundy text-ivory bg-[#6E1E2B]',
  limited: 'bg-ivory text-ink border border-ink',
}

const labels: Record<ProductTag, string> = {
  new: 'New',
  bestseller: 'Bestseller',
  sale: 'Sale',
  limited: 'Limited',
}

export function Badge({ tag, className }: { tag: ProductTag; className?: string }) {
  return (
    <span
      className={cx(
        'inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide2',
        styles[tag],
        className,
      )}
    >
      {labels[tag]}
    </span>
  )
}
