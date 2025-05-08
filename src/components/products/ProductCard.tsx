import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/products';
import { formatCurrency } from '../../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white">
            <p className="text-sm line-clamp-2">{product.description}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary-600 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">From {formatCurrency(product.price)}</p>
        <Link
          to={`/products/${product.id}`}
          className="block w-full text-center bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;