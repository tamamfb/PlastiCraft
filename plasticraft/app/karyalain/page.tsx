'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavbar from '@/app/components/BottomNavbar';
import { CubeIcon, WrenchScrewdriverIcon, HeartIcon, GiftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

// Tipe data untuk setiap item karya
interface Karya {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
}

// Komponen untuk setiap kartu karya
const KaryaCard = ({ karya }: { karya: Karya }) => {
  const imageUrl = karya.gambar.startsWith('http') ? karya.gambar : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${karya.gambar}`;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4">
      <img src={imageUrl} alt={karya.judul} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-800">{karya.judul}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{karya.deskripsi}</p>
        <button className="mt-2 inline-flex items-center text-sm font-semibold text-white bg-[#1B8380] py-1 px-3 rounded-full hover:bg-[#166966] cursor-pointer transition-colors">
          Lihat Karya
          <ChevronRightIcon className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

// Halaman utama
export default function KaryaLainPage() {
  const router = useRouter();
  const [karyaList, setKaryaList] = useState<Karya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk filter
  const [selectedBahan, setSelectedBahan] = useState('');
  const [selectedProduk, setSelectedProduk] = useState('');
  const [sortBy, setSortBy] = useState('newest'); 

  // Data kategori dengan teks yang sudah diperpendek
  const kategoriProduk = [
    { id: '1', nama: 'Mainan', icon: CubeIcon },
    { id: '2', nama: 'Rumah Tangga', icon: WrenchScrewdriverIcon },
    { id: '3', nama: 'Aksesoris', icon: HeartIcon },
    { id: '4', nama: 'Dekorasi', icon: GiftIcon },
  ];

  useEffect(() => {
    const fetchKarya = async () => {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedBahan) params.append('categoryBahanId', selectedBahan);
      if (selectedProduk) params.append('categoryProdukId', selectedProduk);
      params.append('sortBy', sortBy); 

      try {
        const response = await fetch(`/api/karya?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Gagal memuat data karya');
        }
        const data: Karya[] = await response.json();
        setKaryaList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKarya();
  }, [selectedBahan, selectedProduk, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Karya Lain</h1>
      </header>

      <main className="p-4">
        <div className="bg-[#1B8380] text-white rounded-2xl p-4 mb-6">
          <h2 className="text-lg font-bold mb-2">Pilih Bahan Daur Ulangmu</h2>
          <select
            value={selectedBahan}
            onChange={(e) => setSelectedBahan(e.target.value)}
            className="w-full bg-white text-gray-800 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
          >
            <option value="">Semua Bahan</option>
            <option value="1">Botol Plastik</option>
            <option value="2">Kertas</option>
            <option value="3">Logam</option>
            <option value="4">Kain</option>
          </select>
        </div>

        <div className="flex justify-around items-start text-center mb-6">
          {kategoriProduk.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedProduk(prev => prev === cat.id ? '' : cat.id)}
              className={`cursor-pointer flex flex-col items-center space-y-1 transition-transform duration-200 w-20 ${selectedProduk === cat.id ? 'text-[#1B8380] scale-110' : 'text-gray-500'}`}
            >
              <div className={`p-3 rounded-full ${selectedProduk === cat.id ? 'bg-[#1B8380]' : 'bg-gray-200'}`}>
                <cat.icon className={`w-6 h-6 ${selectedProduk === cat.id ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className="text-xs font-semibold">{cat.nama}</span>
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Menampilkan Hasil</h2>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer text-sm font-semibold bg-white border border-gray-300 rounded-lg py-1 pl-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1B8380]"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="most_liked">Paling Disukai</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-[#1B8380] animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : karyaList.length > 0 ? (
            <div className="space-y-4">
              {karyaList.map(karya => (
                <KaryaCard key={karya.id} karya={karya} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Tidak ada karya yang ditemukan.</p>
          )}
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}