'use client';

import { useEffect, useState } from 'react';
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

  // 简单密码保护（和你的 contacts admin 保持一致）
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = "bo08QOLA";   // ← 你之前设置的密码

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
    } else {
      alert("密码错误！");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') {
      setIsAuthenticated(true);
    }
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // 乐观更新
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert(`订单状态已更新为 ${newStatus}`);
    } catch (err: any) {
      alert("更新失败: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 border rounded-2xl mb-4"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Admin - Orders Management</h1>
          <button
            onClick={() => {
              localStorage.removeItem('admin-auth');
              window.location.reload();
            }}
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus = statusOptions.find(s => s.value === order.status) || 
                                 { label: order.status, color: 'bg-gray-100 text-gray-700' };

            return (
              <div key={order.id} className="bg-white rounded-3xl shadow p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-mono text-lg font-semibold">
                      #{order.stripe_session_id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('en-GB')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${currentStatus.color}`}>
                      {currentStatus.label}
                    </span>
                    <p className="text-2xl font-bold mt-2">€{order.total_amount}</p>
                  </div>
                </div>

                {/* 收货信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="font-medium mb-2">Customer</p>
                    <p className="font-semibold">{order.shipping_fullname}</p>
                    <p>{order.shipping_email}</p>
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
                    <p className="font-medium mb-3">Items</p>
                    <div className="space-y-3">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity || 1}</span>
                          <span>€{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 状态修改 */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">Change Status:</span>
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateOrderStatus(order.id, option.value)}
                      disabled={updatingId === order.id}
                      className={`px-4 py-2 text-xs rounded-2xl transition ${
                        order.status === option.value 
                          ? 'bg-black text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}