'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cartStore';
import { toast } from 'sonner';

export default function HomePage() {
  const addToCart = useCartStore((state) => state.addToCart);

  // 使用你 Supabase 中真实的商品 ID（已按你的截图填写）
  const featuredProducts = [
    {
      id: "12fac915-4dab-49a6-9356-0b66d3ef43bb",
      name: "Sleeping Koala Ring",
      price: 169,
      image: "/images/koala3.png",
      description: "Dreamy rose gold ring with a sleeping koala"
    },
    {
      id: "4e8e0622-f8de-4f7d-aae9-75c930a34f82",
      name: "Baby Koala Pearl Earrings",
      price: 95,
      image: "/images/koala2.png",
      description: "Super cute baby koala pearl earrings"
    },
    {
      id: "6d1265f9-7ffb-44f9-8291-5bbe0c3bf59a",
      name: "Koala Eucalyptus Bracelet",
      price: 219,
      image: "/images/koala5.png",
      description: "Elegant bracelet with koala and eucalyptus leaf charm"
    },
    {
      id: "8e53617b-7f87-4d72-88e2-fdbe4390eb7c",
      name: "Little Koala Emerald Pendant",
      price: 259,
      image: "/images/koala4.png",
      description: "Beautiful emerald pendant with an incredible koala design"
    }
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success(`Added ${product.name}`, {
      description: "You can check your cart anytime.",
      duration: 2200,
    });
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
            Adorable koala-inspired jewelry<br />
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

          <div className="mt-16 text-white/60 text-sm tracking-widest">
            Free shipping on orders over €150 • 30-day returns
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          ↓
        </div>
      </div>

      {/* 精选商品模块 */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Featured Collection</h2>
              <p className="text-gray-600 mt-2">Handpicked favorites with koala magic</p>
            </div>
            <Link href="/shop" className="text-black hover:underline font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                <Link href={`/shop/${product.id}`} className="block relative h-80 bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-emerald-600 font-bold text-xl mb-4">
                    €{product.price}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-6">
                    {product.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition font-medium"
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