// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Germany',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingInfo,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || '创建支付链接失败');
      }
    } catch (err) {
      console.error(err);
      alert('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Your cart is empty</h2>
          <Link href="/shop" className="text-black underline">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Checkout</h1>
        <p className="text-gray-600 mb-8">Please fill in your shipping details</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="font-semibold mb-3 text-gray-900">Order Summary</h3>
            <p className="text-2xl font-bold">€{getTotalPrice().toLocaleString()}</p>
            <p className="text-sm text-gray-500">{items.length} items</p>
          </div>

          {/* Shipping Form */}
          <div className="bg-white rounded-3xl p-8 shadow">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Shipping Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-900">Full Name *</label>
                <input type="text" name="fullName" required value={shippingInfo.fullName} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Email *</label>
                <input type="email" name="email" required value={shippingInfo.email} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Phone *</label>
                <input type="tel" name="phone" required value={shippingInfo.phone} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-900">Street Address *</label>
                <input type="text" name="address" required value={shippingInfo.address} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">City *</label>
                <input type="text" name="city" required value={shippingInfo.city} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Postal Code *</label>
                <input type="text" name="postalCode" required value={shippingInfo.postalCode} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Country</label>
                <select name="country" value={shippingInfo.country} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black">
                  <option value="Germany">Germany</option>
                  <option value="Austria">Austria</option>
                  <option value="Switzerland">Switzerland</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl text-lg font-medium disabled:opacity-70"
          >
            {loading ? 'Redirecting to Payment...' : 'Continue to Secure Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}