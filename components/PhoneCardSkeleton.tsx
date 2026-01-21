export default function PhoneCardSkeleton() {
    return (
      <li className="bg-white border border-gray-200 rounded-2xl p-3 animate-pulse">
        {/* Image */}
        <div className="aspect-square bg-gray-200 rounded-xl mb-2" />
  
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
  
        {/* Price */}
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2" />
  
        {/* Updated */}
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
  
        {/* Shop */}
        <div className="flex justify-between items-center border-t pt-2">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-10" />
        </div>
      </li>
    );
  }