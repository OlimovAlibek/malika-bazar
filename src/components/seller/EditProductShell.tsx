'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductForm, type FormValues } from '@/components/seller/ProductForm'
import { updateProduct } from '@/actions/products'
import { uploadImage } from '@/lib/upload'

type Props = {
  productId: string
  defaultValues: Partial<{
    brand: string
    model: string
    storage_gb: number | null
    condition: 'new' | 'used'
    price_uzs: number | ''
    description: string
    is_active: boolean
    images: string[]
  }>
}

export function EditProductShell({ productId, defaultValues }: Props) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(values: FormValues) {
    setLoading(true)
    setError('')
    try {
      const images: { url: string; public_id?: string; position: number }[] = []

      for (let i = 0; i < values.images.length; i++) {
        const file = values.imageFiles[i]
        if (file) {
          const uploaded = await uploadImage(file)
          images.push({ url: uploaded.url, public_id: uploaded.public_id, position: i })
        } else {
          images.push({ url: values.images[i], position: i })
        }
      }

      await updateProduct(productId, {
        brand:       values.brand,
        model:       values.model,
        storage_gb:  values.storage_gb,
        condition:   values.condition,
        price_uzs:   Number(values.price_uzs),
        description: values.description,
        is_active:   values.is_active,
        images,
      })

      setSuccess(true)
      setTimeout(() => router.push('/seller/products'), 1200)
    } catch {
      setError('Xatolik yuz berdi. Qayta urinib ko\'ring.')
      setLoading(false)
    }
  }

  return (
    <>
      {success && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          O'zgarishlar saqlandi!
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/seller/products"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Mahsulotlar / Tahrirlash</p>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">Mahsulotni tahrirlash</h1>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <ProductForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={loading}
            submitLabel="Saqlash"
            cancelHref="/seller/products"
          />
        </div>
      </div>
    </>
  )
}
