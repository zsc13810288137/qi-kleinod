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
  shipping_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postalcode: string;
  shipping_country: string;
};

const statusOptions = [
  { value: 'pending',    label: 'Pending',    color: 'bg-yellow-100 text-yellow-700' },
  { value: 'paid',       label: 'Paid',       color: 'bg-green-100 text-green-700' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  { value: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered',  label: 'Delivered',  color: 'bg-emerald-100 text-emerald-700' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error("获取订单失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders(); // 刷新列表
      alert(`订单状态已更新为: ${newStatus}`);
    } catch (err: any) {
      alert("更新失败，请重试");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Admin - Orders Management</h1>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-black hover:underline">← Back to Admin</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('admin-auth');
                window.location.href = '/admin';
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus = statusOptions.find(s => s.value === order.status) || 
                                 { label: order.status || 'Unknown', color: 'bg-gray-100 text-gray-700' };

            return (
              <div key={order.id} className="bg-white rounded-3xl shadow p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-mono text-lg font-semibold">
                      #{order.stripe_session_id?.slice(-8).toUpperCase() || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleString('en-GB')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`px-5 py-2 rounded-full text-sm font-medium ${currentStatus.color}`}>
                      {currentStatus.label}
                    </span>
                    <p className="text-3xl font-bold mt-3">€{order.total_amount?.toLocaleString() || '0'}</p>
                  </div>
                </div>

                {/* 收货地址 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-gray-50 p-6 rounded-2xl">
                  <div>
                    <p className="font-medium mb-2">Customer</p>
                    <p className="font-semibold">{order.shipping_fullname}</p>
                    <p className="text-sm">{order.shipping_email}</p>
                    {order.shipping_phone && <p>📞 {order.shipping_phone}</p>}
                  </div>
                  <div>
                    <p className="font-medium mb-2">Shipping Address</p>
                    <p>{order.shipping_address}</p>
                    <p>{order.shipping_city}, {order.shipping_postalcode}</p>
                    <p>{order.shipping_country}</p>
                  </div>
                </div>

                {/* 商品列表 */}
                {order.items && order.items.length > 0 && (
                  <div className="mb-8">
                    <p className="font-medium mb-4">Items Purchased</p>
                    <div className="space-y-3 text-sm">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span>{item.name} × {item.quantity || 1}</span>
                          <span>€{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 状态修改 */}
                <div className="pt-6 border-t">
                  <p className="text-sm font-medium text-gray-600 mb-3">Change Order Status</p>
                  <div className="flex flex-wrap gap-3">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateOrderStatus(order.id, option.value)}
                        disabled={updatingId === order.id}
                        className={`px-6 py-3 text-sm rounded-2xl transition font-medium ${
                          order.status === option.value 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {updatingId === order.id ? "Updating..." : option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}