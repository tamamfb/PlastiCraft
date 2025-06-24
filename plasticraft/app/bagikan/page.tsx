'use client';

import React, { useState } from 'react';
import BottomNavbar from '@/app/components/BottomNavbar';
import { CloudArrowUpIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Ini adalah komponen utama halaman Anda.
// Simpan kode ini di `app/bagikan/page.js`.
export default function BagikanPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  interface FileWithName extends File {
    name: string;
  }

  const [file, setFile] = useState<FileWithName | null>(null);

  const handleFileChange = (event: FileChangeEvent): void => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    // Reset input file agar pengguna bisa memilih file yang sama lagi
    const fileInput = document.getElementById('file-upload') as HTMLInputElement | null;
    if (fileInput) {
        fileInput.value = "";
    }
  }

  return (
    // Kontainer utama untuk halaman
    <div className="bg-white min-h-screen font-sans pb-24">
      <div className="p-6">
        {/* Bagian Unggah File */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center mb-6">
          {!imagePreview ? (
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
              <CloudArrowUpIcon className="h-12 w-12 text-[#1B8380] mx-auto mb-2" />
              <p className="text-gray-700 font-semibold text-lg">Upload Kreasimu di Sini</p>
              <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="relative">
              <img src={imagePreview} alt="Pratinjau Unggahan" className="w-full h-auto max-h-80 object-contain rounded-lg" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:bg-gray-100"
                aria-label="Hapus gambar"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        {/* Bagian Form */}
        <div className="space-y-6">
          {/* Input Kategori */}
          <div className="relative">
             <label htmlFor="category" className="text-gray-800 font-semibold">Kategori Bahan</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border-b-2 border-gray-200 focus:border-[#1B8380] text-gray-900 pt-3 pb-2 px-1 outline-none appearance-none"
            >
              <option value="" disabled>Pilih kategori bahan</option>
              <option value="plastik">Plastik</option>
              <option value="kertas">Kertas</option>
              <option value="kaca">Kaca</option>
              <option value="logam">Logam</option>
              <option value="kain">Kain</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          {/* Input Judul */}
          <div>
            <label htmlFor="title" className="text-gray-800 font-semibold">Judul</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors"
              placeholder="Tulis judul karya mu di sini"
            />
          </div>

          {/* Input Deskripsi */}
          <div>
            <label htmlFor="description" className="text-gray-800 font-semibold">Deskripsi</label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1B8380] py-2 text-gray-700 outline-none transition-colors"
              placeholder="Tambahkan deskripsi karya mu di sini"
            ></textarea>
          </div>
        </div>

      </div>
      
      {/* Tombol Unggah */}
      <div className="px-6 mt-8">
        <button
            type="button"
            className="w-full bg-[#1B8380] text-white font-bold py-4 rounded-full text-lg shadow-lg hover:bg-[#166966] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B8380]"
        >
            Unggah
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto">
        <BottomNavbar />
      </div>
    </div>
  );
}
