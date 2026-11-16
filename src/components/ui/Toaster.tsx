import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { dismissToast } from '../../store/uiSlice'

function ToastItem({ id, title, description, image, action }: {
  id: number
  title: string
  description?: string
  image?: string
  action?: { label: string; to: string }
}) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(id)), 3800)
    return () => clearTimeout(t)
  }, [id, dispatch])

  return (
    <div className="pointer-events-auto flex w-[340px] max-w-[calc(100vw-2rem)] items-center gap-3 border border-ivory-300 bg-white p-3 shadow-soft animate-fadeUp">
      {image && <img src={image} alt="" className="h-14 w-11 object-cover" />}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {description && <p className="truncate text-xs text-stone">{description}</p>}
        {action && (
          <Link
            to={action.to}
            onClick={() => dispatch(dismissToast(id))}
            className="mt-1 inline-block text-[11px] font-medium uppercase tracking-wide2 text-gold-600 hover:text-ink"
          >
            {action.label} →
          </Link>
        )}
      </div>
      <button
        aria-label="Dismiss"
        onClick={() => dispatch(dismissToast(id))}
        className="p-1 text-stone-light hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts)
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[90] flex flex-col gap-2 sm:bottom-6 sm:left-6">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  )
}
