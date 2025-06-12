'use client';

import BottomNavbar from '@/app/components/BottomNavbar';
import { useState } from 'react';
import { ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function TutorialPage() {
  const [sort, setSort] = useState('Waktu');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Mainan');
  const categories = ['Mainan', 'Peralatan Rumah Tangga', 'Aksesoris', 'Dekorasi'];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Tutorial</h1>

        {/* Filter Section */}
        <div className="flex items-center gap-2 mb-4 relative">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#1B7865] text-white text-sm font-medium cursor-pointer hover:bg-[#1B7865]/90 transition"
          >
            <Filter size={16} />
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
              <option value="Waktu">Waktu</option>
              <option value="Nama">Nama</option>
            </select>
            <ArrowUpDown size={18} />
          </div>
        </div>

        {/* Tutorial Cards */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex p-3 border rounded-xl shadow-sm">
              <img
                src="/example.jpg"
                alt="Karya"
                className="w-20 h-20 rounded-lg object-cover mr-3"
              />
              <div className="flex-1">
                <h2 className="font-bold text-sm">Nama Karya</h2>
                <p className="text-xs text-gray-600">Ringkasan Deskripsi</p>
                <Link href="/tutorial-detail">
                  <button className="mt-2 bg-[#1B7865] text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-[#1B7865]/90 transition">
                    Tutorial →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto">
        <BottomNavbar />
      </div>
    </div>
  );
}