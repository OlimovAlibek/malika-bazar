'use client';

type Props = {
  productId: string;
  shopId: string;
  phone?: string;
  telegram?: string;
};

export default function ProductActions({
  productId,
  shopId,
  phone,
  telegram,
}: Props) {
  async function track(eventType: 'call' | 'telegram') {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          shop_id: shopId,
          event_type: eventType,
        }),
      });
    } catch (e) {
      // silently fail – tracking must NEVER block user
    }
  }

  return (
    <div className="flex gap-3 pt-2">
      {phone && (
        <a
          href={`tel:${phone}`}
          onClick={() => track('call')}
          className="flex-1 text-center bg-black dark:bg-slate-700 text-white dark:text-slate-100 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-slate-600 transition"
        >
          📞 Call
        </a>
      )}

      {telegram && (
        <a
          href={`https://t.me/${telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('telegram')}
          className="flex-1 text-center border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          💬 Telegram
        </a>
      )}
    </div>
  );
}