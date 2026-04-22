'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
export const dynamic = 'force-dynamic';

const supabase = createClient();

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: string | null;
  stock: number;
  images: string[] | null;
  material: string | null;
  weight: number | null;
};

// 搜索相关的客户端组件
function ShopContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const addToCart = useCartStore((state) => state.addToCart);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("开始从 Supabase 获取商品数据... 搜索词:", searchTerm);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase 查询错误:", error);
          setError(error.message);
          setLoading(false);
          return;
        }

        let filteredProducts = data || [];

        if (searchTerm) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            (product.category && product.category.toLowerCase().includes(searchTerm))
          );
        }

        setProducts(filteredProducts);
      } catch (err: any) {
        console.error("意外错误:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchTerm]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading products...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Our Collection</h1>
        <p className="text-gray-600 text-center mb-12">
          Discover our adorable koala-inspired and fox-themed jewelry
        </p>

        {/* Koala Collection */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Koala Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.filter(p => !p.name.toLowerCase().includes('fox')).map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group">
                <Link href={`/shop/${product.id}`} className="block relative h-80 bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-900">No Image</div>
                  )}
                </Link>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold line-clamp-2">{product.name}</h3>
                    <span className="text-2xl font-bold text-emerald-600">€{product.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <button
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0] || '',
                    })}
                    className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fox Collection */}
        <div>
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Fox Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.filter(p => p.name.toLowerCase().includes('fox')).map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group">
                <Link href={`/shop/${product.id}`} className="block relative h-80 bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-900">No Image</div>
                  )}
                </Link>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold line-clamp-2">{product.name}</h3>
                    <span className="text-2xl font-bold text-emerald-600">€{product.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <button
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0] || '',
                    })}
                    className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 主页面（Server Component + Suspense）
export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
