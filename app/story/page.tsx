'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function OurStoryPage() {
  const [language, setLanguage] = useState<'en' | 'de'>('en');

  const t = (en: string, de: string) => (language === 'en' ? en : de);

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Language Switch */}
        <div className="flex justify-end mb-8">
          <div className="bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${language === 'en' ? 'bg-black text-white' : 'text-gray-600'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('de')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${language === 'de' ? 'bg-black text-white' : 'text-gray-600'}`}
            >
              Deutsch
            </button>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("Our Story", "Unsere Geschichte")}
          </h1>
          <p className="text-2xl text-gray-600">
            {t("A Mother’s Love, Woven in Every Piece", "Die Liebe einer Mutter, in jedes Stück gewebt")}
          </p>
        </div>

        {/* Founder - Mother */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="uppercase tracking-widest text-amber-600 text-sm font-medium mb-3">
              {t("The Founder", "Die Gründerin")}
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Qi Zhuang</h2>

            <div className="prose prose-lg text-gray-700 space-y-6">
              <p>
                {t(
                  "Born in Beijing in 1954 into a family of intellectuals, Qi Zhuang has always had a deep appreciation for beauty, craftsmanship, and elegance.",
                  "Geboren 1954 in Beijing in einer Familie von Intellektuellen, hat Qi Zhuang schon immer eine tiefe Wertschätzung für Schönheit, Handwerkskunst und Eleganz gehabt."
                )}
              </p>
              <p>
                {t(
                  "After moving to Germany, she followed her passion and founded her own jewelry business more than 20 years ago. With dedication and love, she has created pieces that reflect warmth, grace, and the quiet strength of a mother’s heart.",
                  "Nach ihrer Übersiedlung nach Deutschland folgte sie ihrer Leidenschaft und gründete vor über 20 Jahren ihr eigenes Schmuckgeschäft. Mit Hingabe und Liebe kreiert sie Stücke, die Wärme, Anmut und die stille Kraft einer Mutterliebe ausstrahlen."
                )}
              </p>
              <p>
                {t(
                  "She is responsible for the physical store operations and brings her lifelong passion for jewelry to every customer she meets.",
                  "Sie ist verantwortlich für den Betrieb des physischen Ladens und bringt ihre lebenslange Leidenschaft für Schmuck zu jedem Kunden."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Co-Founder - Son */}
        <div>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="uppercase tracking-widest text-emerald-600 text-sm font-medium mb-3">
              {t("The Co-Founder", "Der Co-Founder")}
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Senchuan Zhang</h2>

            <div className="prose prose-lg text-gray-700 space-y-6">
              <p>
                {t(
                  "As her son and Co-Founder, I grew up watching my mother create beauty with her hands. Her dedication inspired me to combine her vision with modern technology.",
                  "Als ihr Sohn und Co-Founder bin ich aufgewachsen, während ich zusah, wie meine Mutter mit ihren Händen Schönheit erschuf. Ihre Hingabe inspirierte mich, ihre Vision mit moderner Technologie zu verbinden."
                )}
              </p>
              <p>
                {t(
                  "With a background in engineering and a passion for digital innovation, I am responsible for the website development, online operations, and the overall digital presence of Qi-Kleinod.",
                  "Mit einem Hintergrund in Ingenieurwesen und einer Leidenschaft für digitale Innovation bin ich verantwortlich für die Entwicklung der Website, den Online-Betrieb und die gesamte digitale Präsenz von Qi-Kleinod."
                )}
              </p>
              <p>
                {t(
                  "Together, we created Qi-Kleinod — a brand that carries not only beauty, but also a mother’s love and a son’s gratitude.",
                  "Gemeinsam haben wir Qi-Kleinod erschaffen — eine Marke, die nicht nur Schönheit trägt, sondern auch die Liebe einer Mutter und die Dankbarkeit eines Sohnes."
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-12 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition"
          >
            {t("Discover Our Jewelry", "Unsere Schmuckstücke entdecken")}
          </Link>
        </div>
      </div>
    </div>
  );
}