'use client';

import Link from 'next/link';

export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-5 md:px-6">
        
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            Shipping & Returns 🐨
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Versand & Rückgabe
          </p>
        </div>

        <div className="space-y-10 md:space-y-12">
          
          {/* Versand */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              📦 Versand / Shipping
            </h2>
            <div className="space-y-6 text-gray-700 text-[15px] md:text-base">
              <div className="flex gap-4">
                <span className="text-2xl flex-shrink-0">🇩🇪</span>
                <div>
                  <strong>Innerhalb Deutschlands:</strong><br />
                  1–3 Werktage • 4,90 € (kostenlos ab 80 €)
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl flex-shrink-0">🌍</span>
                <div>
                  <strong>EU & International:</strong><br />
                  3–8 Werktage • ab 9,90 €
                </div>
              </div>
            </div>
          </section>

          {/* Rückgabe */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              🔄 Rückgabe & Widerruf / Returns
            </h2>
            <div className="prose prose-gray max-w-none text-[15px] md:text-base">
              <p>Du hast <strong>14 Tage</strong> Widerrufsrecht.</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li> Ware muss ungetragen und in Originalverpackung sein</li>
                <li> Rücksendung innerhalb von 14 Tagen</li>
                <li> Rückversandkosten trägt der Kunde (außer bei Falschlieferung)</li>
              </ul>
            </div>
          </section>

          {/* Kontakt */}
          <section className="bg-amber-50 rounded-3xl p-6 md:p-8 text-center">
            <h3 className="text-lg md:text-xl font-medium mb-3 text-gray-900">
              Fragen? Wir helfen gerne!
            </h3>
            <a 
              href="mailto:contact@qi-kleinod.com" 
              className="inline-block bg-black text-white px-8 py-3.5 rounded-2xl hover:bg-gray-800 transition text-base"
            >
              contact@qi-kleinod.com
            </a>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link href="/shop" className="text-black underline hover:no-underline text-base">
            ← Zurück zum Shop
          </Link>
        </div>
      </div>
    </div>
  );
}