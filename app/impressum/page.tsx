// app/impressum/page.tsx
export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-10 text-gray-900">Impressum</h1>

        <div className="prose prose-gray max-w-none bg-white p-8 rounded-3xl shadow-sm text-gray-900 leading-relaxed">
          
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Angaben gemäß § 5 TMG</h2>
          
          <p className="text-gray-800">
            Senchuan Zhang<br />
            Jakob Steffan Str. 22<br />
            55122 Mainz<br />
            Deutschland
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-900">Vertreten durch</h2>
          <p className="text-gray-800">Qi Zhuang</p>

          <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-900">Kontakt</h2>
          <p className="text-gray-800">
            Telefon: +49 1575 1330668<br />
            E-Mail: kontakt@qi-kleinod.de
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-900">Umsatzsteuer-ID</h2>
          <p className="text-gray-800">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: 97850306211
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6 text-gray-900">Haftungsausschluss</h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Haftung für Inhalte</h3>
          <p className="text-gray-800">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Haftung für Links</h3>
          <p className="text-gray-800">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Urheberrecht</h3>
          <p className="text-gray-800">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>

          <p className="mt-12 text-sm text-gray-600">
            Stand: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}