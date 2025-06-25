'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavbar from '@/app/components/BottomNavbar';
import { CubeIcon, WrenchScrewdriverIcon, HeartIcon, GiftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Loader2, Heart, Bookmark } from 'lucide-react';

// Tipe data tidak berubah
interface Karya {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
  userId: number;
  _count: {
    likes: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface UserProfile {
  id: number;
  name: string;
  foto: string | null;
}

const buildAbsoluteUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_BASE_URL || ''}${url}`;
};

// --- MODAL YANG SUDAH DISERDERHANAKAN ---
// Modal ini sekarang "dumb", hanya menerima data dan fungsi dari parent
const PostDetailModal = ({ 
  post, 
  user, 
  onClose,
  onLike,
  onBookmark
}: { 
  post: Karya, 
  user: UserProfile | null, 
  onClose: () => void,
  onLike: () => void, // Prop fungsi baru
  onBookmark: () => void // Prop fungsi baru
}) => {
  const [postImageError, setPostImageError] = useState(false);
  const [postImageLoading, setPostImageLoading] = useState(true);

  const postImageUrl = buildAbsoluteUrl(post.gambar);
  const userImageUrl = buildAbsoluteUrl(user?.foto || '');

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 bg-black flex items-center justify-center relative">
          {postImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {postImageError ? (
            <div className="text-white text-center"><p>Gambar tidak dapat dimuat</p></div>
          ) : (
            <img
              src={postImageUrl}
              alt={post.judul}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setPostImageLoading(false)}
              onError={() => { setPostImageError(true); setPostImageLoading(false); }}
              style={{ display: postImageLoading ? 'none' : 'block' }}
            />
          )}
        </div>
        <div className="w-full md:w-80 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={userImageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'U'}`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-semibold text-sm">{user?.name || 'User'}</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">×</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="font-bold text-lg mb-2">{post.judul}</h2>
            <p className="text-sm text-gray-800">{post.deskripsi}</p>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <button onClick={onLike} className="flex items-center space-x-1.5 group cursor-pointer">
                  <Heart size={24} className={`group-hover:text-red-500 transition-colors ${post.isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                  <span className="font-semibold text-sm text-gray-700">{post._count.likes}</span>
                </button>
              </div>
              <button onClick={onBookmark} className="group cursor-pointer">
                <Bookmark size={24} className={`group-hover:text-[#3EB59D] transition-colors ${post.isBookmarked ? 'text-[#3EB59D] fill-current' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Komponen Kartu tidak berubah
const KaryaCard = ({ karya, onClick }: { karya: Karya, onClick?: () => void }) => {
  const imageUrl = buildAbsoluteUrl(karya.gambar);
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4">
      <img src={imageUrl} alt={karya.judul} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-800">{karya.judul}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{karya.deskripsi}</p>
        <button onClick={onClick} className="mt-2 inline-flex items-center text-sm font-semibold text-white bg-[#1B7865] py-1 px-3 rounded-full hover:bg-[#166966] cursor-pointer transition-colors">
          Lihat Karya <ChevronRightIcon className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};


// --- HALAMAN UTAMA DENGAN LOGIKA TERPUSAT ---
export default function KaryaLainPage() {
  const router = useRouter();
  const [karyaList, setKaryaList] = useState<Karya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBahan, setSelectedBahan] = useState('');
  const [selectedProduk, setSelectedProduk] = useState('');
  const [sortBy, setSortBy] = useState('newest'); 
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null); // Menggunakan ID, bukan objek
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

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
        if (!response.ok) throw new Error('Gagal memuat data karya');
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

  const handleShowDetail = async (karya: Karya) => {
    setSelectedPostId(karya.id); // Set ID post yang dipilih
    try {
      const response = await fetch(`/api/users/public-profile?userId=${karya.userId}`);
      if (!response.ok) throw new Error('Gagal memuat data user');
      const user: UserProfile = await response.json();
      setSelectedUser(user);
    } catch (err: any) {
      setSelectedUser(null);
    }
  };

  // --- LOGIKA BARU UNTUK LIKE & BOOKMARK ---
  const handleToggleLike = (karyaId: number) => {
    const originalList = [...karyaList];
    
    // Optimistic Update
    setKaryaList(prevList => prevList.map(karya => {
      if (karya.id === karyaId) {
        const isNowLiked = !karya.isLiked;
        return {
          ...karya,
          isLiked: isNowLiked,
          _count: {
            likes: isNowLiked ? karya._count.likes + 1 : karya._count.likes - 1
          }
        };
      }
      return karya;
    }));

    // Kirim request ke API
    const targetKarya = originalList.find(k => k.id === karyaId);
    if (!targetKarya) return;

    fetch(`/api/karya/${karyaId}/like`, {
      method: targetKarya.isLiked ? 'DELETE' : 'POST',
    }).catch(err => {
      console.error("Gagal update like:", err);
      setKaryaList(originalList); // Kembalikan ke state semula jika gagal
    });
  };

  const handleToggleBookmark = (karyaId: number) => {
    const originalList = [...karyaList];
    
    setKaryaList(prevList => prevList.map(karya => {
      if (karya.id === karyaId) {
        return { ...karya, isBookmarked: !karya.isBookmarked };
      }
      return karya;
    }));
    
    const targetKarya = originalList.find(k => k.id === karyaId);
    if (!targetKarya) return;

    fetch(`/api/karya/${karyaId}/bookmark`, {
      method: targetKarya.isBookmarked ? 'DELETE' : 'POST',
    }).catch(err => {
      console.error("Gagal update bookmark:", err);
      setKaryaList(originalList);
    });
  };
  
  // Ambil data post yang paling baru dari state `karyaList`
  const postToShowInModal = karyaList.find(k => k.id === selectedPostId);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-gray-800">Karya Lain</h1>
      </header>

      <main className="p-4">
        <div className="bg-[#3EB59D] text-white rounded-2xl p-4 pb-6 mb-6 text-center">
          <h2 className="text-xl font-bold mb-2">Pilih Bahan Daur Ulangmu</h2>
          <select value={selectedBahan} onChange={(e) => setSelectedBahan(e.target.value)} className="w-full bg-white text-gray-800 text-center rounded-lg p-1.5 appearance-none focus:outline-none focus:ring-2 focus:ring-white cursor-pointer">
            <option value="">Semua Bahan</option>
            <option value="1">Plastik</option>
            <option value="2">Kertas</option>
            <option value="3">Logam</option>
            <option value="4">Kain</option>
          </select>
        </div>

        <div className="flex justify-around items-start text-center mb-6">
          {kategoriProduk.map(cat => (
            <button key={cat.id} onClick={() => setSelectedProduk(prev => prev === cat.id ? '' : cat.id)} className={`cursor-pointer flex flex-col items-center space-y-1 transition-transform duration-200 w-20 ${selectedProduk === cat.id ? 'text-[#1B8380] scale-110' : 'text-gray-500'}`}>
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
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="cursor-pointer text-sm font-semibold bg-white border border-gray-300 rounded-lg py-1 pl-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1B8380]">
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
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-[#1B8380] animate-spin" /></div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : karyaList.length > 0 ? (
            <div className="space-y-4">
              {karyaList.map(karya => (
                <KaryaCard key={karya.id} karya={karya} onClick={() => handleShowDetail(karya)} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Tidak ada karya yang ditemukan.</p>
          )}
          
          {/* Render modal dengan data dan fungsi yang sudah diperbarui */}
          {postToShowInModal && (
            <PostDetailModal 
              post={postToShowInModal} 
              user={selectedUser} 
              onClose={() => setSelectedPostId(null)}
              onLike={() => handleToggleLike(postToShowInModal.id)}
              onBookmark={() => handleToggleBookmark(postToShowInModal.id)}
            />
          )}
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}