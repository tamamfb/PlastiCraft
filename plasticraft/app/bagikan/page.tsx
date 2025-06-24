'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavbar from '@/app/components/BottomNavbar';
import { CloudArrowUpIcon, XCircleIcon, PlusCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

interface UserSession {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export default function BagikanPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const [uploadType, setUploadType] = useState('tutorial');
  const [title, setTitle] = useState('');
  const [categoryBahan, setCategoryBahan] = useState('');
  const [categoryProduk, setCategoryProduk] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [alatBahan, setAlatBahan] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (!response.ok) {
          throw new Error('Sesi tidak ditemukan');
        }
        const sessionData: UserSession = await response.json();
        setUser(sessionData);
        if (sessionData.role === 'USER') {
          setUploadType('karya');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserSession();
  }, [router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setImageFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };
  
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setVideoFile(selectedFile);
      setVideoPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    const fileInput = document.getElementById('video-upload') as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const createDynamicInputHandler = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => ({
    onChange: (index: number, value: string) => {
      const newState = [...state];
      newState[index] = value;
      setState(newState);
    },
    onAdd: () => setState([...state, '']),
    onRemove: (index: number) => {
      const newState = state.filter((_, i) => i !== index);
      setState(newState.length > 0 ? newState : ['']);
    },
  });

  const alatBahanHandlers = createDynamicInputHandler(alatBahan, setAlatBahan);
  const stepHandlers = createDynamicInputHandler(steps, setSteps);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile || !title || !categoryBahan || !categoryProduk) {
        alert('Mohon lengkapi semua field yang wajib diisi.');
        return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('type', user?.role === 'ADMIN' ? uploadType.toUpperCase() : 'KARYA');
    formData.append('judul', title);
    formData.append('categoryBahanId', categoryBahan);
    formData.append('categoryProdukId', categoryProduk);
    formData.append('deskripsi', description);
    formData.append('gambar', imageFile);

    if (uploadType === 'tutorial') {
        formData.append('alatBahan', JSON.stringify(alatBahan.filter(item => item.trim() !== '')));
        formData.append('langkah', JSON.stringify(steps.filter(item => item.trim() !== '')));
        if (videoFile) {
            formData.append('video', videoFile);
        }
    }

    try {
        const response = await fetch('/api/creation/upload', { // Anda perlu membuat API endpoint ini
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal mengunggah kreasi');
        }
        
        alert('Unggah berhasil!');
        router.push('/beranda');

    } catch (error: any) {
        console.error('Error submitting:', error);
        alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 text-[#1B8380] animate-spin" /></div>;
  }
  
  const activeTabClass = "bg-[#1B8380] text-white font-semibold py-3 px-10 rounded-full shadow-md";
  const inactiveTabClass = "bg-white text-gray-700 font-semibold py-3 px-10 rounded-full border border-gray-300";

  const renderImageUploader = () => (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center mb-6">
      {!imagePreview ? (
        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
          <CloudArrowUpIcon className="h-12 w-12 text-[#1B8380] mx-auto mb-2" />
          <p className="text-gray-700 font-semibold text-lg">Upload Foto Hasil Karya</p>
          <input id="image-upload" name="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} required/>
        </label>
      ) : (
        <div className="relative">
          <img src={imagePreview} alt="Pratinjau Unggahan" className="w-full h-auto max-h-80 object-contain rounded-lg" />
          <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100" aria-label="Hapus gambar"><XCircleIcon className="h-6 w-6" /></button>
        </div>
      )}
    </div>
  );

  const renderTutorialFields = () => (
    <>
      <div className="space-y-2">
        <label className="text-gray-800 font-semibold">Alat & Bahan</label>
        {alatBahan.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input type="text" value={item} onChange={(e) => alatBahanHandlers.onChange(index, e.target.value)} className="flex-grow bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none" placeholder={`Alat atau bahan ${index + 1}`}/>
            {alatBahan.length > 1 && (<button type="button" onClick={() => alatBahanHandlers.onRemove(index)} aria-label="Hapus item"><XCircleIcon className="h-6 w-6 text-red-500" /></button>)}
          </div>
        ))}
        <button type="button" onClick={alatBahanHandlers.onAdd} className="flex items-center space-x-2 text-[#1B8380] font-semibold mt-3 hover:text-[#166966]"><PlusCircleIcon className="h-6 w-6" /><span>Tambah Alat/Bahan</span></button>
      </div>

      <div className="space-y-2">
        <label className="text-gray-800 font-semibold">Langkah-langkah</label>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-500 font-bold">{index + 1}.</span>
            <input type="text" value={step} onChange={(e) => stepHandlers.onChange(index, e.target.value)} className="flex-grow bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none" placeholder={`Deskripsi langkah ${index + 1}`}/>
            {steps.length > 1 && (<button type="button" onClick={() => stepHandlers.onRemove(index)} aria-label="Hapus langkah"><XCircleIcon className="h-6 w-6 text-red-500" /></button>)}
          </div>
        ))}
        <button type="button" onClick={stepHandlers.onAdd} className="flex items-center space-x-2 text-[#1B8380] font-semibold mt-3 hover:text-[#166966]"><PlusCircleIcon className="h-6 w-6" /><span>Tambah Langkah</span></button>
      </div>

      <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center mt-6">
        {!videoPreview ? (
          <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
            <VideoCameraIcon className="h-12 w-12 text-[#1B8380] mx-auto mb-2" />
            <p className="text-gray-700 font-semibold text-lg">Upload Video Tutorial</p>
            <p className="text-sm text-gray-500">(Opsional)</p>
            <input id="video-upload" name="video-upload" type="file" accept="video/*" className="sr-only" onChange={handleVideoChange} />
          </label>
        ) : (
          <div className="relative">
            <video src={videoPreview} controls className="w-full h-auto max-h-80 rounded-lg" />
            <button type="button" onClick={handleRemoveVideo} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100" aria-label="Hapus video"><XCircleIcon className="h-6 w-6" /></button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-white min-h-screen font-sans pb-24">
      <form onSubmit={handleSubmit} className="p-6">
        {user?.role === 'ADMIN' && (
          <div className="flex justify-center space-x-2 mb-6">
            <button type="button" onClick={() => setUploadType('tutorial')} className={uploadType === 'tutorial' ? activeTabClass : inactiveTabClass}>Tutorial</button>
            <button type="button" onClick={() => setUploadType('karya')} className={uploadType === 'karya' ? activeTabClass : inactiveTabClass}>Karya</button>
          </div>
        )}

        {renderImageUploader()}

        <div className="space-y-6">
          <div className="relative">
            <label htmlFor="categoryBahan" className="text-gray-800 font-semibold">Kategori Bahan</label>
            <select id="categoryBahan" name="categoryBahan" value={categoryBahan} onChange={(e) => setCategoryBahan(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none" required>
              <option value="" disabled>Pilih kategori bahan</option>
              {/* Anda harus mengisi ini dari database */}
              <option value="1">Plastik</option><option value="2">Kertas</option>
            </select>
          </div>
          
          <div className="relative">
            <label htmlFor="categoryProduk" className="text-gray-800 font-semibold">Kategori Produk</label>
            <select id="categoryProduk" name="categoryProduk" value={categoryProduk} onChange={(e) => setCategoryProduk(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none" required>
              <option value="" disabled>Pilih kategori produk</option>
               {/* Anda harus mengisi ini dari database */}
              <option value="1">Dekorasi</option><option value="2">Fashion</option>
            </select>
          </div>

          <div>
            <label htmlFor="title" className="text-gray-800 font-semibold">Judul</label>
            <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Tulis judul karyamu di sini" required/>
          </div>
          
          <div>
            <label htmlFor="description" className="text-gray-800 font-semibold">Deskripsi</label>
            <textarea name="description" id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Tambahkan deskripsi singkat di sini"></textarea>
          </div>

          {(user?.role === 'ADMIN' && uploadType === 'tutorial') && renderTutorialFields()}
        </div>
        
        <div className="px-0 pt-8">
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#1B7865] text-white font-bold py-4 rounded-full text-lg shadow-lg hover:bg-[#166966] transition-all duration-300 disabled:opacity-50 flex items-center justify-center">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Unggah'}
          </button>
        </div>
      </form>

      <div className="mt-auto"><BottomNavbar /></div>
    </div>
  );
}