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
      <h1 className="text-lg font-bold">Admin Login</h1>

      <input
        className="border p-2 w-full"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-black text-white p-2 w-full"
      >
        Login
      </button>
    </main>
  );
}