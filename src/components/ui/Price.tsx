import { formatPrice, cx } from '../../lib/format'

export function Price({
  price,
  compareAt,
  className,
  size = 'md',
}: {
  price: number
  compareAt?: number | null
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const onSale = !!compareAt && compareAt > price
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
  return (
    <span className={cx('inline-flex items-baseline gap-2', className)}>
      <span className={cx('font-medium tabular-nums', text, onSale && 'text-gold-600')}>
        {formatPrice(price)}
      </span>
      {onSale && (
        <span className="text-stone-light line-through tabular-nums text-sm">{formatPrice(compareAt!)}</span>
      )}
    </span>
  )
}
