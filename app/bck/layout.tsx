'use client';

import { createClient } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const { totalItems, addToCart: storeAddToCart } = useCartStore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [addAnimation, setAddAnimation] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 全局监听详情页或其他页面触发的 addToCart 事件
  useEffect(() => {
    const handleAddEvent = () => {
      setAddAnimation(true);
      setTimeout(() => setAddAnimation(false), 800);
    };

    window.addEventListener('addToCart', handleAddEvent);

    return () => window.removeEventListener('addToCart', handleAddEvent);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/shop';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // 统一的 Add to Cart 处理函数（所有页面都调用这个）
  const handleGlobalAddToCart = (product: any) => {
    storeAddToCart(product);
    setAddAnimation(true);

    toast.success(`Added ${product.name}`, {
      description: "You can check your cart anytime.",
      duration: 2200,
    });

    setTimeout(() => setAddAnimation(false), 800);
  };

  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* 顶部导航栏 */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            
            {/* 左侧：Logo + Shop & Our Story */}
            <div className="flex items-center gap-10">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Qi-Kleinod
              </Link>

              <div className="flex items-center gap-8 text-sm font-medium">
                <Link href="/shop" className="hover:text-black transition">Shop</Link>
                <Link href="/story" className="hover:text-black transition">Our Story</Link>
              </div>
            </div>

            {/* 中间：搜索栏 */}
            <div className="flex-1 max-w-xl mx-12">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jewelry, earrings, necklaces..."
                  className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3 px-5 pl-12 text-sm focus:outline-none focus:border-black transition"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </form>
            </div>

            {/* 右侧菜单 */}
            <div className="flex items-center gap-8">
              <Link href="/orders" className="text-sm font-medium hover:text-black transition">
                My Orders
              </Link>

              <Link href="/contact" className="text-sm font-medium hover:text-black transition">
                Contact Us
              </Link>

              {/* 购物车 + +1 动画 */}
              <Link href="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-black transition">
                <span className="text-2xl">🛒</span>
                <span className="text-sm font-medium">Cart</span>
                
                {addAnimation && (
                  <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                    +1
                  </span>
                )}

                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* 用户区域 */}
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 hidden md:block">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm border border-gray-300 rounded-2xl hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="px-6 py-2.5 text-sm font-medium hover:bg-gray-100 rounded-2xl transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-2xl hover:bg-gray-800 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* 页面内容 */}
        <main>
          {children}
        </main>

        {/* Toast 容器 */}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          toastOptions={{
            className: 'rounded-2xl',
          }}
        />

        {/* 右下角 Admin Login */}
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            href="/admin/contacts"
            className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1.5 opacity-60 hover:opacity-100"
          >
            <span>⚙️</span>
            <span>Admin Login</span>
          </Link>
        </div>
      </body>
    </html>
  );
}