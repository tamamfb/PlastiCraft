'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/beranda');
    } else {
      setErrorMessage(data.error || 'Login gagal');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {showSuccess && (
        <div className="absolute top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md animate-bounce">
          Registrasi berhasil! Silakan login.
        </div>
      )}
      {errorMessage && (
        <div className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-md animate-bounce">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#3EB59D] text-white py-2 rounded-md hover:bg-[#8BD0C2] transition cursor-pointer"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <a href="/register" className="text-[#3EB59D] hover:underline">Register</a>
        </p>
      </form>
    </div>
  );
}
