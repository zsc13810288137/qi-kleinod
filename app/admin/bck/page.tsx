'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [adminHash, setAdminHash] = useState<string | null>(null);
  const [hashLoading, setHashLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadAdminHash();

    const savedAuth = localStorage.getItem('admin-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadAdminHash = async () => {
    const { data, error } = await supabase
      .from('admin_config')
      .select('value')
      .eq('key', 'admin_password_hash')
      .single();

    if (error || !data?.value) {
      console.error("加载 admin hash 失败:", error);
      setAdminHash(null);
    } else {
      setAdminHash(data.value);
    }
    setHashLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminHash) {
      alert("密码配置加载失败，请检查 Supabase admin_config 表");
      return;
    }

    const hashedInput = await hashPassword(inputPassword);

    if (hashedInput === adminHash) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setInputPassword('');
    }
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-auth');
    setInputPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Admin Portal</h1>

          {hashLoading ? (
            <p className="text-center py-8">Loading security configuration...</p>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Admin Password</label>
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-black"
                  placeholder="请输入后台密码"
                  autoFocus
                />
              </div>

              {passwordError && (
                <p className="text-red-600 text-center">密码错误，请重试</p>
              )}

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition"
              >
                Login to Admin Dashboard
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your Qi-Kleinod store</p>
          </div>
          <button
            onClick={logoutAdmin}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-2xl hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contacts Card */}
          <Link href="/admin/contacts" className="group">
            <div className="bg-white rounded-3xl shadow p-10 hover:shadow-xl transition-all h-full flex flex-col">
              <div className="text-6xl mb-6">✉️</div>
              <h2 className="text-2xl font-semibold mb-3">Contact Messages</h2>
              <p className="text-gray-600 flex-1">View and reply to customer inquiries</p>
              <div className="mt-6 text-black group-hover:underline">Go to Contacts →</div>
            </div>
          </Link>

          {/* Orders Card */}
          <Link href="/admin/orders" className="group">
            <div className="bg-white rounded-3xl shadow p-10 hover:shadow-xl transition-all h-full flex flex-col">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="text-2xl font-semibold mb-3">Orders Management</h2>
              <p className="text-gray-600 flex-1">View orders and update shipping status</p>
              <div className="mt-6 text-black group-hover:underline">Go to Orders →</div>
            </div>
          </Link>

          {/* Users Card - 新增 */}
          <Link href="/admin/users" className="group">
            <div className="bg-white rounded-3xl shadow p-10 hover:shadow-xl transition-all h-full flex flex-col">
              <div className="text-6xl mb-6">👥</div>
              <h2 className="text-2xl font-semibold mb-3">User Management</h2>
              <p className="text-gray-600 flex-1">Manage registered users, view orders and ban users</p>
              <div className="mt-6 text-black group-hover:underline">Go to Users →</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}