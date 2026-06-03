'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="w-20 h-20 rounded-2xl bg-[#131921] border border-gray-800 flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M6.257 6.257l.644.644M9.404 9.404l.644.644M12.75 12.75l.644.644m2.147 2.148l.643.643M21 3L3 21M12 18.75a6 6 0 01-5.985-5.621" />
        </svg>
      </div>

      <div>
        <p className="text-2xl font-black text-white">Internet yo'q</p>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          Internet aloqasini tekshiring va qayta urinib ko'ring
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="px-6 h-11 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-black transition-colors"
      >
        Qayta urinish
      </button>
    </div>
  )
}
