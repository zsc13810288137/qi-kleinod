'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

type Order = {
  id: string;
  stripe_session_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any[];
  shipping_fullname: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postalcode: string;
  shipping_country: string;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700' },
  paid:       { label: 'Paid',       color: 'bg-green-100 text-green-700' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Shipped',    color: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Delivered',  color: 'bg-emerald-100 text-emerald-700' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Please log in to view your orders");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err: any) {
        console.error("获取订单失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  if (error) {
    return <div className="min-h-screen flex items-center justify-center p-8"><p className="text-red-600">{error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <Link href="/shop" className="text-black hover:underline">← Back to Shop</Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow">
            <p className="text-2xl text-gray-600 mb-4">You don't have any orders yet.</p>
            <Link href="/shop" className="inline-block bg-black text-white px-8 py-3 rounded-2xl hover:bg-gray-800">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };

              return (
                <div key={order.id} className="bg-white rounded-3xl shadow p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="font-mono text-lg font-semibold text-gray-900">
                        #{order.stripe_session_id?.slice(-8).toUpperCase() || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <p className="text-3xl font-bold mt-3 text-gray-900">€{order.total_amount?.toLocaleString() || '0'}</p>
                    </div>
                  </div>

                  {/* 收货地址 */}
                  {order.shipping_fullname && (
                    <div className="mb-8 p-5 bg-gray-50 rounded-2xl text-gray-600">
                      <p className="font-medium mb-2">Shipping Address</p>
                      <p className="font-semibold">{order.shipping_fullname}</p>
                      <p>{order.shipping_address}</p>
                      <p>{order.shipping_city}, {order.shipping_postalcode}</p>
                      <p>{order.shipping_country}</p>
                      {order.shipping_phone && <p>Phone: {order.shipping_phone}</p>}
                      <p className="text-sm mt-1">{order.shipping_email}</p>
                    </div>
                  )}

                  {/* 商品列表 */}
                  {order.items && order.items.length > 0 && (
                    <div>
                      <p className="font-medium mb-4 text-gray-900">Items Purchased</p>
                      <div className="space-y-4">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-4">
                              {item.image && (
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                              </div>
                            </div>
                            <p className="font-medium">
                              €{(item.price * (item.quantity || 1)).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}