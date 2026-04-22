'use client';

import { createClient } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import { Analytics } from '@vercel/analytics/react';   // 新增：Vercel Analytics

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const [totalItems, setTotalItems] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [addAnimation, setAddAnimation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 同步购物车数量
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe(
      (state) => setTotalItems(state.getTotalItems?.() || 0)
    );
    setTotalItems(useCartStore.getState().getTotalItems?.() || 0);
    return unsubscribe;
  }, []);

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
    setMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              
              {/* Logo */}
              <Link href="/" className="text-2xl font-bold text-gray-900">Qi-Kleinod</Link>

              {/* 搜索框 - PC端显示 */}
              <div className="flex-1 max-w-xl mx-6 hidden md:block">
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

              {/* 手机端汉堡菜单按钮 */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-2xl text-gray-700"
              >
                {menuOpen ? '✕' : '☰'}
              </button>

              {/* 桌面端导航 */}
              <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                <Link href="/shop" className="hover:text-black transition">Shop</Link>
                <Link href="/story" className="hover:text-black transition">Our Story</Link>
                <Link href="/orders" className="hover:text-black transition">My Orders</Link>
                <Link href="/contact" className="hover:text-black transition">Contact Us</Link>
              </div>

              {/* 购物车 */}
              <Link href="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-black transition md:ml-4">
                <span className="text-2xl">🛒</span>
                <span className="text-sm font-medium hidden md:inline">Cart</span>

                {addAnimation && (
                  <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                    +1
                  </span>
                )}

                {totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    suppressHydrationWarning
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* 用户区域 */}
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-black hidden md:block"
                >
                  Logout
                </button>
              ) : (
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black hidden md:block">Sign In</Link>
              )}
            </div>

            {/* 手机端展开菜单 */}
            {menuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t flex flex-col gap-4 text-lg text-gray-900">
                <Link href="/shop" onClick={() => setMenuOpen(false)} className="hover:text-black py-1">Shop</Link>
                <Link href="/story" onClick={() => setMenuOpen(false)} className="hover:text-black py-1">Our Story</Link>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="hover:text-black py-1">My Orders</Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-black py-1">Contact Us</Link>
                {user ? (
                  <button onClick={handleLogout} className="text-left hover:text-black py-1">Logout</button>
                ) : (
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="hover:text-black py-1">Sign In</Link>
                )}
              </div>
            )}
          </div>
        </nav>

        <main>{children}</main>

        <Toaster position="top-center" richColors closeButton />

        {/* Cookie Consent Banner */}
        <CookieConsent />

        {/* Vercel Analytics */}
        <Analytics />

        {/* Footer - 四等分布局，法律链接放在最右边垂直排列 */}
        <footer className="bg-white border-t py-10 mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              
              {/* 第一列：版权信息 */}
              <div>
                <p className="text-gray-500">© 2026 Qi-Kleinod. All rights reserved.</p>
              </div>

              {/* 第二列：留空 */}
              <div></div>

              {/* 第三列：留空 */}
              <div></div>

              {/* 第四列：法律链接（垂直排列，左对齐） */}
              <div className="flex flex-col gap-3 text-gray-600">
                <Link href="/impressum" className="hover:text-gray-900 transition">Impressum</Link>
                <Link href="/datenschutz" className="hover:text-gray-900 transition">Datenschutzerklärung</Link>
                <Link href="/agb" className="hover:text-gray-900 transition">AGB</Link>
                <Link href="/widerruf" className="hover:text-gray-900 transition">Widerrufsbelehrung</Link>
              </div>
            </div>
          </div>
        </footer>

        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1.5 opacity-60 hover:opacity-100">
            ⚙️ Admin Login
          </Link>
        </div>
      </body>
    </html>
  );
}
