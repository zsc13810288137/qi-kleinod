'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-koala.jpg"
            alt="Qi-Kleinod Hero"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 z-10" />

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
            <span className="text-2xl">🐨</span>
            <span className="text-white text-sm tracking-widest font-medium">HANDCRAFTED WITH LOVE</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tighter">
            Qi-Kleinod
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 mb-10 max-w-2xl mx-auto leading-tight">
            Adorable koala-inspired jewelry<br />
            that brings joy and elegance to your everyday life
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-black px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 active:scale-95"
            >
              Shop Collection
            </Link>
            
            <Link
              href="/story"
              className="border border-white/70 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition backdrop-blur-sm"
            >
              Explore Stories
            </Link>
          </div>

          <div className="mt-16 text-white/60 text-sm tracking-widest">
            Free shipping on orders over €150 • 30-day returns
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          ↓
        </div>
      </div>
    </div>
  );
}