// app/beranda/page.tsx
// (Ini akan menjadi Server Component)

import BottomNavbar from '@/app/components/BottomNavbar';
import Image from 'next/image';
import bg from '@/public/bg.jpg';
import prisma from '@/lib/prisma'; // Import Prisma Client Anda
import CreationsSection from '@/app/components/CreationsSection'; // Import Client Component yang baru

export const dynamic = 'force-dynamic'; // Untuk memastikan data selalu terbaru saat setiap request

export default async function BerandaPage() {
  // Ambil 6 kreasi terbaru bertipe KARYA dari database
  const creations = await prisma.creation.findMany({
    where: {
      type: 'KARYA', // Hanya ambil yang bertipe KARYA
    },
    select: {
      id: true,
      gambar: true,
      judul: true,
    },
    orderBy: {
      tanggal: 'desc', // Urutkan dari yang terbaru
    },
    take: 6, // Ambil 6 kreasi terbaru
  });

  return (
    // Tambahkan padding-bottom agar BottomNavbar tidak menutupi konten
    <div className="relative min-h-screen bg-gray-100 pb-24"> 
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
          <button className="bg-[#FAF7EF] hover:text-[#34a18a] text-black font-bold min-w-[160px] py-2 rounded-full text-2xl transition cursor-pointer">
            MULAI
          </button>
        </div>
      </div>

      {/* Bagian: Lihat Kreasi orang lain, sekarang menggunakan Client Component */}
      <div className="p-4">
        <CreationsSection initialCreations={creations} />
      </div>

      {/* Informasi Statistik Sampah Plastik */}
      <div className="p-4 mt-8 text-center">
        <h2 className="text-lg font-semibold mb-4">Informasi Statistik Sampah Plastik</h2>
        <div className="text-gray-400 text-6xl">📈</div>
        <p className="text-gray-500 mt-2">Data statistik akan segera hadir!</p>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
}