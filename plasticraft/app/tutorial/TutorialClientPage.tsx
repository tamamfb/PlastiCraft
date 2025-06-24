'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

// Definisikan tipe untuk data tutorial yang diterima
interface TutorialItem {
  id: number;
  gambar: string;
  judul: string;
  deskripsi: string;
  tanggal: Date;
  categoryProduk?: { nama: string }; // Opsional, jika di-include
  categoryBahan?: { nama: string }; // Opsional, jika di-include
}

interface TutorialClientPageProps {
  initialTutorials: TutorialItem[];
}

export default function TutorialClientPage({ initialTutorials }: TutorialClientPageProps) {
  const [tutorials, setTutorials] = useState<TutorialItem[]>(initialTutorials);
  const [sort, setSort] = useState('Terbaru'); // Ubah default sort
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori'); // Default "Semua Kategori"

  // Ambil daftar kategori unik dari data tutorial atau sediakan statis jika tidak banyak
  // Untuk contoh ini, saya akan tetap pakai statis agar dropdown filter berjalan
  // Namun di aplikasi nyata, Anda mungkin ingin mengambil kategori dari DB juga
  const categories = ['Semua Kategori', 'Mainan', 'Peralatan Rumah Tangga', 'Aksesoris', 'Dekorasi']; // Sesuaikan dengan categoryProduk/Bahan di DB

  // Filter dan Sort logika
  useEffect(() => {
    let filtered = [...initialTutorials];

    // Filter berdasarkan kategori
    if (selectedCategory !== 'Semua Kategori') {
      filtered = filtered.filter(tutorial => 
        (tutorial.categoryProduk && tutorial.categoryProduk.nama === selectedCategory) ||
        (tutorial.categoryBahan && tutorial.categoryBahan.nama === selectedCategory)
      );
    }

    // Sortir
    if (sort === 'Terbaru') {
      filtered.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    } else if (sort === 'Judul (A-Z)') { // Ubah 'Nama' menjadi 'Judul (A-Z)' agar lebih jelas
      filtered.sort((a, b) => a.judul.localeCompare(b.judul));
    }

    setTutorials(filtered);
  }, [selectedCategory, sort, initialTutorials]); // Dependensi yang benar

  return (
    <>
      {/* Filter Section */}
      <div className="flex items-center gap-2 mb-4 relative">
        {/* Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#1B7865] text-white text-sm font-medium cursor-pointer hover:bg-[#1B7865]/90 transition"
        >
          <Filter size={16} /> Filter
        </button>

        {/* Selected Category Tag */}
        <span className="inline-block px-3 py-1 rounded-full bg-[#1B7865] text-white text-sm">
          {selectedCategory}
        </span>

        {/* Dropdown Filter */}
        {showFilter && (
          <div className="absolute top-12 left-0 z-10 w-60 bg-white border rounded-lg shadow-lg">
            <ul className="text-sm text-gray-700">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#1B7865]/10 ${
                    selectedCategory === category ? 'bg-[#1B7865]/20 font-semibold' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowFilter(false);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sort Section */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold">Urut Berdasarkan</span>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border bg-[#1B7865]/10 text-[#1B7865] rounded px-2 py-1 text-sm"
          >
            <option value="Terbaru">Waktu (Terbaru)</option>
            <option value="Judul (A-Z)">Judul (A-Z)</option>
          </select>
          <ArrowUpDown size={18} />
        </div>
      </div>

      {/* Tutorial Cards */}
      <div className="space-y-4">
        {tutorials.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Tidak ada tutorial yang tersedia untuk kategori ini.</p>
        ) : (
          tutorials.map((tutorial) => (
            <div key={tutorial.id} className="flex p-3 border rounded-xl shadow-sm">
              <img
                src={tutorial.gambar || '/placeholder.jpg'} // Gunakan gambar dari DB, fallback jika null
                alt={tutorial.judul}
                className="w-20 h-20 rounded-lg object-cover mr-3"
              />
              <div className="flex-1">
                <h2 className="font-bold text-sm">{tutorial.judul}</h2>
                <p className="text-xs text-gray-600 line-clamp-2">{tutorial.deskripsi}</p>
                <Link href={`/tutorial/${tutorial.id}`}> {/* Link ke halaman detail dinamis */}
                  <button className="mt-2 bg-[#1B7865] text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-[#1B7865]/90 transition">
                    Tutorial →
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}