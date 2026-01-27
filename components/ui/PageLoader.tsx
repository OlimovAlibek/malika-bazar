'use client';

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Yuklanmoqda...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="inline-block w-12 h-12 border-4 border-emerald-500 dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
