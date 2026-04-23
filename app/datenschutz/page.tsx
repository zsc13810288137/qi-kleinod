// app/datenschutz/page.tsx
export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-10 text-gray-900">Datenschutzerklärung</h1>

        <div className="prose prose-gray max-w-none bg-white p-8 rounded-3xl shadow-sm text-gray-900 leading-relaxed">
          
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">1. Verantwortliche Stelle</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p className="mt-2 text-gray-800">
            Senchuan Zhang<br />
            Jakob Steffan Str. 22<br />
            55122 Mainz<br />
            Deutschland<br />
            E-Mail: kontakt@qi-kleinod.de
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6 text-gray-900">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p className="text-gray-800">
            Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6 text-gray-900">3. Kontaktformular</h2>
          <p className="text-gray-800">
            Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6 text-gray-900">4. Stripe (Zahlungsdienstleister)</h2>
          <p className="text-gray-800">
            Zur Abwicklung von Zahlungen nutzen wir den Dienstleister Stripe. Die Zahlungsdaten werden direkt von Stripe verarbeitet. Wir erhalten lediglich eine Bestätigung der erfolgreichen Zahlung.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6 text-gray-900">5. Ihre Rechte</h2>
          <p className="text-gray-800">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Widerspruch gegen die Verarbeitung Ihrer Daten. 
            Wenden Sie sich hierzu bitte an die oben genannte Kontaktadresse.
          </p>

          <p className="mt-10 text-sm text-gray-600">
            Stand: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}