'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showError('Password dan Konfirmasi Password tidak sama');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/login?success=1');
    } else {
      showError(data.error || 'Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {errorMessage && (
        <div className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-md animate-bounce">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#3EB59D] text-white py-2 rounded-md hover:bg-[#8BD0C2] transition cursor-pointer"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <a href="/login" className="text-[#3EB59D] hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
