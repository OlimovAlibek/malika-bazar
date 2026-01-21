'use client';

import { useEffect, useState } from 'react';

export default function TelegramLoginClient() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setToken(null);
  setUrl(null);
    setLoading(true);

    const res = await fetch('/api/telegram/login', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();
    setToken(data.token);
    setUrl(data.telegram_url);
  }

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      const res = await fetch('/api/telegram/check', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.loggedIn) {
        clearInterval(interval);
        console.log('[telegram/check] loggedIn=true; redirecting to /');
        window.location.href = '/';
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="space-y-3">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
      >
        Login with Telegram
      </button>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-blue-600 underline"
        >
          Open Telegram to confirm login
        </a>
      )}
    </div>
  );
}