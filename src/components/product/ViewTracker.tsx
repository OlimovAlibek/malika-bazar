'use client'

import { useEffect } from 'react'

export function ViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view', product_id: productId }),
    })
  }, [productId])
  return null
}
