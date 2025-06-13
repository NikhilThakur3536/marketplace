import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';

const FavoriteItemCard = ({ item, onUpdateQuantity, onRemoveFromFavorites }) => {
  return (
    <div className="bg-white border border-border rounded-lg px-4 py-2 hover:shadow-md transition-shadow animate-fade-in">
      <div className='transform translate-y-4'>
      <div className="flex gap-4">
        {/* Item Image */}
        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <div className="w-16 h-16 bg-green-300 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
            </div>
            <button
              onClick={() => onRemoveFromFavorites(item.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Heart size={16} fill="currentColor" />
            </button>
          </div>
          <div className='transform -translate-y-8'>
            <h3 className="font-semibold text-foreground mb-1 truncate">{item.name}</h3>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-foreground">₹{item.price}</span>
              <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {item.description || 'No description available'}
            </p>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="font-medium text-foreground min-w-[2ch] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

            <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors font-medium">
              ADD
            </button>
          </div>  
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FavoriteItemCard;
