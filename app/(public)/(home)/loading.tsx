import PhoneCardSkeleton from '@/components/PhoneCardSkeleton';
import SkeletonText from '@/components/ui/SkeletonText';

export default function HomeLoading() {
  return (
    <main className="min-h-screen pb-8">
      {/* Top nav placeholder */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <SkeletonText width="w-20" height="h-6" />
          <SkeletonText width="flex-1" height="h-9" className="rounded-xl" />
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

