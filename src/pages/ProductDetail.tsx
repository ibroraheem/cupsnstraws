import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingBag, CheckCircle } from 'lucide-react';
import supabase from '../lib/supabase'; // Import Supabase client
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';

// Define interfaces matching Supabase structure and component needs
interface ProductSize {
  id: string; // Assuming product_sizes table has its own id
  size: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  sizes: ProductSize[]; // This will be product_sizes from Supabase, mapped to 'sizes'
  // healthBenefits?: string[]; // Optional: if you add this to your Supabase table
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, image, product_sizes(id, size, price)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error.message);
        setProduct(null);
      } else if (data) {
        const formattedProduct: Product = {
          ...data,
          sizes: data.product_sizes || [],
        };
        setProduct(formattedProduct);
        if (formattedProduct.sizes && formattedProduct.sizes.length > 0) {
          setSelectedSize(formattedProduct.sizes[0]);
        } else {
          setSelectedSize(null);
        }
      } else {
        setProduct(null);
        setSelectedSize(null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, quantity, selectedSize);
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);
    } else {
      console.error('Product or size not selected');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The drink you're looking for doesn't seem to exist or may have been removed.</p>
          <button
            onClick={() => navigate('/products')}
            className="text-primary hover:text-green-600 font-medium flex items-center mx-auto bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to All Drinks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)} // Go back to previous page
          className="text-primary hover:text-green-600 font-medium flex items-center mb-8"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-80 md:h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <h1 className="text-3xl font-display font-bold text-primary mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Health benefits - REMOVED for now as it's not in DB schema 
              {product.healthBenefits && product.healthBenefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-primary-600 mb-2">Health Benefits:</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {product.healthBenefits.map((benefit, index) => (
                      <li key={index} className="mb-1">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )} 
              */}              

              {/* Size selection */}
              {product.sizes && product.sizes.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">Select Size:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id} // Use size.id if available and unique, otherwise size.size
                        onClick={() => handleSizeChange(size)}
                        className={`px-4 py-2 rounded-md border ${
                          selectedSize?.id === size.id // Compare by ID for reliability
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 text-gray-700 hover:border-primary'
                        } transition-colors`}
                      >
                        {size.size} - {formatCurrency(size.price)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mb-6">Sizes not available for this product.</p>
              )}

              {/* Quantity selection - only show if a size is selected and product has sizes */}
              {selectedSize && product.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-2">Quantity:</h3>
                  <div className="flex items-center">
                    <button
                      onClick={decreaseQuantity}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="mx-4 text-xl font-medium w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Total price - only show if a size is selected */}
              {selectedSize && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-primary">Total:</h3>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(selectedSize.price * quantity)}
                  </div>
                </div>
              )}

              {/* Add to cart button - only enable if a size is selected and product has sizes */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || product.sizes.length === 0 || loading}
                className={`w-full text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors relative ${
                  !selectedSize || product.sizes.length === 0 || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-green-600'
                }`}
              >
                {showAdded ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;