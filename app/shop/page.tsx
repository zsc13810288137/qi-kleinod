'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { toast } from 'sonner';
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

// 库存指示器
function ShopStockIndicator({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-red-600 text-sm font-medium">Out of Stock</span>;
  if (stock <= 3) return <span className="text-orange-600 text-sm font-medium">Only {stock} left</span>;
  return <span className="text-emerald-600 text-sm font-medium">In Stock ({stock})</span>;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const addToCart = useCartStore((state) => state.addToCart);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleAddToCart = (product: Product) => {
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
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading products...</div>;

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm))
    );
  });

  const sortedQisProducts = filteredProducts
    .filter(p => p.images?.[0]?.includes('Qi_Collection_Neclace'))
    .sort((a, b) => {
      const numA = parseInt(a.images?.[0]?.match(/(\d+)/)?.[0] || '0');
      const numB = parseInt(b.images?.[0]?.match(/(\d+)/)?.[0] || '0');
      return numA - numB;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Our Collection</h1>
        <p className="text-gray-600 text-center mb-12">
          Discover our adorable koala-inspired, fox-themed and Qi''s elegant jewelry
        </p>

        {/* Qi's Collection */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Qi's Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {sortedQisProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow flex flex-col h-full">
                <Link href={`/shop/${product.id}`} className="block relative h-64 bg-white flex items-center justify-center p-4 flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={260}
                      height={260}
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h3 className="text-xl font-semibold line-clamp-2 flex-1 text-gray-900 pr-2">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-bold text-emerald-600 whitespace-nowrap">€{product.price}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{product.description}</p>

                  <div className="mt-auto">
                    <div className="mb-4">
                      <ShopStockIndicator stock={product.stock} />
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`w-full py-3 rounded-2xl transition font-medium
                        ${product.stock > 0 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Koala & Fox Collection 使用相同卡片结构 */}
        {/* Koala Collection */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Koala Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts
              .filter(p => !p.name.toLowerCase().includes('fox') && !p.images?.[0]?.includes('Qi_Collection_Neclace'))
              .map((product) => (
                <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow flex flex-col h-full">
                  <Link href={`/shop/${product.id}`} className="block relative h-64 bg-white flex items-center justify-center p-4 flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={260}
                        height={260}
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-gray-400">No Image</div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <h3 className="text-xl font-semibold line-clamp-2 flex-1 text-gray-900 pr-2">
                        {product.name}
                      </h3>
                      <span className="text-2xl font-bold text-emerald-600 whitespace-nowrap">€{product.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{product.description}</p>
                    <div className="mt-auto">
                      <div className="mb-4">
                        <ShopStockIndicator stock={product.stock} />
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`w-full py-3 rounded-2xl transition font-medium
                          ${product.stock > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Fox Collection */}
        <div>
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Fox Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.filter(p => p.name.toLowerCase().includes('fox')).map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow flex flex-col h-full">
                <Link href={`/shop/${product.id}`} className="block relative h-64 bg-white flex items-center justify-center p-4 flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={260}
                      height={260}
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h3 className="text-xl font-semibold line-clamp-2 flex-1 text-gray-900 pr-2">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-bold text-emerald-600 whitespace-nowrap">€{product.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{product.description}</p>
                  <div className="mt-auto">
                    <div className="mb-4">
                      <ShopStockIndicator stock={product.stock} />
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`w-full py-3 rounded-2xl transition font-medium
                        ${product.stock > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}