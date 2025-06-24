'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavbar from '@/app/components/BottomNavbar';
import { CloudArrowUpIcon, XCircleIcon, PlusCircleIcon, VideoCameraIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

interface UserSession {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

// Komponen Popup/Modal baru yang serbaguna
const StatusPopup = ({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}) => {
  const
 
iconContainerClass = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
  }[type];

  const iconClass = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }[type];

  const buttonClass = {
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  }[type];

  const IconComponent = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
  }[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl transform transition-all">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconContainerClass}`}>
          <IconComponent className={`h-8 w-8 ${iconClass}`} />
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
          {type === 'success' ? 'Berhasil' : type === 'error' ? 'Terjadi Kesalahan' : 'Informasi'}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};


export default function BagikanPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // --- State untuk Form ---
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

  // --- State untuk Popup/Modal ---
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
    onCloseAction?: () => void;
  }>({ isOpen: false, type: 'info', message: '' });

  
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (!response.ok) throw new Error('Sesi tidak ditemukan');
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

  // --- Semua handler (handleImageChange, dll) tetap sama ---
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
    const fileInput2 = document.getElementById('image-upload-2') as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
    if (fileInput2) fileInput2.value = "";
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

  // --- Fungsi handleSubmit yang diperbarui ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile || !title || !categoryBahan || !categoryProduk) {
        setPopup({ isOpen: true, type: 'info', message: 'Mohon lengkapi semua field yang wajib diisi.' });
        return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    const finalUploadType = user?.role === 'ADMIN' ? uploadType : 'karya';
    formData.append('type', finalUploadType.toUpperCase());
    formData.append('judul', title);
    formData.append('categoryBahanId', categoryBahan);
    formData.append('categoryProdukId', categoryProduk);
    formData.append('deskripsi', description);
    formData.append('gambar', imageFile);

    if (finalUploadType === 'tutorial') {
        formData.append('alatBahan', JSON.stringify(alatBahan.filter(item => item.trim() !== '')));
        formData.append('langkah', JSON.stringify(steps.filter(item => item.trim() !== '')));
        if (videoFile) {
            formData.append('video', videoFile);
        }
    }

    try {
        const response = await fetch('/api/creation/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal mengunggah kreasi');
        }
        
        setPopup({
            isOpen: true,
            type: 'success',
            message: 'Kreasi Anda berhasil diunggah!',
            onCloseAction: () => router.push('/beranda'),
        });

    } catch (error: any) {
        console.error('Error submitting:', error);
        setPopup({ isOpen: true, type: 'error', message: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    if (popup.onCloseAction) {
      popup.onCloseAction();
    }
    setPopup({ isOpen: false, type: 'info', message: '' });
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 text-[#1B8380] animate-spin" /></div>;
  }
  
  const activeTabClass = "bg-[#1B8380] text-white font-semibold py-3 px-10 rounded-full shadow-md cursor-pointer";
  const inactiveTabClass = "bg-white text-gray-700 font-semibold py-3 px-10 rounded-full border border-gray-300 cursor-pointer";

  // --- Render function untuk form tetap sama ---
  const renderKaryaForm = () => (
    <div className='space-y-6'>
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center mb-6">
        {!imagePreview ? (
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
            <CloudArrowUpIcon className="h-12 w-12 text-[#1B8380] mx-auto mb-2" />
            <p className="text-gray-700 font-semibold text-lg">Upload Foto Hasil Karya</p>
            <input id="image-upload" name="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} required={uploadType === 'karya'}/>
          </label>
        ) : (
          <div className="relative">
            <img src={imagePreview} alt="Pratinjau Unggahan" className="w-full h-auto max-h-80 object-contain rounded-lg" />
            <button type="button" onClick={handleRemoveImage} className="cursor-pointer absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100" aria-label="Hapus gambar"><XCircleIcon className="h-6 w-6" /></button>
          </div>
        )}
      </div>
      <div className="relative">
        <label htmlFor="categoryBahan-karya" className="text-gray-800 font-semibold">Kategori Bahan</label>
        <select id="categoryBahan-karya" value={categoryBahan} onChange={(e) => setCategoryBahan(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none" required>
          <option value="" disabled>Pilih kategori bahan</option>
          <option value="1">Plastik</option><option value="2">Kertas</option><option value="3">Logam</option><option value="4">Kain</option>
        </select>
      </div>
      <div className="relative">
        <label htmlFor="categoryProduk-karya" className="text-gray-800 font-semibold">Kategori Produk</label>
        <select id="categoryProduk-karya" value={categoryProduk} onChange={(e) => setCategoryProduk(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none" required>
          <option value="" disabled>Pilih kategori produk</option>
          <option value="1">Dekorasi</option><option value="2">Aksesoris</option><option value="3">Mainan</option><option value="4">Peralatan Rumah Tangga</option>
        </select>
      </div>
      <div>
        <label htmlFor="title-karya" className="text-gray-800 font-semibold">Judul</label>
        <input type="text" id="title-karya" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Tulis judul karyamu di sini" required/>
      </div>
      <div>
        <label htmlFor="description-karya" className="text-gray-800 font-semibold">Deskripsi</label>
        <textarea id="description-karya" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Tambahkan deskripsi singkat di sini"></textarea>
      </div>
    </div>
  );

  const renderTutorialForm = () => (
     <div className='space-y-6'>
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center mb-6">
        {!imagePreview ? (
          <label htmlFor="image-upload-2" className="cursor-pointer flex flex-col items-center justify-center p-4">
            <CloudArrowUpIcon className="h-12 w-12 text-[#1B8380] mx-auto mb-2" />
            <p className="text-gray-700 font-semibold text-lg">Upload Foto Hasil Tutorial</p>
            <input id="image-upload-2" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} required={uploadType === 'tutorial'}/>
          </label>
        ) : (
          <div className="relative">
            <img src={imagePreview} alt="Pratinjau Unggahan" className="w-full h-auto max-h-80 object-contain rounded-lg" />
            <button type="button" onClick={handleRemoveImage} className="cursor-pointer absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100" aria-label="Hapus gambar"><XCircleIcon className="h-6 w-6" /></button>
          </div>
        )}
      </div>
       <div className="relative">
        <label htmlFor="categoryBahan-tutorial" className="text-gray-800 font-semibold">Kategori Bahan</label>
        <select id="categoryBahan-tutorial" value={categoryBahan} onChange={(e) => setCategoryBahan(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none" required>
          <option value="" disabled>Pilih kategori bahan</option>
          <option value="1">Plastik</option><option value="2">Kertas</option><option value="3">Logam</option><option value="4">Kain</option>
        </select>
      </div>
      <div className="relative">
        <label htmlFor="categoryProduk-tutorial" className="text-gray-800 font-semibold">Kategori Produk</label>
        <select id="categoryProduk-tutorial" value={categoryProduk} onChange={(e) => setCategoryProduk(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none" required>
          <option value="" disabled>Pilih kategori produk</option>
          <option value="1">Dekorasi</option><option value="2">Aksesoris</option><option value="3">Mainan</option><option value="4">Peralatan Rumah Tangga</option>
        </select>
      </div>
       <div>
        <label htmlFor="title-tutorial" className="text-gray-800 font-semibold">Judul</label>
        <input type="text" id="title-tutorial" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Tulis judul tutorialmu di sini" required/>
      </div>
       <div>
        <label htmlFor="description-tutorial" className="text-gray-800 font-semibold">Deskripsi</label>
        <textarea id="description-tutorial" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Tambahkan deskripsi singkat tutorial"></textarea>
      </div>
      <div className="space-y-2">
        <label className="text-gray-800 font-semibold">Alat & Bahan</label>
        {alatBahan.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input type="text" value={item} onChange={(e) => alatBahanHandlers.onChange(index, e.target.value)} className="flex-grow bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none" placeholder={`Alat atau bahan ${index + 1}`}/>
            {alatBahan.length > 1 && (<button type="button" onClick={() => alatBahanHandlers.onRemove(index)} className="cursor-pointer" aria-label="Hapus item"><XCircleIcon className="h-6 w-6 text-red-500" /></button>)}
          </div>
        ))}
        <button type="button" onClick={alatBahanHandlers.onAdd} className="cursor-pointer flex items-center space-x-2 text-[#1B8380] font-semibold mt-3 hover:text-[#166966]"><PlusCircleIcon className="h-6 w-6" /><span>Tambah Alat/Bahan</span></button>
      </div>
      <div className="space-y-2">
        <label className="text-gray-800 font-semibold">Langkah-langkah</label>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-500 font-bold">{index + 1}.</span>
            <input type="text" value={step} onChange={(e) => stepHandlers.onChange(index, e.target.value)} className="flex-grow bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none" placeholder={`Deskripsi langkah ${index + 1}`}/>
            {steps.length > 1 && (<button type="button" onClick={() => stepHandlers.onRemove(index)} className="cursor-pointer" aria-label="Hapus langkah"><XCircleIcon className="h-6 w-6 text-red-500" /></button>)}
          </div>
        ))}
        <button type="button" onClick={stepHandlers.onAdd} className="cursor-pointer flex items-center space-x-2 text-[#1B8380] font-semibold mt-3 hover:text-[#166966]"><PlusCircleIcon className="h-6 w-6" /><span>Tambah Langkah</span></button>
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
            <button type="button" onClick={handleRemoveVideo} className="cursor-pointer absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100" aria-label="Hapus video"><XCircleIcon className="h-6 w-6" /></button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans pb-24">
      {popup.isOpen && <StatusPopup type={popup.type} message={popup.message} onClose={closePopup} />}
      
      <form onSubmit={handleSubmit} className="p-6">
        {user?.role === 'ADMIN' && (
          <div className="flex justify-center space-x-2 mb-6">
            <button type="button" onClick={() => setUploadType('tutorial')} className={uploadType === 'tutorial' ? activeTabClass : inactiveTabClass}>Tutorial</button>
            <button type="button" onClick={() => setUploadType('karya')} className={uploadType === 'karya' ? activeTabClass : inactiveTabClass}>Karya</button>
          </div>
        )}

        <div className="overflow-hidden">
          <div className={`flex transition-transform duration-500 ease-in-out ${user?.role === 'ADMIN' && uploadType === 'karya' ? '-translate-x-full' : 'translate-x-0'}`}>
            <div className="w-full flex-shrink-0 pr-2">
              {user?.role === 'ADMIN' ? renderTutorialForm() : renderKaryaForm()}
            </div>
            <div className="w-full flex-shrink-0 pl-2">
              {renderKaryaForm()}
            </div>
          </div>
        </div>

        <div className="px-0 pt-8">
          <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full bg-[#1B7865] text-white font-bold py-4 rounded-full text-lg shadow-lg hover:bg-[#166966] transition-all duration-300 disabled:opacity-50 flex items-center justify-center">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Unggah'}
          </button>
        </div>
      </form>

      <div className="mt-auto"><BottomNavbar /></div>
    </div>
  );
}