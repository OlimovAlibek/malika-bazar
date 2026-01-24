export const revalidate = 86400; // ✅ allowed here

import AboutFAQ from '@/components/AboutFAQ';

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Tezku — telefon narxlarini tez va oson topish uchun
        </h1>

        <p className="text-slate-600 dark:text-slate-300">
          <strong>Tezku</strong> — bu O‘zbekistondagi real bozorlarda
          sotilayotgan telefonlarning haqiqiy narxlarini bir joyda
          ko‘rsatadigan platforma.
        </p>

        <p className="text-slate-600 dark:text-slate-300">
          Bugun Malika bozori, ertaga esa boshqa bozorlar.
          Tezku asta-sekin butun mamlakatni qamrab oladi.
        </p>
      </section>

      <hr className="border-gray-200 dark:border-slate-700" />

      {/* ✅ CLIENT FAQ */}
      <AboutFAQ />

      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
        Tezku — narxni bilish endi oson.
      </p>
    </main>
  );
}