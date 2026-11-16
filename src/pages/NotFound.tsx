import { EmptyState } from '../components/ui/EmptyState'
import { Mark } from '../components/ui/Logo'

export default function NotFound() {
  return (
    <div className="container-x">
      <EmptyState
        icon={<Mark className="h-14 w-14" />}
        title="This page went out of style"
        description="The page you're looking for doesn't exist or has moved."
        action={{ label: 'Back to the collection', to: '/shop' }}
      />
    </div>
  )
}
