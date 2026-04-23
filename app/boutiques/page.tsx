// app/boutiques/page.tsx
export default function BoutiquesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Find Our Boutique</h1>
        <p className="text-xl text-gray-600 mb-12">Visit us in Mainz</p>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-12">
          
          {/* 左侧信息 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm order-2 md:order-1">
            <div className="mb-8">
              {/* 店名优化：PC端也完整显示 */}
              <h2 className="text-[26px] sm:text-3xl md:text-[32px] lg:text-4xl font-semibold text-gray-900 leading-tight break-words">
                QI&apos;S PERLEN KLEINOD e. K.
              </h2>
              <p className="text-emerald-600 font-medium mt-1">Flagship Store • Mainz</p>
            </div>

            <div className="space-y-7 text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Address</p>
                <p>Kirschgarten 21<br />55116 Mainz<br />Germany</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Opening Hours</p>
                <p>Monday – Friday: 10:00 – 18:00 (CET)</p>
                <p>Saturday: 10:00 – 16:00 (CET)</p>
                <p className="text-sm text-gray-500 mt-1">Sunday &amp; Holidays: Closed</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Contact Person</p>
                <p>Qi Zhuang</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Contact</p>
                <p>Phone: 06131 213935</p>
                <p>Email: kontakt@qi-kleinod.de</p>
              </div>
            </div>

            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Kirschgarten+21+55116+Mainz" 
              target="_blank"
              className="mt-10 block w-full bg-black text-white text-center py-4 rounded-2xl hover:bg-gray-800 transition text-lg font-medium"
            >
              📍 Get Directions
            </a>
          </div>

          {/* 右侧地图 */}
          <div className="rounded-3xl overflow-hidden shadow-sm h-[420px] md:h-[520px] order-1 md:order-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2583.057!2d8.2685!3d49.999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd3f5e5b5b5b5b%3A0xabcdef123456!2sKirschgarten%2021%2C%2055116%20Mainz!5e0!3m2!1sen!2sde!4v1740000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 px-4">
          We look forward to welcoming you in our beautiful boutique in the heart of Mainz.
        </div>
      </div>
    </div>
  );
}