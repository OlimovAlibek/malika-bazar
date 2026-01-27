'use client';

interface ButtonLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ButtonLoader({ size = 'md', className = '' }: ButtonLoaderProps) {
  const sizeClasses = {
    sm: 'w-3 h-3 border',
    md: 'w-4 h-4 border-2',
    lg: 'w-5 h-5 border-2',
  };

  return (
    <div
      className={`inline-block ${sizeClasses[size]} border-current border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
