'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Edit, Grid, Heart, MessageCircle, Bookmark, MoreHorizontal, Settings, Share, Loader2 } from 'lucide-react';
import BottomNavbar from '@/app/components/BottomNavbar';

// Tipe data untuk data dari backend
interface UserProfile {
  id: number;
  name: string;
  email: string;
  foto: string | null;
  _count: {
    creations: number;
    followers: number;
    following: number;
  };
}

interface Post {
  id: number;
  gambar: string;
  judul: string;
  _count: {
    likes: number;
    comments: number;
  };
}

const EditProfileModal = ({ user, onClose, onUpdateSuccess }: { user: UserProfile, onClose: () => void, onUpdateSuccess: (updatedUser: Partial<UserProfile>) => void }) => {
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.foto);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append('name', editedName);
    formData.append('email', editedEmail);
    if (selectedFile) {
      formData.append('foto', selectedFile);
    }

    try {
      const response = await fetch('/api/profil/update', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan profil');
      }

      const updatedUser = await response.json();
      onUpdateSuccess(updatedUser);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Profil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">×</button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={previewUrl || `https://ui-avatars.com/api/?name=${editedName}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-[#3EB59D]" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#3EB59D] text-white p-2 rounded-full hover:bg-[#2a9d87] transition-colors">
                <Edit size={14} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EB59D] focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EB59D] focus:border-transparent" />
          </div>
          <div className="flex space-x-3 pt-4">
            <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">Batal</button>
            <button onClick={handleSave} disabled={isSaving} className="flex-1 py-2 px-4 bg-[#3EB59D] text-white rounded-lg hover:bg-[#2a9d87] transition-colors disabled:opacity-50 flex items-center justify-center">
              {isSaving ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // --- PERUBAHAN 1: Tambahkan state untuk cache key ---
  const [cacheKey, setCacheKey] = useState(Date.now());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userResponse, postsResponse] = await Promise.all([
        fetch('/api/profil/user'),
        fetch('/api/profil/creations')
      ]);

      if (!userResponse.ok) throw new Error('Gagal memuat data pengguna');
      const userData: UserProfile = await userResponse.json();
      setUser(userData);

      if (!postsResponse.ok) throw new Error('Gagal memuat postingan');
      const postsData: Post[] = await postsResponse.json();
      setPosts(postsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSuccess = (updatedUserData: Partial<UserProfile>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        ...updatedUserData,
      };
    });
    // --- PERUBAHAN 2: Perbarui cache key setiap kali update berhasil ---
    setCacheKey(Date.now());
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!user) return <div className="flex items-center justify-center min-h-screen">User tidak ditemukan.</div>;

  const PostDetailModal = ({ post }: { post: Post }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
            <div className="flex-1 bg-black flex items-center justify-center">
                <img src={post.gambar} alt={post.judul} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="w-full md:w-80 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src={user.foto ? `${user.foto}?key=${cacheKey}` : `https://ui-avatars.com/api/?name=${user.name}`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-semibold text-sm">{user.name}</span>
                    </div>
                    <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>
                <div className="flex-1 p-4">
                    <p className="text-sm text-gray-800">{post.judul}</p>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                            <button className="hover:text-red-500 transition-colors"><Heart size={24} /></button>
                            <button className="hover:text-[#3EB59D] transition-colors"><MessageCircle size={24} /></button>
                            <button className="hover:text-[#3EB59D] transition-colors"><Share size={24} /></button>
                        </div>
                        <button className="hover:text-[#3EB59D] transition-colors"><Bookmark size={24} /></button>
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold mb-1">{post._count.likes} suka</p>
                        <p className="text-gray-500">{post._count.comments} komentar</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
        {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onUpdateSuccess={handleUpdateSuccess} />}
        {selectedPost && <PostDetailModal post={selectedPost} />}
        
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
                <div className="flex items-center space-x-4">
                    <button className="hover:text-[#3EB59D] transition-colors"><Settings size={24} /></button>
                    <button className="hover:text-[#3EB59D] transition-colors"><MoreHorizontal size={24} /></button>
                </div>
            </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#3EB59D] to-[#2a9d87] p-1">
                            {/* --- PERUBAHAN 3: Tambahkan cache key ke URL gambar utama --- */}
                            <img src={user.foto ? `${user.foto}?key=${cacheKey}` : `https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}`} alt="Profile" className="w-full h-full rounded-full object-cover bg-white" />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                            <Edit className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-6">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">{user.name}</h1>
                            <button onClick={() => setShowEditModal(true)} className="bg-[#3EB59D] text-white px-4 md:px-6 py-2 rounded-lg hover:bg-[#2a9d87] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base">
                                Edit Profil
                            </button>
                        </div>
                        <div className="flex justify-center md:justify-start space-x-6 md:space-x-8 mb-4">
                            <div className="text-center">
                                <div className="font-bold text-lg md:text-xl text-gray-800">{posts.length}</div>
                                <div className="text-gray-500 text-xs md:text-sm">postingan</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-lg md:text-xl text-gray-800">{user._count.followers.toLocaleString()}</div>
                                <div className="text-gray-500 text-xs md:text-sm">pengikut</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-lg md:text-xl text-gray-800">{user._count.following}</div>
                                <div className="text-gray-500 text-xs md:text-sm">mengikuti</div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm md:text-base">{user.email}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center border-b border-gray-200">
                    <button onClick={() => setActiveTab('posts')} className={`flex items-center space-x-2 px-6 md:px-8 py-4 font-medium transition-all duration-300 ${activeTab === 'posts' ? 'text-[#3EB59D] border-b-2 border-[#3EB59D]' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Grid size={18} />
                        <span className="text-sm md:text-base">POSTINGAN</span>
                    </button>
                </div>
                <div className="p-2 md:p-6">
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1 md:gap-6">
                            {posts.map((post) => (
                                <div key={post.id} onClick={() => setSelectedPost(post)} className="relative group cursor-pointer overflow-hidden rounded-sm md:rounded-xl bg-gray-100 aspect-square hover:scale-105 transition-all duration-300 shadow-sm md:shadow-md hover:shadow-xl">
                                    <img src={post.gambar} alt={post.judul} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                        <div className="flex items-center space-x-3 md:space-x-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex items-center space-x-1 md:space-x-2">
                                                <Heart className="fill-current" size={16} />
                                                <span className="font-semibold text-xs md:text-sm">{post._count.likes}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 md:space-x-2">
                                                <MessageCircle className="fill-current" size={16} />
                                                <span className="font-semibold text-xs md:text-sm">{post._count.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 md:py-16">
                            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-[#3EB59D] to-[#2a9d87] rounded-full flex items-center justify-center">
                                <Grid size={24} className="text-white md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Belum Ada Postingan</h3>
                            <p className="text-gray-500 max-w-md mx-auto leading-relaxed text-sm md:text-base px-4 md:px-0">
                                Anda belum membagikan kreasi Anda. Mulai bagikan momen terbaik Anda dengan komunitas!
                            </p>
                            <button className="mt-4 md:mt-6 bg-[#3EB59D] text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#2a9d87] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base cursor-pointer">
                                Buat Postingan Pertama
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};


export default function Profil() {
  return (
    <div className="pb-16">
      <ProfilePage />
      <BottomNavbar />
    </div>
  );
}