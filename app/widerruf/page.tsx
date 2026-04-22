// app/widerruf/page.tsx
export default function WiderrufPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10 text-gray-900">Widerrufsbelehrung</h1>

        <div className="prose prose-gray max-w-none bg-white p-8 rounded-3xl shadow-sm leading-relaxed">
          <h2 className="text-2xl font-semibold mb-6">Widerrufsrecht</h2>
          <p>
            Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6">Widerrufsfrist</h2>
          <p>
            Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6">Um Ihr Widerrufsrecht auszuüben</h2>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Senchuan Zhang, Jakob Steffan Str. 22, 55122 Mainz, kontakt@qi-kleinod.de) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </p>

          <p className="mt-10 text-sm text-gray-500">
            Stand: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}