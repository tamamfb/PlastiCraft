'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Grid, Heart, Bookmark, Share, Loader2, LogOut, AlertTriangle } from 'lucide-react';
import BottomNavbar from '@/app/components/BottomNavbar';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  foto: string | null;
  _count: {
    creations: number;
    bookmarks: number;
  };
}

interface Post {
  id: number;
  gambar: string;
  judul: string;
  _count: {
    likes: number;
  };
}

const buildAbsoluteUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_BASE_URL || ''}${path}`;
};

const EditProfileModal = ({ user, onClose, onUpdateSuccess }: { user: UserProfile, onClose: () => void, onUpdateSuccess: (updatedUser: Partial<UserProfile>) => void }) => {
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(buildAbsoluteUrl(user.foto));
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
      if (!response.ok) throw new Error('Gagal menyimpan profil');
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Profil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">×</button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={previewUrl || `https://ui-avatars.com/api/?name=${editedName}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-[#3EB59D]" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#3EB59D] text-white p-2 rounded-full hover:bg-[#2a9d87] transition-colors cursor-pointer"><Edit size={14} /></button>
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
            <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer">Batal</button>
            <button onClick={handleSave} disabled={isSaving} className="flex-1 py-2 px-4 bg-[#3EB59D] text-white rounded-lg hover:bg-[#2a9d87] transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer">
              {isSaving ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoutConfirmationModal = ({ onConfirm, onCancel, isLoggingOut }: { onConfirm: () => void, onCancel: () => void, isLoggingOut: boolean }) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center transform transition-all shadow-xl">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Konfirmasi Keluar</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">Apakah Anda yakin ingin keluar dari akun Anda?</p>
                </div>
                <div className="mt-6 flex space-x-3">
                    <button onClick={onCancel} disabled={isLoggingOut} className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer">
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={isLoggingOut} className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer">
                        {isLoggingOut ? <Loader2 className="animate-spin" /> : 'Ya, Keluar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PostGridItem = ({ post, onPostClick }: { post: Post, onPostClick: (post: Post) => void }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = buildAbsoluteUrl(post.gambar);
    setImageUrl(url);
    setImageError(false);
    setIsLoading(true);
  }, [post.gambar]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <div 
      onClick={() => onPostClick(post)} 
      className="relative group cursor-pointer overflow-hidden rounded-sm md:rounded-xl bg-gray-200 aspect-square transition-all duration-300 hover:scale-105"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}
      
      {imageError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📷</div>
            <p className="text-xs text-gray-500">Gambar tidak dapat dimuat</p>
          </div>
        </div>
      ) : (
        imageUrl && (
          <img 
            src={imageUrl} 
            alt={post.judul} 
            className="w-full h-full object-cover" 
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )
      )}
      
      <div className="absolute inset-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <div className="flex items-center space-x-3 md:space-x-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1 md:space-x-2">
            <Heart className="fill-current" size={16} />
            <span className="font-semibold text-xs md:text-sm">{post._count.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userResponse, postsResponse, bookmarksResponse] = await Promise.all([
        fetch('/api/profil/user'),
        fetch('/api/profil/creations'),
        fetch('/api/profil/bookmarks'),
      ]);

      if (!userResponse.ok) throw new Error('Gagal memuat data pengguna');
      const userData: UserProfile = await userResponse.json();
      setUser(userData);

      if (!postsResponse.ok) throw new Error('Gagal memuat postingan');
      const postsData: Post[] = await postsResponse.json();
      setPosts(postsData);

      if (!bookmarksResponse.ok) throw new Error('Gagal memuat bookmark');
      const bookmarksData: Post[] = await bookmarksResponse.json();
      setBookmarkedPosts(bookmarksData);

    } catch (err: any) {
      if (err.message === 'Gagal memuat data pengguna') {
         router.push('/login');
      } else {
         setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleUpdateSuccess = (updatedUserData: Partial<UserProfile>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      fetchData(); 
      return { ...prevUser, ...updatedUserData };
    });
  };
  
  const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
          const response = await fetch('/api/auth/logout', { method: 'POST' });
          if (!response.ok) {
              throw new Error('Logout failed');
          }
          router.push('/login');
      } catch (error) {
          console.error(error);
          alert('Gagal untuk keluar, silakan coba lagi.');
          setIsLoggingOut(false);
      }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><Loader2 className="w-10 h-10 text-[#3EB59D] animate-spin" /></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!user) return <div className="flex items-center justify-center min-h-screen">User tidak ditemukan.</div>;

  const PostDetailModal = ({ post }: { post: Post }) => {
    const [postImageError, setPostImageError] = useState(false);
    const [postImageLoading, setPostImageLoading] = useState(true);
    const postImageUrl = buildAbsoluteUrl(post.gambar);
    const userImageUrl = buildAbsoluteUrl(user.foto);

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
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p>Gambar tidak dapat dimuat</p>
                  </div>
                ) : (
                  postImageUrl && (
                    <img 
                      src={postImageUrl} 
                      alt={post.judul} 
                      className="max-w-full max-h-full object-contain"
                      onLoad={() => setPostImageLoading(false)}
                      onError={() => {
                        setPostImageError(true);
                        setPostImageLoading(false);
                      }}
                      style={{ display: postImageLoading ? 'none' : 'block' }}
                    />
                  )
                )}
              </div>
              <div className="w-full md:w-80 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                  <img src={userImageUrl || `https://ui-avatars.com/api/?name=${user.name}`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-semibold text-sm">{user.name}</span>
                  </div>
                  <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer">×</button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                  <p className="text-sm text-gray-800">{post.judul}</p>
              </div>
              <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                      <button className="hover:text-red-500 transition-colors cursor-pointer"><Heart size={24} /></button>
                      <button className="hover:text-[#3EB59D] transition-colors cursor-pointer"><Share size={24} /></button>
                  </div>
                  <button className="hover:text-[#3EB59D] transition-colors cursor-pointer"><Bookmark size={24} /></button>
                  </div>
                  <div className="text-sm">
                  <p className="font-semibold mb-1">{post._count.likes} suka</p>
                  </div>
              </div>
              </div>
          </div>
        </div>
    );
  }
  
  const PostGrid = ({ postsToDisplay }: { postsToDisplay: Post[] }) => (
    postsToDisplay.length > 0 ? (
      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {postsToDisplay.map((post) => (
          <PostGridItem key={post.id} post={post} onPostClick={setSelectedPost} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 md:py-16">
        <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-[#3EB59D] to-[#2a9d87] rounded-full flex items-center justify-center">
          {activeTab === 'posts' ? <Grid size={24} className="text-white md:w-8 md:h-8" /> : <Bookmark size={24} className="text-white md:w-8 md:h-8" />}
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          {activeTab === 'posts' ? 'Belum Ada Postingan' : 'Anda belum menyimpan kreasi apa pun.'}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed text-sm md:text-base px-4 md:px-0">
          {activeTab === 'posts' ? 'Anda belum membagikan kreasi apa pun.' : 'Semua kreasi yang Anda simpan akan muncul di sini.'}
        </p>
      </div>
    )
  );

  const userImageUrl = buildAbsoluteUrl(user.foto);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onUpdateSuccess={handleUpdateSuccess} />}
      {selectedPost && <PostDetailModal post={selectedPost} />}
      {showLogoutModal && (
          <LogoutConfirmationModal 
              onConfirm={handleLogout} 
              onCancel={() => setShowLogoutModal(false)} 
              isLoggingOut={isLoggingOut} 
          />
      )}
      
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#3EB59D] to-[#2a9d87] p-1 mx-auto">
              <img src={userImageUrl || `https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&background=random`} alt="Profile" className="w-full h-full rounded-full object-cover bg-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">{user.name}</h1>
            <div className="mt-6 mb-6">
                <div className="font-bold text-xl md:text-2xl text-gray-800">{user._count.creations}</div>
                <div className="text-gray-500 text-sm md:text-base">Postingan</div>
            </div>
            <div className="w-full max-w-xs mx-auto flex flex-col items-center space-y-3">
              <button onClick={() => setShowEditModal(true)} className="bg-[#3EB59D] text-white px-8 py-2 rounded-lg hover:bg-[#2a9d87] transition-all duration-300 transform hover:scale-105 text-sm md:text-base w-full cursor-pointer">
                  Edit Profil
              </button>
              <button onClick={() => setShowLogoutModal(true)} className="flex items-center justify-center space-x-2 bg-rose-50 text-rose-500 px-8 py-2 rounded-lg hover:bg-rose-100 hover:text-rose-600 transition-all duration-300 transform hover:scale-105 text-sm md:text-base w-full cursor-pointer border border-rose-200">
                  <LogOut size={16} />
                  <span>Keluar</span>
              </button>
            </div>
        </div>
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100">
          <div className="relative border-b border-gray-200">
            <div className="flex">
                <button onClick={() => setActiveTab('posts')} className={`flex-1 flex justify-center items-center space-x-2 py-4 font-medium transition-colors duration-300 cursor-pointer ${activeTab === 'posts' ? 'text-[#3EB59D]' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Grid size={18} />
                    <span className="text-sm md:text-base">POSTINGAN</span>
                </button>
                <button onClick={() => setActiveTab('bookmarks')} className={`flex-1 flex justify-center items-center space-x-2 py-4 font-medium transition-colors duration-300 cursor-pointer ${activeTab === 'bookmarks' ? 'text-[#3EB59D]' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Bookmark size={18} />
                    <span className="text-sm md:text-base">BOOKMARK</span>
                </button>
            </div>
            <div
              className={`absolute bottom-0 h-[2px] bg-[#3EB59D] w-1/2 transition-transform duration-300 ease-in-out ${
                activeTab === 'posts' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
          </div>
          
          <div className="overflow-hidden">
            <div
              className={`flex transition-transform duration-300 ease-in-out ${
                activeTab === 'posts' ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="w-full flex-shrink-0 p-2 md:p-6">
                <PostGrid postsToDisplay={posts} />
              </div>
              <div className="w-full flex-shrink-0 p-2 md:p-6">
                <PostGrid postsToDisplay={bookmarkedPosts} />
              </div>
            </div>
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