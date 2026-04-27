'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-5 md:px-6">
        
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            Size Guide 🐨📏
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Hilf uns, das perfekte Stück für dich zu finden
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Ring Size */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              💍 Ring Size / Ringgröße
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">EU Größe → Innendurchmesser (mm)</p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">EU</th>
                      <th className="p-3 text-left">Durchmesser</th>
                      <th className="p-3 text-left">Umfang</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr><td className="p-3 border-t">50</td><td className="p-3 border-t">15.9 mm</td><td className="p-3 border-t">50 mm</td></tr>
                    <tr><td className="p-3 border-t">52</td><td className="p-3 border-t">16.6 mm</td><td className="p-3 border-t">52 mm</td></tr>
                    <tr><td className="p-3 border-t">54</td><td className="p-3 border-t">17.2 mm</td><td className="p-3 border-t">54 mm</td></tr>
                    <tr><td className="p-3 border-t">56</td><td className="p-3 border-t">17.8 mm</td><td className="p-3 border-t">56 mm</td></tr>
                    <tr><td className="p-3 border-t">58</td><td className="p-3 border-t">18.5 mm</td><td className="p-3 border-t">58 mm</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-3">💡 Tipp: Nimm einen gut sitzenden Ring und messe den inneren Durchmesser.</p>
                <p>Unsicher? Schreib uns an <a href="mailto:contact@qi-kleinod.com" className="underline">contact@qi-kleinod.com</a> – wir helfen dir gerne!</p>
              </div>
            </div>
          </section>

          {/* Necklace */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              📿 Necklace Length / Kettenlänge
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div className="bg-amber-50 rounded-2xl p-4">
                <div className="font-medium">Choker</div>
                <div className="text-xl font-semibold text-gray-900">35–40 cm</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4">
                <div className="font-medium">Princess</div>
                <div className="text-xl font-semibold text-gray-900">45 cm</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4">
                <div className="font-medium">Matinee</div>
                <div className="text-xl font-semibold text-gray-900">50–60 cm</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4">
                <div className="font-medium">Opera</div>
                <div className="text-xl font-semibold text-gray-900">70–80 cm</div>
              </div>
            </div>
          </section>

          {/* Bracelet */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              🖐 Bracelet Size / Armbandgröße
            </h2>
            <p className="text-gray-700 mb-4">Mess deinen Handgelenkumfang und füge 1–1.5 cm hinzu.</p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-gray-100 px-5 py-3 rounded-2xl text-center">
                <div className="text-xs text-gray-500">XS</div>
                <div className="font-semibold">14–15 cm</div>
              </div>
              <div className="bg-gray-100 px-5 py-3 rounded-2xl text-center">
                <div className="text-xs text-gray-500">S</div>
                <div className="font-semibold">15–16 cm</div>
              </div>
              <div className="bg-gray-100 px-5 py-3 rounded-2xl text-center">
                <div className="text-xs text-gray-500">M</div>
                <div className="font-semibold">16–17 cm</div>
              </div>
              <div className="bg-gray-100 px-5 py-3 rounded-2xl text-center">
                <div className="text-xs text-gray-500">L</div>
                <div className="font-semibold">17–18 cm</div>
              </div>
            </div>
          </section>

        </div>

        <div className="text-center mt-16">
          <Link href="/shop" className="inline-block text-black underline hover:no-underline text-base">
            ← Zurück zum Shop
          </Link>
        </div>
      </div>
    </div>
  );
}