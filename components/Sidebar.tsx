'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { icon: '🏠', text: 'Dashboard', href: '/', active: true },
    { icon: '📝', text: 'Documents', href: '/documents', active: false },
    { icon: '🎤', text: 'Dictation', href: '/dictation', active: false },
    { icon: '🤖', text: 'AI Assistant', href: '/ai', active: false },
    { icon: '⚙️', text: 'Settings', href: '/settings', active: false },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col fixed h-screen z-50">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png.png" 
            alt="Logo" 
            width={32} 
            height={32}
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold text-gray-900">CAPACITOR</span>
        </div>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.text}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-3.5 text-gray-600 transition-all border-l-4 ${
              item.active
                ? 'bg-blue-50 text-blue-600 border-l-blue-600 font-semibold'
                : 'border-l-transparent hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-xl w-6 text-center">{item.icon}</span>
            <span className="text-sm">{item.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

