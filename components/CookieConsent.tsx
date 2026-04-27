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

  const rejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[60] p-5 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          
          <div className="flex-1">
            <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900">
              Wir verwenden Cookies
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed md:text-gray-600">
              Diese Website verwendet Cookies, um die Funktionalität zu gewährleisten, 
              die Nutzung zu analysieren und dir ein besseres Erlebnis zu bieten. 
              Mehr Informationen findest du in unserer{' '}
              <a href="/datenschutz" className="underline hover:text-black text-gray-900">
                Datenschutzerklärung
              </a>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={rejectAll}
              className="px-5 py-2.5 text-sm border border-gray-300 rounded-2xl hover:bg-gray-50 transition whitespace-nowrap text-gray-700"
            >
              Ablehnen
            </button>
            <button
              onClick={acceptNecessary}
              className="px-5 py-2.5 text-sm border border-gray-300 text-gray-900 rounded-2xl hover:bg-gray-50 transition whitespace-nowrap"
            >
              Nur notwendige
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2.5 text-sm bg-black text-white rounded-2xl hover:bg-gray-800 transition whitespace-nowrap font-medium"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}