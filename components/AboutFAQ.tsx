'use client';

import { useState } from 'react';

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {question}
        </span>
        <span className="text-xl text-slate-400">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function AboutFAQ() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        Ko‘p so‘raladigan savollar
      </h2>

      <div className="space-y-3">
        <FAQItem
          question="Tezku bepulmi?"
          answer="Ha. Tezku oddiy foydalanuvchilar uchun to‘liq bepul."
        />
        <FAQItem
          question="Tezkudagi narxlar ishonchlimi?"
          answer="Narxlar real bozorlardagi do‘konlardan olinadi."
        />
        <FAQItem
          question="Tezku telefon sotadimi?"
          answer="Yo‘q. Tezku telefon sotmaydi, faqat narxlarni ko‘rsatadi."
        />
        <FAQItem
          question="Qanday bog‘lanaman?"
          answer="Har bir mahsulot sahifasida telefon yoki Telegram mavjud."
        />
      </div>
    </section>
  );
}