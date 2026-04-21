'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const id = params.id as string;
    console.log("详情页接收到的 ID:", id);

    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("查询失败:", error);
      } else {
        console.log("成功找到商品:", data);
        setProduct(data);
      }
      setLoading(false);
    }

    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    });

    // 显示 Toast
    toast.success(`Added ${product.name}`, {
      description: "You can check your cart anytime.",
      duration: 2200,
    });

    // 触发 layout 中的 +1 动画
    window.dispatchEvent(new Event('addToCart'));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-red-600">Product Not Found</h2>
          <p className="mb-4">Requested ID:</p>
          <p className="font-mono bg-gray-100 p-4 rounded-xl break-all text-sm mb-8">
            {params.id}
          </p>
          <Link href="/shop" className="text-black underline text-lg">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/shop" className="mb-10 inline-block text-gray-600 hover:text-black">
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* 大图 */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
            {product.images?.[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* 信息 */}
          <div>
            <h1 className="text-5xl font-bold mb-6">{product.name}</h1>
            <div className="text-5xl font-bold text-emerald-600 mb-10">
              €{product.price}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-5 rounded-2xl text-lg font-medium hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}