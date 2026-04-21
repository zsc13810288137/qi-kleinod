'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { createClient } from '@/lib/supabase';
export const dynamic = 'force-dynamic';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [orderSaved, setOrderSaved] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const clearCart = useCartStore((state) => state.clearCart);
  const supabase = createClient();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const processOrder = async () => {
      try {
        // 1. 先读取购物车数据（放在清空之前）
        const lastCartStr = localStorage.getItem('qi-kleinod-cart');
        let totalAmount = 0;
        let items: any[] = [];

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

        console.log("读取到的购物车数据 →", { totalAmount, itemsCount: items.length });

        // 2. 清空购物车
        clearCart();

        // 3. 获取当前登录用户
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.warn("无法获取用户登录信息:", userError);
          setError("User not logged in");
        } else if (items.length === 0) {
          console.warn("购物车为空，无法保存订单");
          setError("Cart is empty");
        } else {
          // 4. 保存订单到 Supabase
          const { error: insertError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              stripe_session_id: sessionId,
              total_amount: totalAmount,
              currency: 'eur',
              status: 'paid',
              items: items,
              shipping_fullname: "N/A",   // 后续可以从 metadata 读取
              shipping_email: user.email || "N/A",
              shipping_address: "N/A",
              shipping_city: "N/A",
              shipping_postalcode: "N/A",
              shipping_country: "N/A",
            });

          if (insertError) {
            console.error("保存订单失败:", insertError);
            setError(insertError.message);
          } else {
            console.log("✅ 订单保存成功！");
            setOrderSaved(true);
            setOrderInfo({
              total: totalAmount,
              date: new Date().toLocaleDateString('en-GB'),
              orderNumber: sessionId.slice(-8).toUpperCase(),
            });
          }
        }
      } catch (err: any) {
        console.error("Success page 处理出错:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [sessionId, clearCart]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Processing your order...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <span className="text-5xl">🎉</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600">Your order has been placed successfully.</p>
        </div>

        {orderInfo && (
          <div className="bg-white rounded-3xl shadow p-10 mb-10">
            <div className="mb-8">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-3xl font-mono font-semibold text-gray-900 mt-1">
                #{orderInfo.orderNumber}
              </p>
            </div>

            <div className="text-left text-sm space-y-4 mb-10">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{orderInfo.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span>Stripe • Credit Card</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total Paid</span>
                <span>€{orderInfo.total}</span>
              </div>
            </div>

            {orderSaved && (
              <p className="text-green-600 mb-6">✅ Order record saved successfully in database.</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Link
            href="/shop"
            className="block w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="block w-full border border-gray-300 py-4 rounded-2xl hover:bg-gray-50 transition text-gray-700"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

// 主页面包裹 Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Processing your order...</div>}>
      <SuccessContent />
    </Suspense>
  );
}