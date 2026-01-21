import PhoneCardSkeleton from '@/components/PhoneCardSkeleton';

export default function HomeLoading() {
  return (
    <main className="min-h-screen pb-8">
      {/* Top nav placeholder */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 h-9 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Cards (2-col grid for home) */}
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <ul className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PhoneCardSkeleton key={i} />
          ))}
        </ul>
      </div>
    </main>
  );
}

