// app/career/page.tsx
export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-900">Join Our Team</h1>
        <p className="text-center text-gray-600 text-lg mb-16">
          We're looking for passionate people to grow with us.
        </p>

        <div className="space-y-12">
          
          {/* 职位1：网站开发助理 */}
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Website Development Assistant</h2>
                <p className="text-emerald-600 font-medium mt-1">Part-time / Remote</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">Open Position</span>
            </div>
            <p className="text-gray-600 mb-6">
              We are looking for a motivated individual to assist with website maintenance, 
              feature development, and bug fixing for our online jewelry store.
            </p>
            <div className="text-sm text-gray-500 space-y-2">
              <p><strong>Requirements:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Basic knowledge of Next.js, React, and Tailwind CSS</li>
                <li>Familiarity with Supabase or similar backend services</li>
                <li>Good English and German communication skills</li>
                <li>Ability to work independently and learn quickly</li>
              </ul>
            </div>
            <button className="mt-8 px-8 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition">
              Apply Now
            </button>
          </div>

          {/* 职位2：店内导购助理 */}
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">In-Store Sales Assistant</h2>
                <p className="text-emerald-600 font-medium mt-1">Part-time • Mainz Area</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">Open Position</span>
            </div>
            <p className="text-gray-600 mb-6">
              We are looking for a friendly and enthusiastic person to assist customers in our offline store, 
              provide product advice, and help with daily operations.
            </p>
            <div className="text-sm text-gray-500 space-y-2">
              <p><strong>Requirements:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Passion for jewelry and customer service</li>
                <li>Good communication skills in German and English</li>
                <li>Friendly, reliable, and detail-oriented</li>
                <li>Availability on weekends is a plus</li>
              </ul>
            </div>
            <button className="mt-8 px-8 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition">
              Apply Now
            </button>
          </div>
        </div>

        <div className="text-center mt-16 text-gray-500 text-sm">
          Please send your application with CV to: <span className="text-black">kontakt@qi-kleinod.de</span>
        </div>
      </div>
    </div>
  );
}