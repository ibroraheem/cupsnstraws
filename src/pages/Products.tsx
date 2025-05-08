import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';

interface ProductSize {
  id: string;
  size: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  sizes: ProductSize[];
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Fetch products and their sizes from Supabase
      const { data: productsData, error } = await supabase
        .from('products')
        .select('id, name, description, image, product_sizes(id, size, price)');
      if (!error && productsData) {
        const formatted = productsData.map((p: { id: string; name: string; description: string; image: string | null; product_sizes: ProductSize[] }) => ({
          ...p,
          sizes: p.product_sizes,
        }));
        setProducts(formatted);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Our Drinks</h1>
        {loading ? (
          <div className="text-center text-accent">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block bg-primary/10 rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-200">
                {product.image && (
                  <img src={product.image} alt={product.name} className="h-32 w-32 object-cover rounded-full mb-4 border-4 border-primary" />
                )}
                <h2 className="text-xl font-bold text-primary mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-4 text-center line-clamp-3 h-20">{product.description}</p>
                <div className="w-full mt-auto">
                  <h3 className="text-accent font-semibold mb-2">Available Sizes:</h3>
                  <ul>
                    {product.sizes.map((size) => (
                      <li key={size.id} className="flex justify-between items-center py-1">
                        <span className="text-gray-800 text-sm">{size.size}</span>
                        <span className="text-yellow font-bold text-sm">₦{size.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;