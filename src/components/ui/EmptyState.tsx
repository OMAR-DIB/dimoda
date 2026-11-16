import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; to: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeUp">
      {icon && <div className="mb-5 text-gold-500">{icon}</div>}
      <h3 className="text-2xl">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-stone">{description}</p>}
      {action && (
        <Link to={action.to} className="btn-primary mt-8">
          {action.label}
        </Link>
      )}
    </div>
  )
}
