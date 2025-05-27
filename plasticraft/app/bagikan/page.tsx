'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, PlusCircleIcon, PlayCircleIcon, FaceSmileIcon, UserIcon } from '@heroicons/react/24/solid';

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Beranda', href: '/beranda', icon: HomeIcon },
    { name: 'Karya Lain', href: '/karyalain', icon: FaceSmileIcon },
    { name: 'Bagikan', href: '/bagikan', icon: PlusCircleIcon },
    { name: 'Tutorial', href: '/tutorial', icon: PlayCircleIcon },
    { name: 'Profil', href: '/profil', icon: UserIcon },
  ];

  return (
    <nav className="fixed rounded-t-xl bottom-0 left-0 right-0 bg-white border-t-3 border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center text-sm group"
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-colors duration-200 ${
                  isActive ? 'text-[#3EB59D]' : 'text-gray-800 group-hover:text-[#3EB59D]'
                }`}
              />
              <span
                className={`transition-colors duration-200 ${
                  isActive ? 'text-[#3EB59D] font-medium' : 'text-gray-800 group-hover:text-[#3EB59D]'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
