import PhoneCardSkeleton from '@/components/PhoneCardSkeleton';
import SkeletonText from '@/components/ui/SkeletonText';

export default function BrandLoading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* H1 */}
      <SkeletonText width="w-3/4" height="h-7" />

      {/* Intro paragraph */}
      <SkeletonText lines={2} height="h-4" className="w-full" />

      {/* Products grid */}
      <ul className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PhoneCardSkeleton key={i} />
        ))}
      </ul>
    </main>
  );
}
