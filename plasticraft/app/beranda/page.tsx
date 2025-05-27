'use client';

import BottomNavbar from '@/app/components/BottomNavbar'
import Image from 'next/image';
import bg from '@/public/bg.jpg'; 

export default function beranda() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="relative mx-4 mt-4 mb-8 rounded-lg overflow-hidden">
        <Image src={bg} alt="Background" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl font-semibold mb-2">Kreasikan Sampah Plastikmu</h1>
          <p className="text-lg mb-8">Hijaukan Bumi, kurangi sampah plastik</p>
          <button className="bg-[#FAF7EF] hover:text-[#34a18a] text-black font-bold min-w-[160px] py-2 rounded-full text-2xl transition cursor-pointer">
            MULAI
          </button>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}
