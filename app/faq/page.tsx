'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "Wie lange dauert der Versand? / How long does shipping take?",
      a: "Innerhalb Deutschlands: 1–3 Werktage. In die EU: 3–7 Werktage. International: 5–12 Werktage. ✨"
    },
    {
      q: "Kann ich meine Bestellung zurücksenden? / Can I return my order?",
      a: "Ja! Du hast 14 Tage Widerrufsrecht. Die Ware muss ungetragen und in Originalverpackung sein. Rückversandkosten trägst du (außer bei Falschlieferung)."
    },
    {
      q: "Wie finde ich die richtige Ringgröße? / How do I find my ring size?",
      a: "Schau in unserer Size Guide nach. Tipp: Nimm einen gut sitzenden Ring und miss den inneren Durchmesser. Bei Unsicherheit schreib uns gerne!"
    },
    {
      q: "Sind eure Produkte echt Silber/Gold? / Are your products real silver/gold?",
      a: "Ja! Alle Schmuckstücke sind aus 925 Sterling Silber oder 14K/18K Vergoldet. Wir verwenden hochwertige Materialien, die hautfreundlich und langlebig sind."
    },
    {
      q: "Wie pflege ich meinen Schmuck? / How do I care for my jewelry?",
      a: "Am besten mit einem weichen Tuch abwischen. Vermeide Parfüm, Cremes und Wasser beim Tragen. Wir empfehlen eine Schmuckbox zur Aufbewahrung."
    },
    {
      q: "Bietet ihr Gravur oder Individualisierung an? / Do you offer engraving?",
      a: "Ja! Viele unserer Stücke können personalisiert werden. Schreib uns einfach bei der Bestellung oder per Email an contact@qi-kleinod.com."
    },
    {
      q: "Was passiert, wenn mein Schmuck kaputt geht? / What if my jewelry breaks?",
      a: "Innerhalb der ersten 12 Monate reparieren wir kleine Defekte kostenlos (außer bei grober Fahrlässigkeit). Schreib uns einfach!"
    },
    {
      q: "Wie kann ich euch kontaktieren? / How can I contact you?",
      a: "Am besten per Email: contact@qi-kleinod.com\nOder ruf uns an: +49 6131 213935"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-5 md:px-6">
        
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            Häufige Fragen ❓
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            FAQ • Frequently Asked Questions
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-900 pr-4 text-left text-[15px] md:text-base">
                  {faq.q}
                </span>
                <span className="text-xl text-gray-400 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-700 border-t border-gray-100 text-[15px] md:text-base leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Noch Fragen? Wir sind für dich da!</p>
          <a 
            href="mailto:contact@qi-kleinod.com" 
            className="inline-block bg-black text-white px-8 py-3.5 rounded-2xl hover:bg-gray-800 transition"
          >
            contact@qi-kleinod.com
          </a>
        </div>

        <div className="text-center mt-10">
          <Link href="/shop" className="text-black underline hover:no-underline">
            ← Zurück zum Shop
          </Link>
        </div>
      </div>
    </div>
  );
}