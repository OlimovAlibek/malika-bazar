'use client';

type Props = {
  title: string;
  price: number;
};

export default function ShareButton({ title, price }: Props) {
  const share = () => {
    const url = window.location.href;

    const text = `${title}\n💰 ${price.toLocaleString()} so‘m\n\nMalika bozori narxlari 👇`;

    const shareUrl =
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

    window.open(shareUrl, '_blank');
  };

  return (
    <button
      onClick={share}
      className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 py-3 rounded-xl text-center font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
    >
      📤 Telegram&apos;da ulashish
    </button>
  );
}