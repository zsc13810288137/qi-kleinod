'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

// ... 在组件内部使用：
const supabase = createClient();

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        });

      if (insertError) {
        throw insertError;
      }

      setSubmitted(true);
      
      // 清空表单
      setFormData({ name: '', email: '', subject: '', message: '' });

    } catch (err: any) {
      console.error("提交失败:", err);
      setError("提交失败，请稍后重试或直接邮件联系我们。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you! Send us a message and we'll get back to you soon.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 px-10 py-16 rounded-3xl text-center">
            <div className="text-6xl mb-6">✉️</div>
            <p className="text-3xl font-medium mb-4">Thank you!</p>
            <p className="text-lg">Your message has been received successfully.</p>
            <p className="mt-6 text-gray-600">We'll reply within 24-48 hours.</p>
            
            <Link 
              href="/"
              className="mt-10 inline-block bg-black text-white px-10 py-4 rounded-2xl hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-10 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={7}
                className="w-full px-5 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:border-black resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        <div className="mt-12 text-center text-sm text-gray-500">
          Or email us directly at: <span className="font-medium text-black">hello@qi-kleinod.com</span>
        </div>
      </div>
    </div>
  );
}