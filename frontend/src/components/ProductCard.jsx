import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 flex flex-col"
    >
      <div className="h-44 flex items-center justify-center bg-gray-50 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-brand-600 font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2 text-sm">{product.name}</h3>
        {product.seller?.shopName && (
          <p className="text-xs text-gray-400 mt-1">Sold by {product.seller.shopName}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
            ★ {product.rating || 4}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
