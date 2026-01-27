import SkeletonImage from '@/components/ui/SkeletonImage';
import SkeletonText from '@/components/ui/SkeletonText';

export default function ProductLoading() {
  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Image */}
      <SkeletonImage aspectRatio="auto" className="w-full h-64" />

      {/* Title */}
      <SkeletonText width="w-3/4" height="h-5" />

      {/* Price */}
      <SkeletonText width="w-1/2" height="h-8" className="bg-gray-300 dark:bg-slate-600" />

      {/* Updated */}
      <SkeletonText width="w-1/3" height="h-3" />

      {/* Shop */}
      <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-3 space-y-2 bg-white dark:bg-slate-800">
        <SkeletonText width="w-1/2" height="h-4" />
        <SkeletonText width="w-1/4" height="h-3" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <SkeletonText width="flex-1" height="h-12" className="bg-gray-300 dark:bg-slate-600 rounded-xl" />
        <SkeletonText width="flex-1" height="h-12" className="rounded-xl" />
      </div>
    </div>
  );
}