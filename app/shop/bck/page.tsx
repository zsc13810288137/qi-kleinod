'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("开始从 Supabase 获取商品数据... 搜索词:", searchTerm);

        let query = supabase.from('products').select('*').order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error("Supabase 查询错误:", error);
          setError(error.message);
          setLoading(false);
          return;
        }

        let filteredProducts = data || [];

        // 如果有搜索词，进行客户端过滤
        if (searchTerm) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            (product.category && product.category.toLowerCase().includes(searchTerm)) ||
            (product.material && product.material.toLowerCase().includes(searchTerm))
          );
        }

        console.log("成功获取数据，共", filteredProducts.length, "条（过滤后）");
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

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    });

    toast.success(`Added ${product.name}`, {
      description: "You can check your cart anytime.",
      duration: 2200,
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading products...</div>;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 页面标题 + 搜索提示 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Our Collection'}
            </h1>
            <p className="text-gray-600 mt-2">
              {searchTerm
                ? `${products.length} results found`
                : 'Discover our adorable koala-inspired jewelry'}
            </p>
          </div>

          {searchTerm && (
            <Link href="/shop" className="text-black hover:underline">
              ← Clear Search
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No products found for "{searchTerm}"</p>
            <Link href="/shop" className="mt-6 inline-block text-black underline">
              Back to All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full"
              >
                {/* 图片区域 - 固定高度 */}
                <Link href={`/shop/${product.id}`} className="relative block h-80 bg-gray-100 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </Link>

                {/* 内容区域 - 自动对齐 */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-bold text-emerald-600 whitespace-nowrap">
                      €{product.price.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.category && (
                      <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">{product.category}</span>
                    )}
                    {product.material && (
                      <span className="px-3 py-1 bg-amber-100 text-xs rounded-full">{product.material}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-auto w-full bg-black text-white py-3.5 rounded-2xl hover:bg-gray-800 transition-colors font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}