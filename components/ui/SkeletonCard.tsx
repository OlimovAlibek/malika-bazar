import SkeletonImage from './SkeletonImage';
import SkeletonText from './SkeletonText';

interface SkeletonCardProps {
  variant?: 'grid' | 'list';
  className?: string;
}

export default function SkeletonCard({ variant = 'grid', className = '' }: SkeletonCardProps) {
  return (
    <li
      className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 ${className}`}
    >
      {/* Image */}
      <SkeletonImage aspectRatio="square" className="mb-2" />

      {/* Title */}
      <SkeletonText width="w-3/4" height="h-4" className="mb-1" />
      <SkeletonText width="w-1/3" height="h-3" className="mb-2" />

      {/* Price */}
      <SkeletonText width="w-1/2" height="h-6" className="mb-2 bg-gray-300 dark:bg-slate-600" />

      {/* Updated */}
      <SkeletonText width="w-1/3" height="h-3" className="mb-2" />

      {/* Shop */}
      <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-700 pt-2">
        <SkeletonText width="w-1/2" height="h-3" />
        <SkeletonText width="w-10" height="h-4" />
      </div>
    </li>
  );
}
