// app/agb/page.tsx
export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10 text-gray-900">Allgemeine Geschäftsbedingungen (AGB)</h1>

        <div className="prose prose-gray max-w-none bg-white p-8 rounded-3xl shadow-sm leading-relaxed">
          <h2 className="text-2xl font-semibold mb-6">1. Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen und Verträge, die über den Online-Shop Qi-Kleinod abgeschlossen werden.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6">2. Vertragsschluss</h2>
          <p>
            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar. Durch Anklicken des Buttons „Jetzt kaufen“ geben Sie eine verbindliche Bestellung ab.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6">3. Preise und Zahlung</h2>
          <p>
            Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt über den Zahlungsdienstleister Stripe.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6">4. Lieferung und Versand</h2>
          <p>
            Die Lieferung erfolgt innerhalb Deutschlands und der EU. Die Versandkosten werden im Bestellprozess deutlich angezeigt.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-6">5. Widerrufsrecht</h2>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.
          </p>

          <p className="mt-10 text-sm text-gray-500">
            Stand: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}