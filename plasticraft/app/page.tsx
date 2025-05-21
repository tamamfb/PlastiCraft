'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import logo from '@/public/logo.png'; 

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/login'; 
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen relative p-6 bg-white">
      <div className="flex flex-col items-center justify-center">
        <Image src={logo} alt="Gambar" className="w-48 h-auto" />
        <h1 className="font-bold mt-4 text-4xl text-black">PlastiCraft</h1>

        <div className="mt-20">
          <div className="w-10 h-10 border-[7px] border-[#3EB59D] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      <h1 className="italic text-2xl absolute bottom-20 text-black">by RTR</h1>
    </main>
  );
}
