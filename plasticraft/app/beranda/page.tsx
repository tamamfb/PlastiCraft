'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNavbar from '@/app/components/BottomNavbar';
import Image from 'next/image';
import { IoStatsChart, IoTrashBin, IoSync, IoWater } from 'react-icons/io5';
import { Loader2 } from 'lucide-react';
import bg from '@/public/bg.jpg';

// --- Impor Swiper ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';

// --- Impor CSS Swiper ---
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


// Komponen untuk kartu statistik
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

// Tipe data untuk karya
interface Karya {
  id: number;
  judul: string;
  gambar: string;
}

// Tipe untuk statistik
type Stats = {
  totalTimbunan: number;
  masukKeLaut: number;
  daurUlang: number;
  tidakDikelola: number;
};

export default function Beranda() {
  // State untuk statistik
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  // State untuk daftar karya
  const [creations, setCreations] = useState<Karya[]>([]);
  const [loadingCreations, setLoadingCreations] = useState(true);
  const [errorCreations, setErrorCreations] = useState<string | null>(null);

  // useEffect untuk data statistik
  useEffect(() => {
    const fetchStats = () => {
      try {
        const data = { totalTimbunan: 6.8, masukKeLaut: 620, daurUlang: 10, tidakDikelola: 60 };
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

  // useEffect untuk data karya terbaru
  useEffect(() => {
    const fetchLatestCreations = async () => {
      setLoadingCreations(true);
      setErrorCreations(null);
      try {
        const response = await fetch(`/api/karya?sortBy=newest`);
        if (!response.ok) throw new Error('Gagal mengambil data kreasi terbaru.');
        const data: Karya[] = await response.json();
        setCreations(data); // Ambil semua data, slider akan menanganinya
      } catch (err: any) {
        setErrorCreations(err.message);
      } finally {
        setLoadingCreations(false);
      }
    };
    fetchLatestCreations();
  }, []);

  return (
    
    <div className="bg-gray-50 min-h-screen pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-15 p-4">
        <h1 className="text-2xl font-bold text-black">PlastiCraft</h1>
      </header>
      {/* Bagian 1: Banner */}
      <div className="relative mx-4 mt-4 mb-8 rounded-lg overflow-hidden">
        <Image src={bg} alt="Background" className="w-full h-64 object-cover" priority />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">Kreasikan Sampah Plastikmu</h1>
          <p className="text-sm sm:text-base md:text-lg mb-8">Hijaukan Bumi, kurangi sampah plastik</p>
          <Link href="/tutorial">
            <button className="bg-[#FAF7EF] hover:text-[#34a18a] text-black font-bold min-w-[160px] py-2 rounded-full text-2xl transition cursor-pointer">
              MULAI
            </button>
          </Link>
        </div>
      </div>

      {/* Bagian 2: Galeri Kreasi (Slider) */}
      <div className="my-8">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-lg font-semibold text-gray-800">Lihat Kreasi orang lain</h2>
          <Link href="/karyalain">
            <span className="cursor-pointer text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition">
              Lihat Semua
            </span>
          </Link>
        </div>
        
        {/* Tampilan Kondisional untuk Slider */}
        {loadingCreations ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-[#1B8380] animate-spin" /></div>
        ) : errorCreations ? (
          <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg mx-4">{errorCreations}</p>
        ) : creations.length > 0 ? (
          <Swiper
            slidesPerView={2.2} // Menampilkan 2 gambar penuh dan sedikit dari gambar ke-3
            spaceBetween={16} // Jarak antar gambar
            freeMode={true}
            pagination={{ clickable: true }}
            modules={[FreeMode, Pagination]}
            className="!px-4 !pb-10" // Padding horizontal untuk slider dan padding bawah untuk pagination
            breakpoints={{
              // Aturan untuk layar yang lebih besar
              640: { slidesPerView: 3.5, spaceBetween: 20 },
              1024: { slidesPerView: 4.5, spaceBetween: 24 },
            }}
          >
            {creations.map((karya) => {
              const imageUrl = karya.gambar.startsWith('http') ? karya.gambar : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${karya.gambar}`;
              return (
                <SwiperSlide key={karya.id}>
                  {/* <Link href={`/karya/${karya.id}`}> */}
                    <div className="cursor-pointer group relative w-full h-40">
                      <Image
                        src={imageUrl}
                        alt={karya.judul}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="rounded-lg object-cover shadow-md transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  {/* </Link> */}
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500 py-8 mx-4">Belum ada karya untuk ditampilkan.</p>
        )}
      </div>
      
      {/* Bagian 3: Informasi Statistik */}
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

