'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    console.log('LOGIN RESULT:', data, error);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    window.location.href = '/admin';
  };

  return (
    <main className="p-4 space-y-3">
      <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Admin Login</h1>

      <input
        className="border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 p-2 w-full rounded"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 p-2 w-full rounded"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-black dark:bg-slate-700 text-white dark:text-slate-100 p-2 w-full rounded hover:bg-gray-800 dark:hover:bg-slate-600 transition"
      >
        Login
      </button>
    </main>
  );
}