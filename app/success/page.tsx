'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { createClient } from '@/lib/supabase';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [orderSaved, setOrderSaved] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const clearCart = useCartStore((state) => state.clearCart);
  const supabase = createClient();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const processOrder = async () => {
      try {
        // 1. 读取购物车（必须在 clearCart 之前）
        const lastCartStr = localStorage.getItem('qi-kleinod-cart');
        let items: any[] = [];
        let totalAmount = 0;

        if (lastCartStr) {
          try {
            const parsed = JSON.parse(lastCartStr);
            items = parsed.state?.items || [];
            totalAmount = items.reduce((sum: number, item: any) => 
              sum + (item.price || 0) * (item.quantity || 1), 0);
          } catch (e) {
            console.error("解析购物车失败", e);
          }
        }

        console.log("读取到的购物车数据:", { totalAmount, items });

        // 清空购物车
        clearCart();

        // 获取用户
        const { data: { user } } = await supabase.auth.getUser();

        // 重要：获取 Stripe Session（带 metadata）
        const stripeRes = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const stripeData = await stripeRes.json();
        const metadata = stripeData.metadata || {};

        console.log("从 Stripe 收到的 metadata:", metadata);

        // 保存到 orders 表
        const { error: insertError } = await supabase.from('orders').insert({
          user_id: user?.id || null,
          stripe_session_id: sessionId,
          total_amount: totalAmount,
          currency: 'eur',
          status: 'paid',
          items: items,
          shipping_fullname: metadata.shipping_fullName || '',
          shipping_email: metadata.shipping_email || '',
          shipping_phone: metadata.shipping_phone || '',
          shipping_address: metadata.shipping_address || '',
          shipping_city: metadata.shipping_city || '',
          shipping_postalcode: metadata.shipping_postalCode || '',
          shipping_country: metadata.shipping_country || 'Germany',
        });

        if (insertError) {
          console.error("保存订单失败:", insertError);
        } else {
          console.log("✅ 订单保存成功！");
          setOrderSaved(true);
        }

        setOrderInfo({
          total: totalAmount,
          date: new Date().toLocaleDateString('en-GB'),
          orderNumber: sessionId.slice(-8).toUpperCase(),
          shipping: metadata,
          items
        });

      } catch (err: any) {
        console.error("Success page 处理出错:", err);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [sessionId, clearCart]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Processing your order...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-8 text-7xl">🎉</div>
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-10">Your order has been placed successfully.</p>

        {orderInfo && (
          <div className="bg-white rounded-3xl shadow p-8 mb-10 text-left">
            <div className="border-b pb-6 mb-6">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-mono text-2xl font-semibold">#{orderInfo.orderNumber}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Paid</span>
                <span className="font-semibold">€{orderInfo.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span>{orderInfo.date}</span>
              </div>
            </div>

            {/* 收货地址显示 */}
            {orderInfo.shipping?.shipping_fullName && (
              <div className="mt-8 pt-6 border-t">
                <p className="font-medium mb-3">Shipping Address</p>
                <p className="font-semibold">{orderInfo.shipping.shipping_fullName}</p>
                <p>{orderInfo.shipping.shipping_address}</p>
                <p>{orderInfo.shipping.shipping_city}, {orderInfo.shipping.shipping_postalCode}</p>
                <p>{orderInfo.shipping.shipping_country}</p>
                {orderInfo.shipping.shipping_phone && <p>📞 {orderInfo.shipping.shipping_phone}</p>}
                <p className="text-sm mt-2">{orderInfo.shipping.shipping_email}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Link href="/shop" className="block w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800">
            Continue Shopping
          </Link>
          <Link href="/orders" className="block w-full border border-gray-300 py-4 rounded-2xl hover:bg-gray-50">
            View My Orders
          </Link>
        </div>

        {orderSaved && <p className="text-green-600 mt-6">✅ Order saved with shipping information</p>}
      </div>
    </div>
  );
}