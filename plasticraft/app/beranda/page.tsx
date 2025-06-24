'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Menggunakan Link untuk navigasi
import BottomNavbar from '@/app/components/BottomNavbar';
import Image from 'next/image';
import { IoStatsChart, IoTrashBin, IoSync, IoWater } from 'react-icons/io5';
import bg from '@/public/bg.jpg';
import { Loader2 } from 'lucide-react'; // Ikon loading


// Komponen untuk kartu statistik (tidak ada perubahan)
type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  color: string;
};

const StatCard = ({ icon, label, value, unit, color }: StatCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center border-l-4" style={{ borderColor: color }}>
    <div className="mr-4 text-white p-3 rounded-full" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold text-gray-900">
        {value} <span className="text-base font-normal">{unit}</span>
      </p>
    </div>
  </div>
);

// Tipe data untuk setiap item karya, sesuai dengan referensi
interface Karya {
  id: number;
  judul: string;
  gambar: string;
}

export default function Beranda() {
  // Tipe untuk statistik
  type Stats = {
    totalTimbunan: number;
    masukKeLaut: number;
    daurUlang: number;
    tidakDikelola: number;
  };

  // State untuk statistik
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  // State baru untuk daftar karya yang akan ditampilkan di beranda
  const [creations, setCreations] = useState<Karya[]>([]);
  const [loadingCreations, setLoadingCreations] = useState(true);
  const [errorCreations, setErrorCreations] = useState<string | null>(null);

  // useEffect untuk "mengambil" data statistik (tidak ada perubahan)
  useEffect(() => {
    const fetchStats = () => {
      try {
        const data = {
          totalTimbunan: 6.8,
          masukKeLaut: 620,
          daurUlang: 10,
          tidakDikelola: 60,
        };
        setTimeout(() => {
          setStats(data);
          setLoadingStats(false);
        }, 1500);
      } catch (err) {
        setErrorStats("Gagal memuat data statistik.");
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // useEffect baru untuk mengambil data karya terbaru dari API
  useEffect(() => {
    const fetchLatestCreations = async () => {
      setLoadingCreations(true);
      setErrorCreations(null);
      try {
        const response = await fetch(`/api/karya?sortBy=newest`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data kreasi terbaru.');
        }
        const data: Karya[] = await response.json();
        // Ambil 4 karya teratas untuk ditampilkan di beranda
        setCreations(data.slice(0, 4));
      } catch (err: any) {
        setErrorCreations(err.message);
      } finally {
        setLoadingCreations(false);
      }
    };
    fetchLatestCreations();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* Bagian 1: Banner Hijau Atas */}
      <div className="relative mx-4 mt-4 mb-8 rounded-lg overflow-hidden">
        <Image src={bg} alt="Background" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
            Kreasikan Sampah Plastikmu
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-8">
            Hijaukan Bumi, kurangi sampah plastik
          </p>
          <Link href="../karyalain">
          <button className="bg-[#FAF7EF] hover:text-[#34a18a] text-black font-bold min-w-[160px] py-2 rounded-full text-2xl transition cursor-pointer">
            MULAI
          </button>
          </Link>
        </div>
      </div>

      {/* Bagian 2: Galeri Kreasi Orang Lain (Dinamis) */}
      <div className="px-4 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Lihat Kreasi orang lain</h2>
          <Link href="../karyalain">
            <span className="cursor-pointer text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition">
              Lihat Semua Karya
            </span>
          </Link>
        </div>
        
        {/* Tampilan Kondisional untuk galeri */}
        {loadingCreations ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-[#1B8380] animate-spin" />
          </div>
        ) : errorCreations ? (
          <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{errorCreations}</p>
        ) : creations.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {creations.map((karya) => {
              const imageUrl = karya.gambar.startsWith('http') ? karya.gambar : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${karya.gambar}`;
              return (
                // Setiap gambar mengarah ke halaman Karya Lain
                <Link href="/karya-lain" key={karya.id}>
                  <div className="cursor-pointer group relative w-full h-40">
                    <Image
                      src={imageUrl}
                      alt={karya.judul}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="rounded-lg object-cover shadow-md transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Belum ada karya untuk ditampilkan.</p>
        )}
      </div>
      
      {/* Bagian 3: Informasi Statistik (Tidak ada perubahan fungsional) */}
      <div className="px-4 my-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistik Sampah Plastik (Estimasi Nasional)</h2>
        {loadingStats && <div className="text-center text-gray-500">Memuat data...</div>}
        {errorStats && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{errorStats}</div>}
        {stats && !loadingStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard icon={<IoTrashBin size={24} />} label="Timbunan Sampah Plastik" value={stats.totalTimbunan} unit="juta ton/tahun" color="#EF4444" />
            <StatCard icon={<IoWater size={24} />} label="Masuk ke Laut" value={stats.masukKeLaut} unit="ribu ton/tahun" color="#3B82F6" />
            <StatCard icon={<IoSync size={24} />} label="Berhasil Didaur Ulang" value={`${stats.daurUlang}%`} unit="" color="#10B981" />
            <StatCard icon={<IoStatsChart size={24} />} label="Tidak Dikelola Baik" value={`${stats.tidakDikelola}%`} unit="" color="#F97316" />
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4 text-right">Sumber: Estimasi berdasarkan data KLHK & Asosiasi Industri.</p>
      </div>

      <BottomNavbar />
    </div>
  );
}
