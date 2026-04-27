'use client';

import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<'en' | 'de'>('en');

  // 从 localStorage 读取已保存的语言
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'en' | 'de';
    if (savedLang) setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: 'en' | 'de') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // 刷新页面以应用新语言（简单方案）
    window.location.reload();
  };

  return (
    <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
          language === 'en' 
            ? 'bg-black text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('de')}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
          language === 'de' 
            ? 'bg-black text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        DE
      </button>
    </div>
  );
}