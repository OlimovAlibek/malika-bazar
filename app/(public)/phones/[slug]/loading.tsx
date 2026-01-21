export default function ProductLoading() {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-4 animate-pulse">
        {/* Image */}
        <div className="w-full h-64 bg-gray-200 dark:bg-slate-700 rounded-xl" />
  
        {/* Title */}
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
  
        {/* Price */}
        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-1/2" />
  
        {/* Updated */}
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
  
        {/* Shop */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-3 space-y-2 bg-white dark:bg-slate-800">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
        </div>
  
        {/* Actions */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-300 dark:bg-slate-600 rounded-xl" />
          <div className="flex-1 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    );
  }