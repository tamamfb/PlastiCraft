'use client';

import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import BottomNavbar from '@/app/components/BottomNavbar';

export default function TutorialDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-6">
      {/* Back Button */}
      <Link href="/tutorial">
        <div className="flex items-center text-black font-semibold mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Kembali ke Halaman Tutorial
        </div>
      </Link>

      {/* Image */}
      <div className="flex justify-center mb-4">
        <img
          src="/example.jpg"
          alt="Karya"
          className="w-64 h-64 object-cover rounded-lg"
        />
      </div>

      {/* Nama Karya */}
      <h2 className="text-center text-lg font-bold mb-4">Nama Karya</h2>

      {/* Alat & Bahan */}
      <div className="mb-4">
        <h3 className="font-semibold">Alat & Bahan :</h3>
        <ul className="text-sm text-gray-700 list-disc ml-6 mt-1">
          <li>Barang 1</li>
          <li>Barang 2</li>
          <li>Barang 3</li>
        </ul>
      </div>

      {/* Langkah-langkah */}
      <div className="mb-6">
        <h3 className="font-semibold">Langkah-langkah :</h3>
        <ol className="text-sm text-gray-700 list-decimal ml-6 mt-1">
          <li>Langkah pertama</li>
          <li>Langkah kedua</li>
          <li>Langkah ketiga</li>
        </ol>
      </div>

      {/* Button Video */}
      <div className="text-center mb-6">
        <button className="bg-[#1B7865] text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 mx-auto cursor-pointer hover:bg-[#1B7865]/90 transition">
          Video Demonstrasi <ExternalLink size={14} />
        </button>
      </div>

      {/* Bottom Navbar */}
      <div className="mt-auto">
        <BottomNavbar />
      </div>
    </div>
  );
}