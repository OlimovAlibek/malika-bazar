export default function PhonesLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 bg-[#131921] safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="shrink-0 w-16 h-5 bg-white/10 rounded animate-pulse" />
          <div className="flex-1 h-9 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="bg-[#1E2A38] border-t border-white/5 h-11" />
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <li key={i} className="bg-white dark:bg-[#16161F] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-1/2 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse mt-2" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
