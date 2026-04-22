'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

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
  created_at: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsAdding(false);
  };

  const startAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      category: '',
      stock: 0,
      images: ['/images/fox1.png'],
      material: '',
      weight: 0,
    });
    setIsAdding(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    setSaving(true);

    try {
      if (isAdding) {
        // 添加新商品
        const { error } = await supabase
          .from('products')
          .insert([formData]);

        if (error) throw error;
        alert("新商品添加成功！");
      } else if (editingProduct) {
        // 更新商品
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        alert("商品更新成功！");
      }

      setEditingProduct(null);
      setIsAdding(false);
      fetchProducts();
    } catch (err: any) {
      alert("保存失败: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`确定删除商品 "${name}" 吗？此操作不可恢复！`)) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert("删除失败: " + error.message);
    } else {
      alert("商品已删除");
      fetchProducts();
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setFormData({});
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Admin - Product Management</h1>
          <div className="flex gap-6">
            <Link href="/admin" className="text-black hover:underline">← Back to Admin</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('admin-auth');
                window.location.href = '/admin';
              }}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={startAddNew}
            className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition flex items-center gap-2"
          >
            + Add New Product
          </button>
        </div>

        {/* 商品列表 */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{product.name}</td>
                  <td className="px-6 py-5 text-sm text-gray-600">{product.category || '-'}</td>
                  <td className="px-6 py-5 text-right font-medium">€{product.price}</td>
                  <td className="px-6 py-5 text-center font-medium">{product.stock}</td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => startEdit(product)}
                        className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 编辑 / 添加 商品弹窗 */}
        {(editingProduct || isAdding) && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6  text-gray-900">
                {isAdding ? 'Add New Product' : 'Edit Product'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-900">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Price (€) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-900">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900">Weight (g)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Image Path (e.g. /images/fox3.png)</label>
                  <input
                    type="text"
                    name="images"
                    value={formData.images?.[0] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-black"
                    placeholder="/images/fox1.png"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={saveProduct}
                  disabled={saving}
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-70"
                >
                  {saving ? "Saving..." : isAdding ? "Add Product" : "Save Changes"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 border border-gray-300 py-4 rounded-2xl font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}