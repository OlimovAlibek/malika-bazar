interface SkeletonTextProps {
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}

export default function SkeletonText({
  width = 'w-full',
  height = 'h-4',
  className = '',
  lines = 1,
}: SkeletonTextProps) {
  if (lines === 1) {
    return (
      <div
        className={`${width} ${height} bg-gray-200 dark:bg-slate-700 rounded animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${i === lines - 1 ? 'w-3/4' : width} ${height} bg-gray-200 dark:bg-slate-700 rounded animate-pulse`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
