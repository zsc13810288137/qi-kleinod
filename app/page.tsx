'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

export default function HomePage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取 Featured 商品（仿照 Shop 页写法）
  const fetchFeatured = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      console.error("获取精选商品失败:", error);
    } else {
      // 只取 Qi's Collection 的前4个，并按图片编号排序
      const qisItems = (data || [])
        .filter(p => p.images?.[0]?.includes('Qi_Collection_Neclace'))
        .sort((a: any, b: any) => {
          const numA = parseInt(a.images?.[0]?.match(/(\d+)/)?.[0] || '0');
          const numB = parseInt(b.images?.[0]?.match(/(\d+)/)?.[0] || '0');
          return numA - numB;
        })
        .slice(0, 4);

      setFeaturedProducts(qisItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  // 实时更新库存
  useEffect(() => {
    const channel = supabase
      .channel('featured-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, fetchFeatured)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      stock: product.stock,
    });

    toast.success(`Added ${product.name}`, {
      description: "You can check your cart anytime.",
      duration: 2200,
    });

    window.dispatchEvent(new Event('addToCart'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-koala.jpg"
            alt="Qi-Kleinod Hero"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 z-10" />

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
            <span className="text-2xl">🐨</span>
            <span className="text-white text-sm tracking-widest font-medium">HANDCRAFTED WITH LOVE</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tighter">
            Qi-Kleinod
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 mb-10 max-w-2xl mx-auto leading-tight">
            Qi's creative-inspired handmade jewelry<br />
            that brings joy and elegance to your everyday life
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-black px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 active:scale-95"
            >
              Shop Collection
            </Link>
            
            <Link
              href="/story"
              className="border border-white/70 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition backdrop-blur-sm"
            >
              Explore Stories
            </Link>
          </div>
        </div>
      </div>

      {/* 精选商品 */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Featured Collection</h2>
              <p className="text-gray-600 mt-2">New arrivals from Qi's Collection</p>
            </div>
            <Link href="/shop" className="text-black hover:underline font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading featured items...</div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No featured products found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
                  <Link href={`/shop/${product.id}`} className="block relative h-72 bg-white flex items-center justify-center p-6 overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={280}
                        height={280}
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-gray-400">No Image</div>
                    )}
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-emerald-600 font-bold text-xl mb-4">
                      €{product.price}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">
                      {product.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (product.stock <= 0) {
                          toast.error("This product is out of stock.");
                          return;
                        }
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images?.[0] || '',
                          stock: product.stock,
                        });
                        toast.success(`Added ${product.name}`);
                        window.dispatchEvent(new Event('addToCart'));
                      }}
                      disabled={product.stock <= 0}
                      className={`w-full py-3 rounded-2xl transition font-medium mt-auto
                        ${product.stock > 0 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}