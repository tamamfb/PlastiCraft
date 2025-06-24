'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Gunakan Next.js Image jika Anda ingin optimasi gambar lokal

interface CreationItem {
  id: number;
  gambar: string; // URL gambar
  judul: string; // Judul karya
}

interface CreationsSectionProps {
  initialCreations: CreationItem[];
}

export default function CreationsSection({ initialCreations }: CreationsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref untuk div yang bisa di-scroll
  const scrollBarRef = useRef<HTMLDivElement>(null); // Ref untuk track scrollbar kustom (abu-abu)
  const [thumbWidth, setThumbWidth] = useState(0); // Lebar thumb scrollbar kustom (hijau)
  const [thumbLeft, setThumbLeft] = useState(0); // Posisi kiri thumb scrollbar kustom

  // Fungsi untuk menghitung lebar dan posisi thumb scrollbar kustom
  const calculateThumbPosition = () => {
    const container = scrollContainerRef.current;
    const scrollBarTrack = scrollBarRef.current;

    if (container && scrollBarTrack) {
      const scrollWidth = container.scrollWidth;   // Total lebar konten yang bisa di-scroll
      const clientWidth = container.clientWidth;   // Lebar area yang terlihat
      const scrollLeft = container.scrollLeft;     // Posisi scroll saat ini

      if (scrollWidth <= clientWidth) {
        // Tidak perlu scroll, sembunyikan thumb atau jadikan penuh
        setThumbWidth(scrollBarTrack.clientWidth);
        setThumbLeft(0);
        return;
      }

      const trackWidth = scrollBarTrack.clientWidth; // Lebar total track scrollbar kustom
      // Hitung lebar thumb relatif terhadap lebar track
      const newThumbWidth = (clientWidth / scrollWidth) * trackWidth;
      // Hitung posisi kiri thumb relatif terhadap posisi scroll konten
      const newThumbLeft = (scrollLeft / (scrollWidth - clientWidth)) * (trackWidth - newThumbWidth);

      setThumbWidth(newThumbWidth);
      setThumbLeft(newThumbLeft);
    }
  };

  // Efek samping untuk mengatur event listener dan perhitungan awal/ulang
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Perhitungan awal saat komponen dimuat
      calculateThumbPosition();

      // Tambahkan event listener untuk scroll dan resize window
      container.addEventListener('scroll', calculateThumbPosition);
      window.addEventListener('resize', calculateThumbPosition);

      // Bersihkan event listener saat komponen dilepas (unmount)
      return () => {
        container.removeEventListener('scroll', calculateThumbPosition);
        window.removeEventListener('resize', calculateThumbPosition);
      };
    }
  }, []); // [] agar hanya berjalan sekali saat mount dan cleanup saat unmount

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Lihat Kreasi orang lain</h2>
        <Link href="/karya-lain" className="text-[#1B7865] font-medium text-sm hover:underline">
          Lihat Semua Karya
        </Link>
      </div>

      {initialCreations.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada karya yang diupload.</p>
      ) : (
        <>
          {/* Kontainer untuk kreasi yang bisa di-scroll */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-3 overflow-x-scroll no-scrollbar" // 'no-scrollbar' untuk menyembunyikan scrollbar native
          >
            {initialCreations.map((creation) => (
              <Link href={`/karya/${creation.id}`} key={creation.id} className="block"> {/* className="block" agar Link bisa mengambil lebar */}
                <div className="relative flex-shrink-0 w-[calc(33.33%-8px)] aspect-square rounded-lg overflow-hidden shadow-sm">
                  {/* Gunakan tag <img> biasa jika gambar adalah URL eksternal atau dari folder public. */}
                  {/* Jika Anda ingin menggunakan Next.js Image component untuk optimasi, pastikan path gambar benar. */}
                  <img
                    src={creation.gambar || '/placeholder.jpg'} // Gambar dari database, fallback jika kosong
                    alt={creation.judul}
                    className="w-full h-full object-cover"
                    onLoad={calculateThumbPosition} // Panggil recalculate saat gambar dimuat
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Custom Scrollbar */}
          <div className="relative w-full h-2 bg-gray-300 rounded-full mt-4" ref={scrollBarRef}>
            <div
              className="absolute h-full bg-[#1B7865] rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${thumbWidth}px`,
                left: `${thumbLeft}px`,
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}