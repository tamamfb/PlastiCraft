'use client';

import React, { useState } from 'react';
import { Edit, Grid, Heart, MessageCircle, Bookmark, MoreHorizontal, Settings, Share } from 'lucide-react';
import BottomNavbar from '@/app/components/BottomNavbar';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Sample user data
  const user = {
    id: 1,
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    posts: 12,
    followers: 1234,
    following: 567
  };

  // Sample posts data - empty for demonstration
  const posts = [
    {
      id: 1,
      gambar: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop",
      judul: "Sunset di Pantai",
      likes: 245,
      comments: 18
    },
    {
      id: 2,
      gambar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      judul: "Pemandangan Gunung",
      likes: 189,
      comments: 12
    },
    {
      id: 3,
      gambar: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop",
      judul: "Kota di Malam Hari",
      likes: 324,
      comments: 25
    }
  ];

  const EditProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Profil</h2>
          <button 
            onClick={() => setShowEditModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src={user.foto} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-[#3EB59D]"
              />
              <button className="absolute bottom-0 right-0 bg-[#3EB59D] text-white p-2 rounded-full hover:bg-[#2a9d87] transition-colors">
                <Edit size={14} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <input 
              type="text" 
              defaultValue={user.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EB59D] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              defaultValue={user.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EB59D] focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              onClick={() => setShowEditModal(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={() => setShowEditModal(false)}
              className="flex-1 py-2 px-4 bg-[#3EB59D] text-white rounded-lg hover:bg-[#2a9d87] transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PostDetailModal = ({ post }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
        <div className="flex-1 bg-black flex items-center justify-center">
          <img 
            src={post.gambar} 
            alt={post.judul}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        <div className="w-80 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={user.foto} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold text-sm">{user.name}</span>
            </div>
            <button 
              onClick={() => setSelectedPost(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 p-4">
            <p className="text-sm text-gray-800">{post.judul}</p>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <button className="hover:text-red-500 transition-colors">
                  <Heart size={24} />
                </button>
                <button className="hover:text-[#3EB59D] transition-colors">
                  <MessageCircle size={24} />
                </button>
                <button className="hover:text-[#3EB59D] transition-colors">
                  <Share size={24} />
                </button>
              </div>
              <button className="hover:text-[#3EB59D] transition-colors">
                <Bookmark size={24} />
              </button>
            </div>
            
            <div className="text-sm">
              <p className="font-semibold mb-1">{post.likes} suka</p>
              <p className="text-gray-500">{post.comments} komentar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
          <div className="flex items-center space-x-4">
            <button className="hover:text-[#3EB59D] transition-colors">
              <Settings size={24} />
            </button>
            <button className="hover:text-[#3EB59D] transition-colors">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3EB59D] to-[#2a9d87] p-1">
                <img 
                  src={user.foto} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                <Edit className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">{user.name}</h1>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="bg-[#3EB59D] text-white px-6 py-2 rounded-lg hover:bg-[#2a9d87] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Edit Profil
                </button>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-800">{posts.length}</div>
                  <div className="text-gray-500 text-sm">postingan</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-800">{user.followers.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm">pengikut</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-800">{user.following}</div>
                  <div className="text-gray-500 text-sm">mengikuti</div>
                </div>
              </div>

              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100">
          <div className="flex justify-center border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex items-center space-x-2 px-8 py-4 font-medium transition-all duration-300 ${
                activeTab === 'posts' 
                  ? 'text-[#3EB59D] border-b-2 border-[#3EB59D]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid size={20} />
              <span>POSTINGAN</span>
            </button>
          </div>

          {/* Posts Grid */}
          <div className="p-6">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100 aspect-square hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    <img 
                      src={post.gambar} 
                      alt={post.judul}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <div className="flex items-center space-x-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center space-x-2">
                          <Heart className="fill-current" size={20} />
                          <span className="font-semibold">{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="fill-current" size={20} />
                          <span className="font-semibold">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#3EB59D] to-[#2a9d87] rounded-full flex items-center justify-center">
                  <Grid size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Postingan</h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  Anda belum membagikan kreasi Anda. Mulai bagikan momen terbaik Anda dengan komunitas!
                </p>
                <button className="mt-6 bg-[#3EB59D] text-white px-8 py-3 rounded-lg hover:bg-[#2a9d87] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Buat Postingan Pertama
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && <EditProfileModal />}
      {selectedPost && <PostDetailModal post={selectedPost} />}
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