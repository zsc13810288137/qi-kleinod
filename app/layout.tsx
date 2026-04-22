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

  // 使用客户端渲染安全的 totalItems
  const [totalItems, setTotalItems] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [addAnimation, setAddAnimation] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);   // 新增：控制手机菜单

  // 同步购物车数量
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe(
      (state) => setTotalItems(state.getTotalItems?.() || 0)
    );
    // 初始化
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
                <Link href="/orders" className="hover:text-black transition">Orders</Link>
                <Link href="/contact" className="hover:text-black transition">Contact</Link>
              </div>

              {/* 购物车 + 用户 */}
              <div className="flex items-center gap-4 md:gap-6">
                <Link href="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-black transition">
                  <span className="text-2xl">🛒</span>
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

                {user ? (
                  <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-black hidden md:block">
                    Logout
                  </button>
                ) : (
                  <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black hidden md:block">Sign In</Link>
                )}
              </div>
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

        <main className="pb-12">{children}</main>

        <Toaster position="top-center" richColors closeButton />

        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1.5 opacity-60 hover:opacity-100">
            ⚙️ Admin Login
          </Link>
        </div>
      </body>
    </html>
  );
}
