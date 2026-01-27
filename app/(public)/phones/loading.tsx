import PhoneCardSkeleton from '@/components/PhoneCardSkeleton';
import SkeletonText from '@/components/ui/SkeletonText';

export default function PhonesLoading() {
  return (
    <main className="min-h-screen pb-8">
      {/* Search + filters placeholder */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          <SkeletonText width="w-full" height="h-9" className="rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonText
                key={i}
                width="w-20"
                height="h-8"
                className="rounded-xl"
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