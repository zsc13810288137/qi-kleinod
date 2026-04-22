'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Wir verwenden Cookies</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Diese Website verwendet Cookies, um die Nutzung zu verbessern, 
              die Funktionalität zu gewährleisten und Analysen durchzuführen. 
              Mit "Akzeptieren" stimmen Sie der Verwendung von Cookies zu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={acceptNecessary}
              className="px-6 py-3 text-sm border border-gray-300 rounded-2xl hover:bg-gray-50 transition whitespace-nowrap"
            >
              Nur notwendige
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-3 text-sm bg-black text-white rounded-2xl hover:bg-gray-800 transition whitespace-nowrap"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}