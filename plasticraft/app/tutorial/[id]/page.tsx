import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import BottomNavbar from '@/app/components/BottomNavbar';
import prisma from '@/lib/prisma'; // Sesuaikan path jika berbeda

// Helper function untuk parsing string dari database menjadi array of strings
function parseContentString(text: string | null | undefined): string[] {
  if (!text) return [];
  text = text.trim();
  if (text === '') return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed.map(item => item.trim()).filter(item => item !== '');
    }
  } catch (e) {
    console.warn("Failed to parse as JSON:", e);
  }

  let items: string[] = [];
  if (text.includes('\n')) {
    items = text.split('\n');
  } else if (text.includes(';')) {
    items = text.split(';');
  } else if (text.includes(',')) {
      items = text.split(',');
  } else {
    items = [text];
  }
  
  return items.map(item => item.trim()).filter(item => item !== '');
}


interface TutorialDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TutorialDetailPage({ params }: TutorialDetailPageProps) {
  const tutorialId = parseInt(params.id, 10);

  if (isNaN(tutorialId)) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center text-red-500">
        <p>ID Tutorial tidak valid.</p>
        <Link href="/tutorial" className="mt-4 text-blue-600 hover:underline">
          Kembali ke Daftar Tutorial
        </Link>
      </div>
    );
  }

  const tutorial = await prisma.creation.findUnique({
    where: {
      id: tutorialId,
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
      alatBahan: true, 
      langkah: true,   
      video: true,
    }
  });

  if (!tutorial) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center text-gray-600">
        <p>Tutorial tidak ditemukan.</p>
        <Link href="/tutorial" className="mt-4 text-blue-600 hover:underline">
          Kembali ke Daftar Tutorial
        </Link>
      </div>
    );
  }

  const parsedAlatBahan = parseContentString(tutorial.alatBahan);
  const parsedLangkah = parseContentString(tutorial.langkah);

  return (
    // Tambahkan pb-24 di sini
    <div className="flex flex-col min-h-screen bg-white px-4 py-6 pb-24">
      <Link href="/tutorial" className="flex items-center text-black font-semibold mb-4">
        <ArrowLeft size={20} className="mr-2" />
        Kembali ke Halaman Tutorial
      </Link>

      <div className="flex justify-center mb-4">
        <img
          src={tutorial.gambar || '/placeholder.jpg'}
          alt={tutorial.judul}
          className="w-64 h-64 object-cover rounded-lg"
        />
      </div>

      <h2 className="text-center text-lg font-bold mb-4">{tutorial.judul}</h2>
      <p className="text-center text-gray-600 mb-6">{tutorial.deskripsi}</p>

      {parsedAlatBahan.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Alat & Bahan :</h3>
          <ul className="text-sm text-gray-700 list-disc ml-6 mt-1">
            {parsedAlatBahan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {parsedLangkah.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold">Langkah-langkah :</h3>
          <ol className="text-sm text-gray-700 list-decimal ml-6 mt-1">
            {parsedLangkah.map((langkah, index) => (
              <li key={index}>{langkah}</li>
            ))}
          </ol>
        </div>
      )}

      {tutorial.video && (
        <div className="text-center mb-6">
          <a
            href={tutorial.video}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1B7865] text-white px-4 py-2 rounded-full text-sm flex justify-center items-center gap-1 mx-auto cursor-pointer hover:bg-[#1B7865]/90 transition font-bold"
          >
            Video Demonstrasi <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="mt-auto">
        <BottomNavbar />
      </div>
    </div>
  );
}