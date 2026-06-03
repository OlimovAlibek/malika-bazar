import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/db/admin'
import { AdminProductsList } from '@/components/admin/AdminProductsList'

export const metadata: Metadata = { title: 'Mahsulotlar — Admin' }

export default async function AdminProductsPage() {
  const products = await getAllProducts()
  const active   = products.filter(p => p.is_active).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mahsulotlar</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Barcha do'konlardagi mahsulotlar · {products.length} ta jami ·{' '}
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{active} faol</span>
        </p>
      </div>

      <AdminProductsList products={products} />
    </div>
  )
}
