// import { ArrowLeft, ExternalLink } from 'lucide-react';
// import Link from 'next/link';
// import BottomNavbar from '@/app/components/BottomNavbar';
// import prisma from '@/lib/prisma'; // Sesuaikan path jika berbeda

// // Helper function untuk parsing string dari database menjadi array of strings
// function parseContentString(text: string | null | undefined): string[] {
//   if (!text) return [];
//   text = text.trim();
//   if (text === '') return [];

//   try {
//     const parsed = JSON.parse(text);
//     if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
//       return parsed.map(item => item.trim()).filter(item => item !== '');
//     }
//   } catch (e) {
//     console.warn("Failed to parse as JSON:", e);
//   }

//   let items: string[] = [];
//   if (text.includes('\n')) {
//     items = text.split('\n');
//   } else if (text.includes(';')) {
//     items = text.split(';');
//   } else if (text.includes(',')) {
//       items = text.split(',');
//   } else {
//     items = [text];
//   }
  
//   return items.map(item => item.trim()).filter(item => item !== '');
// }


// interface KaryaDetailPageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function KaryaDetailPage({ params }: KaryaDetailPageProps) {
//   const karyaId = parseInt(params.id, 10);

//   if (isNaN(karyaId)) {
//     return (
//       <div className="flex flex-col min-h-screen bg-white items-center justify-center text-red-500">
//         <p>ID Karya tidak valid.</p>
//         <Link href="/karyalain" className="mt-4 text-blue-600 hover:underline">
//           Kembali ke Daftar Karya Lain
//         </Link>
//       </div>
//     );
//   }

//   const karya = await prisma.creation.findFirst({
//     where: {
//       id: karyaId,
//       type: 'KARYA',
//     },
//     select: {
//       id: true,
//       gambar: true,
//       judul: true,
//       deskripsi: true,    }
//   });

//   if (!karya) {
//     return (
//       <div className="flex flex-col min-h-screen bg-white items-center justify-center text-gray-600">
//         <p>Karya tidak ditemukan.</p>
//         <Link href="/karyalain" className="mt-4 text-blue-600 hover:underline">
//           Kembali ke Daftar Karya Lain
//         </Link>
//       </div>
//     );
//   }


//   return (
//     // Tambahkan pb-24 di sini
//     <div className="flex flex-col min-h-screen bg-white px-4 py-6 pb-24">
//       <Link href="/karyalain" className="flex items-center text-black font-semibold mb-4">
//         <ArrowLeft size={20} className="mr-2" />
//         Kembali ke Halaman Karya Lain
//       </Link>

//       <div className="flex justify-center mb-4">
//         <img
//           src={karya.gambar || '/placeholder.jpg'}
//           alt={karya.judul}
//           className="w-64 h-64 object-cover rounded-lg"
//         />
//       </div>

//       <h2 className="text-center text-lg font-bold mb-4">{karya.judul}</h2>
//         <p className="text-center text-gray-600 mb-6">{karya.deskripsi}</p>
      
//       <div className="mt-auto">
//         <BottomNavbar />
//       </div>
//     </div>
//   );
// }