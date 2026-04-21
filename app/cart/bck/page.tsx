'use client';

import { useCartStore } from '@/lib/cartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
  if (items.length === 0) return;

  try {
    console.log("正在调用 Stripe Checkout API...");

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();
    console.log("API 返回数据:", data);

    if (data.url) {
      console.log("成功获取支付链接，跳转中...");
      window.location.href = data.url;        // 强制跳转
    } else {
      console.error("API 没有返回 url");
      alert("Payment session creation failed: No URL returned from server");
    }
  } catch (error: any) {
    console.error("Checkout 请求失败:", error);
    alert("Checkout failed. Please check console for details.");
  }
};

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-7xl mb-8">🛒</div>
          <h2 className="text-4xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-10 max-w-md mx-auto">
            Looks like you haven't added any beautiful koala jewelry yet.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-10 py-4 rounded-2xl font-medium hover:bg-gray-800 transition text-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">{totalItems} items in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 商品列表 */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow overflow-hidden">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-6 p-8 ${index !== items.length - 1 ? 'border-b' : ''}`}
                >
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-emerald-600 font-medium">€{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-gray-300 rounded-2xl">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-l-2xl text-xl font-light"
                      >
                        −
                      </button>
                      <span className="px-8 font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-r-2xl text-xl font-light"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-28 text-right">
                      <p className="font-semibold text-lg">
                        €{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow p-8 sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>€{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t pt-6 mb-8">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>€{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="block text-center text-gray-600 hover:text-black transition"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}