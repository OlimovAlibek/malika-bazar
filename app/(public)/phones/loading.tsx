import PhoneCardSkeleton from '@/components/PhoneCardSkeleton';

export default function PhonesLoading() {
  return (
    <main className="min-h-screen pb-8">
      {/* Search + filters placeholder */}
      <div className="sticky top-0 bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          <div className="h-9 bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <ul className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <PhoneCardSkeleton key={i} />
          ))}
        </ul>
      </div>
    </main>
  );
}