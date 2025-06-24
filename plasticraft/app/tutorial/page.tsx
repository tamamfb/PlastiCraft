import prisma from '@/lib/prisma'; // Sesuaikan path jika berbeda
import BottomNavbar from '@/app/components/BottomNavbar';
import Link from 'next/link';
import TutorialClientPage from './TutorialClientPage';

export const dynamic = 'force-dynamic';

export default async function TutorialPage() {
  const tutorials = await prisma.creation.findMany({
    where: {
      type: 'TUTORIAL',
      NOT: {
        langkah: null,
      },
    },
    select: {
      id: true,
      gambar: true,
      judul: true,
      deskripsi: true,
      tanggal: true,
      categoryProduk: {
        select: { nama: true }
      },
      categoryBahan: {
        select: { nama: true }
      }
    },
    orderBy: {
      tanggal: 'desc',
    },
  });

  const formattedTutorials = tutorials.map(tutorial => ({
    ...tutorial,
  }));

  return (
    // Tambahkan pb-24 di sini
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Tutorial</h1>
        <TutorialClientPage initialTutorials={formattedTutorials} />
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto">
        <BottomNavbar />
      </div>
    </div>
  );
}