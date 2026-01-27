interface SkeletonImageProps {
  aspectRatio?: 'square' | 'video' | 'auto';
  className?: string;
  rounded?: boolean;
}

export default function SkeletonImage({
  aspectRatio = 'square',
  className = '',
  rounded = true,
}: SkeletonImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  };

  return (
    <div
      className={`${aspectClasses[aspectRatio]} bg-gray-200 dark:bg-slate-700 ${rounded ? 'rounded-xl' : ''} animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}
