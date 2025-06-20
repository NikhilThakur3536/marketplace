"use client";

import { Heart, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const FavoriteItemCard = ({ item, onUpdateQuantity, onRemoveFromFavorites, setShowPopup }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleAddToCart = async () => {
    console.log(item)
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (!token) {
      console.error('No token found, please log in.');
      setShowPopup({
        type: 'error',
        message: 'Please log in to add items to cart.',
      });
      setTimeout(() => setShowPopup(null), 3000);
      return;
    }

    if (!item.variantUomId) {
      console.error('Missing variantUomId for item:', item);
      setShowPopup({
        type: 'error',
        message: `Missing variant for ${item.name}.`,
      });
      setTimeout(() => setShowPopup(null), 3000);
      return;
    }

    try {
      const payload = {
        productId: item.id,
        quantity: item.quantity,
        varientId: item.variantUomId
      };

      const response = await axios.post(`${BASE_URL}/user/cart/addv2`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add item to cart');
      }

      console.log('Item added to cart:', response.data);
      setShowPopup({
        type: 'success',
        message: `${item.name} added to cart!`,
      });
      await new Promise((resolve) => setTimeout(() => {
        resolve(onRemoveFromFavorites(item.id));
      }, 1000));
      setTimeout(() => setShowPopup(null), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setShowPopup({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add item to cart.',
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Item Image */}
        <div className="w-24 h-24 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <div className="w-16 h-16 bg-green-300 rounded-full opacity-50"></div>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Veg/Non-Veg Indicator */}
              <span
                className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}
                title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              />
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
            </div>
            <button
              onClick={() => onRemoveFromFavorites(item.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label="Remove from favorites"
            >
              <Heart size={16} fill="currentColor" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
            {item.originalPrice > item.price && (
              <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {item.description || 'No description available'}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="font-medium text-gray-900 min-w-[2ch] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
              aria-label={`Add ${item.name} to cart`}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItemCard;