import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { supabase } from '../../lib/supabase';
import { Product, ProductSize } from '../../lib/supabase';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';

interface ProductSizeForm {
  id?: string;
  label: string;
  size: string;
  quantity: number;
  price: number;
  in_stock: boolean;
}

interface ProductForm {
  id?: string;
  name: string;
  description: string;
  category: string;
  featured: boolean;
  image: string | null;
  sizes: ProductSizeForm[];
}

const initialSize: ProductSizeForm = {
  label: '',
  size: '',
  quantity: 1,
  price: 0,
  in_stock: true,
};

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();
  const [products, setProducts] = useState<ProductForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    category: '',
    featured: false,
    image: null,
    sizes: [initialSize],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [adminUser, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, category, featured, image, product_sizes(id, label, size, quantity, price, in_stock)');
    if (!error && data) {
      setProducts(
        data.map((p: any) => ({
          ...p,
          sizes: p.product_sizes,
        }))
      );
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSizeChange = (idx: number, field: keyof ProductSizeForm, value: any) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));
  };

  const addSize = () => {
    setForm((prev) => ({ ...prev, sizes: [...prev.sizes, initialSize] }));
  };

  const removeSize = (idx: number) => {
    setForm((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== idx) }));
  };

  const handleFormChange = (field: keyof ProductForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (product: ProductForm) => {
    setEditingId(product.id!);
    setForm({
      ...product,
      sizes: product.sizes.length ? product.sizes : [initialSize],
    });
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    await fetchProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let imageUrl = form.image;
    if (imageFile) {
      const { data, error } = await supabase.storage.from('product-images').upload(`products/${Date.now()}_${imageFile.name}`, imageFile, { upsert: true });
      if (!error && data) {
        const { publicUrl } = supabase.storage.from('product-images').getPublicUrl(data.path).data;
        imageUrl = publicUrl;
      }
    }
    if (editingId) {
      // Update product
      await supabase.from('products').update({
        name: form.name,
        description: form.description,
        category: form.category,
        featured: form.featured,
        image: imageUrl,
      }).eq('id', editingId);
      // Remove old sizes and add new
      await supabase.from('product_sizes').delete().eq('product_id', editingId);
      for (const size of form.sizes) {
        await supabase.from('product_sizes').insert({
          product_id: editingId,
          ...size,
        });
      }
    } else {
      // Insert product
      const { data: prod, error } = await supabase.from('products').insert({
        name: form.name,
        description: form.description,
        category: form.category,
        featured: form.featured,
        image: imageUrl,
      }).select().single();
      if (prod) {
        for (const size of form.sizes) {
          await supabase.from('product_sizes').insert({
            product_id: prod.id,
            ...size,
          });
        }
      }
    }
    setForm({ name: '', description: '', category: '', featured: false, image: null, sizes: [initialSize] });
    setImageFile(null);
    setEditingId(null);
    setSubmitting(false);
    await fetchProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>

          {showForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => { setEditingId(null); setForm({ name: '', description: '', category: '', featured: false, image: null, sizes: [initialSize] }); setImageFile(null); }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      id="category"
                      value={form.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  {form.image && !imageFile ? (
                    <img
                      src={form.image}
                      alt="Product"
                      className="h-20 w-20 object-cover rounded mt-2 border-2 border-primary"
                    />
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg border-2 border-accent shadow mt-2">
                      {form.name || 'No Image'}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Sizes</h3>
                    <button
                      type="button"
                      onClick={addSize}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Size
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.sizes.map((size, idx) => (
                      <div key={idx} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={size.label}
                            onChange={(e) => handleSizeChange(idx, 'label', e.target.value)}
                            placeholder="Label (e.g. small 35cl)"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={size.size}
                            onChange={(e) => handleSizeChange(idx, 'size', e.target.value)}
                            placeholder="Size (e.g. 35cl)"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={size.quantity}
                            onChange={(e) => handleSizeChange(idx, 'quantity', Number(e.target.value))}
                            placeholder="Qty"
                            min={1}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={size.price}
                            onChange={(e) => handleSizeChange(idx, 'price', Number(e.target.value))}
                            placeholder="Price"
                            min={0}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={size.in_stock}
                            onChange={(e) => handleSizeChange(idx, 'in_stock', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            In Stock
                          </label>
                        </div>
                        {form.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSize(idx)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white font-bold text-xs border-2 border-accent shadow">
                            {product.name}
                          </div>
                        )}
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <span
                            key={size.id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              size.in_stock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {size.label} - {size.size} - {size.quantity} - {size.price}
                            {size.in_stock ? (
                              <Check className="ml-1 h-3 w-3" />
                            ) : (
                              <X className="ml-1 h-3 w-3" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts; 