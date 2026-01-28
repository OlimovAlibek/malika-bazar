'use client';

import { useEffect, useState } from 'react';
import ButtonLoader from './ui/ButtonLoader';

export default function TelegramLoginClient() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

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
    setLoading(false);
    setChecking(true);
  
    // ✅ AUTO OPEN TELEGRAM (KEY UX FIX)
    if (data.telegram_url) {
      window.location.href = data.telegram_url;
    }
  }

  useEffect(() => {
    if (!token) return;
  
    const checkLogin = async () => {
      const res = await fetch('/api/telegram/check', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
  
      const data = await res.json();
  
      if (data.loggedIn) {
        window.location.href = '/profile';
      }
    };
  
    const interval = setInterval(checkLogin, 2000);
  
    // ✅ SIMPLE & SAFE: re-check when tab becomes active
    const onFocus = () => checkLogin();
    window.addEventListener('focus', onFocus);
  
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [token]);

  return (
    <div className="space-y-3">
      <button
        onClick={handleLogin}
        disabled={loading || checking}
        className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <ButtonLoader size="sm" className="text-white" />}
        {checking ? 'Tekshirilmoqda...' : 'Login with Telegram'}
      </button>

      {/* {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-blue-600 dark:text-blue-400 underline"
        >
          Open Telegram to confirm login
        </a>
      )} */}
    </div>
  );
}