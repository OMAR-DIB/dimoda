import { Minus, Plus } from 'lucide-react'
import { cx } from '../../lib/format'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'md',
  className,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const w = size === 'sm' ? 'w-9' : 'w-12'
  return (
    <div className={cx('inline-flex items-center border border-ink', h, className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={cx('flex h-full items-center justify-center transition hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink', w)}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cx('flex h-full items-center justify-center text-sm font-medium tabular-nums', w)}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={cx('flex h-full items-center justify-center transition hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink', w)}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
