'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  banned?: boolean;
};

type UserOrderSummary = {
  user_id: string;
  order_count: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userOrders, setUserOrders] = useState<Record<string, UserOrderSummary>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users || []);
      setUserOrders(data.userOrders || {});
    } catch (err: any) {
      console.error("获取用户列表失败:", err);
      alert("获取用户列表失败: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleBanUser = async (userId: string, currentBanned: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, banned: !currentBanned }),
      });

      if (!res.ok) throw new Error('Ban operation failed');

      await fetchUsers(); // 刷新列表
      alert(`用户已${!currentBanned ? '禁用' : '解除禁用'}`);
    } catch (err: any) {
      alert("操作失败: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`确定要永久删除用户 ${email} 吗？此操作不可恢复！`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error('Delete operation failed');

      await fetchUsers();
      alert("用户已成功删除");
    } catch (err: any) {
      alert("删除失败: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Admin - User Management</h1>
          <div className="flex gap-6">
            <Link href="/admin" className="text-black hover:underline">← Back to Admin</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('admin-auth');
                window.location.href = '/admin';
              }}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Registered</th>
                <th className="px-6 py-4 text-left">Last Login</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => {
                const orderInfo = userOrders[user.id] || { order_count: 0 };
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-medium">{user.email}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString('en-GB') 
                        : 'Never'}
                    </td>
                    <td className="px-6 py-5 text-center font-medium">
                      {orderInfo.order_count}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                        user.banned 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => toggleBanUser(user.id, user.banned || false)}
                          disabled={actionLoading === user.id}
                          className={`px-5 py-2 text-sm rounded-2xl font-medium transition ${
                            user.banned 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          {user.banned ? '✅ Unban User' : '🚫 Ban User'}
                        </button>

                        <button
                          onClick={() => deleteUser(user.id, user.email)}
                          disabled={actionLoading === user.id}
                          className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium transition"
                        >
                          Delete User
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}