export function ProductCardSkeleton() {
  return (
    <div className="animate-fadeIn">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/4" />
      </div>
    </div>
  )
}
