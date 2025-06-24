'use client';

import React, { useState } from 'react';
import BottomNavbar from '@/app/components/BottomNavbar';
import { CloudArrowUpIcon, XCircleIcon, PlusCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

// Ini adalah komponen utama halaman Anda.
// Simpan kode ini di `app/bagikan/page.js`.
export default function BagikanPage() {
  // State untuk melacak tipe unggahan: 'tutorial' atau 'karya'
  const [uploadType, setUploadType] = useState('tutorial');

  // State untuk form
  const [title, setTitle] = useState('');
  const [materialCategory, setMaterialCategory] = useState(''); // Mengganti nama 'category' agar lebih jelas
  const [productCategory, setProductCategory] = useState(''); // State BARU untuk kategori produk
  const [description, setDescription] = useState('');

  // State untuk file gambar utama
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // State untuk file video (khusus tutorial)
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // State untuk input dinamis
  const [tools, setTools] = useState<string[]>(['']); // Array untuk alat & bahan
  const [steps, setSteps] = useState<string[]>(['']); // Array untuk langkah-langkah

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  // Handler untuk unggah gambar utama
  const handleImageChange = (event: FileChangeEvent): void => {
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
  
  // Handler untuk unggah video
  const handleVideoChange = (event: FileChangeEvent): void => {
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

  // --- Handlers untuk Input Dinamis ---
  const createDynamicInputHandler = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    return {
      onChange: (index: number, value: string) => {
        const newState = [...state];
        newState[index] = value;
        setState(newState);
      },
      onAdd: () => setState([...state, '']),
      onRemove: (index: number) => {
        const newState = state.filter((_, i) => i !== index);
        setState(newState);
      },
    };
  };

  const toolHandlers = createDynamicInputHandler(tools, setTools);
  const stepHandlers = createDynamicInputHandler(steps, setSteps);
  // --- Akhir Handlers Input Dinamis ---

  const activeTabClass = "bg-[#1B8380] text-white font-semibold py-3 px-10 rounded-full shadow-md";
  const inactiveTabClass = "bg-white text-gray-700 font-semibold py-3 px-10 rounded-full border border-gray-300";

  return (
    <div className="bg-white min-h-screen font-sans pb-24">
      <div className="p-6">
        {/* Pilihan Tipe Unggahan */}
        <div className="flex justify-center space-x-2 mb-6">
          <button onClick={() => setUploadType('tutorial')} className={uploadType === 'tutorial' ? activeTabClass : inactiveTabClass}>Tutorial</button>
          <button onClick={() => setUploadType('karya')} className={uploadType === 'karya' ? activeTabClass : inactiveTabClass}>Karya</button>
        </div>

        {/* Unggah Gambar Utama */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center mb-6">
          {!imagePreview ? (
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
              <CloudArrowUpIcon className="h-12 w-12 text-[#1B8380] mx-auto mb-2" />
              <p className="text-gray-700 font-semibold text-lg">Upload Foto Hasil Karya</p>
              <input id="image-upload" name="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative">
              <img src={imagePreview} alt="Pratinjau Unggahan" className="w-full h-auto max-h-80 object-contain rounded-lg" />
              <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100" aria-label="Hapus gambar"><XCircleIcon className="h-6 w-6" /></button>
            </div>
          )}
        </div>

        {/* Bagian Form */}
        <div className="space-y-6">
          {/* Field Umum */}
          {/* Dropdown Kategori Bahan */}
          <div className="relative">
             <label htmlFor="material-category" className="text-gray-800 font-semibold">Kategori Bahan</label>
             <select id="material-category" name="material-category" value={materialCategory} onChange={(e) => setMaterialCategory(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none">
               <option value="" disabled>Pilih kategori bahan</option>
               <option value="plastik">Plastik</option>
               <option value="kertas">Kertas</option>
               <option value="kaca">Kaca</option>
               <option value="logam">Logam</option>
               <option value="kain">Kain</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
          </div>

          {/* Dropdown Kategori Produk (BARU) */}
          <div className="relative">
             <label htmlFor="product-category" className="text-gray-800 font-semibold">Kategori Produk</label>
             <select id="product-category" name="product-category" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none">
               <option value="" disabled>Pilih kategori produk</option>
               <option value="dekorasi">Dekorasi Rumah</option>
               <option value="fashion">Aksesoris Fashion</option>
               <option value="peralatan">Peralatan Rumah Tangga</option>
               <option value="mainan">Mainan</option>
               <option value="seni">Seni & Kerajinan</option>
               <option value="lainnya">Lainnya</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
          </div>

          <div>
            <label htmlFor="title" className="text-gray-800 font-semibold">Judul</label>
            <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Tulis judul karyamu di sini"/>
          </div>
          <div>
            <label htmlFor="description" className="text-gray-800 font-semibold">Deskripsi</label>
            <textarea name="description" id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors" placeholder="Jelaskan secara singkat tentang karyamu"></textarea>
          </div>

          {/* Render Form Khusus Tutorial */}
          {uploadType === 'tutorial' && (
            <>
              {/* Input Alat & Bahan (Poin-poin) */}
              <div className="space-y-2">
                <label className="text-gray-800 font-semibold">Alat & Bahan</label>
                {tools.map((tool, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="text" value={tool} onChange={(e) => toolHandlers.onChange(index, e.target.value)} className="flex-grow bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none" placeholder={`Alat atau bahan ${index + 1}`}/>
                    {tools.length > 1 && (<button onClick={() => toolHandlers.onRemove(index)} aria-label="Hapus alat/bahan"><XCircleIcon className="h-6 w-6 text-red-500" /></button>)}
                  </div>
                ))}
                <button onClick={toolHandlers.onAdd} className="flex items-center space-x-2 text-[#1B8380] font-semibold mt-3 hover:text-[#166966]"><PlusCircleIcon className="h-6 w-6" /><span>Tambah Alat/Bahan</span></button>
              </div>

              {/* Input Langkah-langkah (Poin-poin) */}
              <div className="space-y-2">
                <label className="text-gray-800 font-semibold">Langkah-langkah</label>
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500 font-bold">{index + 1}.</span>
                    <input type="text" value={step} onChange={(e) => stepHandlers.onChange(index, e.target.value)} className="flex-grow bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none" placeholder={`Deskripsi langkah ${index + 1}`}/>
                    {steps.length > 1 && (<button onClick={() => stepHandlers.onRemove(index)} aria-label="Hapus langkah"><XCircleIcon className="h-6 w-6 text-red-500" /></button>)}
                  </div>
                ))}
                <button onClick={stepHandlers.onAdd} className="flex items-center space-x-2 text-[#1B8380] font-semibold mt-3 hover:text-[#166966]"><PlusCircleIcon className="h-6 w-6" /><span>Tambah Langkah</span></button>
              </div>

              {/* Unggah Video Tutorial */}
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
                        <button onClick={handleRemoveVideo} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100" aria-label="Hapus video"><XCircleIcon className="h-6 w-6" /></button>
                    </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Tombol Unggah */}
      <div className="px-6 mt-8">
        <button type="button" className="w-full bg-[#1B7865] text-white font-bold py-4 rounded-full text-lg shadow-lg hover:bg-[#166966] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B8380]">Unggah</button>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto"><BottomNavbar /></div>
    </div>
  );
}