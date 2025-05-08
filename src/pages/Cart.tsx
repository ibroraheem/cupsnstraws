import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-primary-600/40 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-primary-600 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any drinks to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-md inline-block transition-colors"
            >
              Explore Our Drinks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary">Your Cart</h1>
          <Link
            to="/products"
            className="text-primary hover:text-green-600 font-medium flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Continue Shopping
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  <th className="py-4 px-6 text-left text-primary font-medium">Product</th>
                  <th className="py-4 px-6 text-left text-primary font-medium">Size</th>
                  <th className="py-4 px-6 text-left text-primary font-medium">Price</th>
                  <th className="py-4 px-6 text-left text-primary font-medium">Quantity</th>
                  <th className="py-4 px-6 text-left text-primary font-medium">Total</th>
                  <th className="py-4 px-6 text-left text-primary font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={`${item.product.id}-${item.selectedSize.size}-${index}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <span className="font-medium text-gray-700">{item.product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{item.selectedSize.size}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {formatCurrency(item.selectedSize.price)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(
                            item.product.id,
                            item.selectedSize.size,
                            item.quantity - 1
                          )}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="mx-3 text-gray-700 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(
                            item.product.id,
                            item.selectedSize.size,
                            item.quantity + 1
                          )}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {formatCurrency(item.selectedSize.price * item.quantity)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize.size)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-end">
          <div className="bg-white rounded-lg shadow-md p-6 md:w-1/3">
            <h2 className="text-xl font-bold text-primary mb-4">Order Summary</h2>
            
            <div className="flex justify-between border-b border-gray-200 py-3">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(getTotalPrice())}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-200 py-3">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">To be calculated</span>
            </div>
            
            <div className="flex justify-between py-3 text-lg font-bold text-primary">
              <span>Total</span>
              <span>{formatCurrency(getTotalPrice())}</span>
            </div>
            
            <Link
              to="/checkout"
              className="block w-full bg-primary hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md text-center mt-6 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;