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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);

    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        stock: formData.stock,
        images: formData.images,
        material: formData.material,
        weight: formData.weight,
      })
      .eq('id', editingProduct.id);

    if (error) {
      alert("保存失败: " + error.message);
    } else {
      alert("商品已更新！");
      setEditingProduct(null);
      fetchProducts();
    }
    setSaving(false);
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
    setFormData({});
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Admin - Product Management</h1>
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

        {/* 商品列表 */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-semibold">All Products ({products.length})</h2>
            <button 
              onClick={() => alert("添加新商品功能即将上线")}
              className="bg-black text-white px-6 py-2 rounded-2xl hover:bg-gray-800"
            >
              + Add New Product
            </button>
          </div>

          <div className="overflow-x-auto">
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
                    <td className="px-6 py-5 text-center">{product.stock}</td>
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
        </div>

        {/* 编辑弹窗 */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-2xl"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={saveProduct}
                  disabled={saving}
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
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