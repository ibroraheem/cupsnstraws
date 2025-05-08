import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { supabase } from '../../lib/supabase';
import { Product, ProductSize } from '../../lib/supabase';
import AdminNavbar from '../../components/AdminNavbar';
import { Search, Filter, Download, AlertTriangle, History, Plus, Minus, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface StockMovement {
  id: string;
  product_id: string;
  size_id: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  created_at: string;
}

interface ProductWithStock extends Product {
  sizes: (ProductSize & {
    stock_movements: StockMovement[];
  })[];
}

const AdminInventory: React.FC = () => {
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [stockMovement, setStockMovement] = useState({
    type: 'in',
    quantity: 1,
    reason: '',
  });

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [adminUser, navigate]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          sizes:product_sizes(
            *,
            stock_movements(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockMovement = async (productId: string, sizeId: string) => {
    try {
      // First, get the current stock status
      const { data: currentSize, error: fetchError } = await supabase
        .from('product_sizes')
        .select('in_stock')
        .eq('id', sizeId)
        .single();

      if (fetchError) throw fetchError;

      // Calculate new stock status
      const newStockStatus = stockMovement.type === 'in' ? true : false;

      // Insert stock movement record
      const { error } = await supabase
        .from('stock_movements')
        .insert({
          product_id: productId,
          size_id: sizeId,
          quantity: stockMovement.quantity,
          type: stockMovement.type,
          reason: stockMovement.reason,
        });

      if (error) throw error;

      // Update product size stock status
      const { error: updateError } = await supabase
        .from('product_sizes')
        .update({
          in_stock: newStockStatus,
        })
        .eq('id', sizeId);

      if (updateError) throw updateError;

      await fetchProducts();
      setShowStockModal(false);
      setStockMovement({
        type: 'in',
        quantity: 1,
        reason: '',
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  const exportInventory = () => {
    const filteredProducts = filterProducts();
    const csvContent = [
      ['Product', 'Category', 'Size', 'Stock Status', 'Last Movement', 'Reason'].join(','),
      ...filteredProducts.flatMap(product =>
        product.sizes.map(size => [
          product.name,
          product.category,
          size.size,
          size.in_stock ? 'In Stock' : 'Out of Stock',
          size.stock_movements[0]?.created_at
            ? new Date(size.stock_movements[0].created_at).toLocaleDateString()
            : 'Never',
          size.stock_movements[0]?.reason || 'N/A'
        ].join(','))
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filterProducts = () => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      const matchesStock = stockFilter === 'all' || 
        (stockFilter === 'low' && product.sizes.some(size => !size.in_stock)) ||
        (stockFilter === 'in' && product.sizes.every(size => size.in_stock)) ||
        (stockFilter === 'out' && product.sizes.every(size => !size.in_stock));
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  };

  const getStockStatusColor = (inStock: boolean) => {
    return inStock
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const filteredProducts = filterProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <button
              onClick={exportInventory}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Inventory
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="all">All Stock Status</option>
                  <option value="low">Low Stock</option>
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
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
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowHistoryModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <History className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <div
                            key={size.id}
                            className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2"
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {size.size}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusColor(size.in_stock)}`}>
                              {size.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {!size.in_stock && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowStockModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              {size.in_stock ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </button>
                          </div>
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

      {/* Stock Movement Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Update Stock - {selectedProduct.name}
                </h3>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    onChange={(e) => {
                      const sizeId = e.target.value;
                      handleStockMovement(selectedProduct.id, sizeId);
                    }}
                  >
                    <option value="">Select a size</option>
                    {selectedProduct.sizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.size} - {size.in_stock ? 'In Stock' : 'Out of Stock'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Movement Type
                  </label>
                  <select
                    value={stockMovement.type}
                    onChange={(e) => setStockMovement(prev => ({ ...prev, type: e.target.value as 'in' | 'out' }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="in">Stock In</option>
                    <option value="out">Stock Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockMovement.quantity}
                    onChange={(e) => setStockMovement(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={stockMovement.reason}
                    onChange={(e) => setStockMovement(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Restock, Damaged, Return"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowStockModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock History Modal */}
      {showHistoryModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Stock History - {selectedProduct.name}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedProduct.sizes.map((size) => (
                  <div key={size.id} className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {size.size}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {size.stock_movements.map((movement) => (
                            <tr key={movement.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Date(movement.created_at).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    movement.type === 'in'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {movement.quantity}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {movement.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory; 