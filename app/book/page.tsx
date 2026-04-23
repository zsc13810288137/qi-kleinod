// app/book/page.tsx
'use client';

import Link from 'next/link';

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-medium"
          >
            ← Back to Shop
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
          Book Your In-Store Visit
        </h1>

        {/* Cal.com 嵌入区域 - 加大高度 */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ minHeight: '920px' }}>
          <iframe
            src="https://cal.com/senchuan-zhang-sqtvv5/30min"
            width="100%"
            height="920"
            frameBorder="0"
            style={{ borderRadius: '24px' }}
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by Cal.com • Qi's Perlen Kleinod
        </p>
      </div>
    </div>
  );
}
