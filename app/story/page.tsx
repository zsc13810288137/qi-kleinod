'use client';

import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-4xl">🐨</span>
          <h1 className="text-5xl font-bold mt-6 mb-4">Our Story</h1>
          <p className="text-xl text-gray-600">Where koala magic meets everyday elegance</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-10">
          <p>
            Qi-Kleinod was born from a simple idea: jewelry should bring joy, not just beauty.
            Inspired by the gentle and adorable koala, we create pieces that are both elegant 
            and full of warmth.
          </p>

          <p>
            Every design tells a small story — of comfort, playfulness, and the little moments 
            that make life special. Whether it's a delicate pearl earring or a sparkling emerald pendant, 
            we want you to feel a little happier every time you wear it.
          </p>

          <div className="bg-white p-10 rounded-3xl shadow-sm">
            <h2 className="text-3xl font-semibold mb-6">Why Koalas?</h2>
            <p className="text-lg">
              Koalas represent calmness, gentleness, and a deep connection to nature. 
              In a fast-paced world, we believe everyone needs a little reminder to slow down 
              and enjoy the small joys — just like a koala peacefully resting in a tree.
            </p>
          </div>

          <p>
            Our jewelry is handcrafted with care using high-quality materials. 
            We hope that when you wear Qi-Kleinod, you carry a piece of that gentle koala spirit with you.
          </p>
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-12 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition"
          >
            Start Your Collection
          </Link>
        </div>
      </div>
    </div>
  );
}