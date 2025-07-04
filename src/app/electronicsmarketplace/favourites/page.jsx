"use client";

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import FavoriteItemCard from './components/FavoriteItemCard';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const Favorites = () => {
  const router = useRouter();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('redirectUrl', '/electronicsmarketplace/favorites');
        }
        setShowPopup({
          type: 'error',
          message: 'Please log in to view your favorites.',
        });
        setTimeout(() => {
          setShowPopup(null);
          router.push('/electronicsmarketplace/login');
        }, 2000);
        setLoading(false);
        return;
      }

      try {
        const payload = {
          languageId: '2bfa9d89-61c4-401e-aae3-346627460558',
        };
        const response = await axios.post(`${BASE_URL}/user/favoriteProduct/listv1`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success && response.data.data?.rows) {
          const items = response.data.data.rows.map((item) => ({
            id: item.id || item.productId,
            name: item.productLanguages?.[0]?.name || item.name || 'Unknown Product',
            price: item.varients?.[0]?.inventory?.price || 0,
            originalPrice: item.priceInfo?.originalPrice || item.originalPrice || item.price || 0,
            isVeg: item.isVeg ?? true,
            description: item.varients?.[0]?.varientLanguages?.[0]?.name || item.description || 'No description',
            image: item.image || '/placeholder.jpg',
            quantity: 1,
            variantUomId: item.varients?.[0]?.id || null, 
          }));
          setFavoriteItems(items);
        } else {
          throw new Error('Invalid API response: success=false or missing data.rows');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setShowPopup({
          type: 'error',
          message: error.response?.data?.message || 'Failed to load favorites.',
        });
        setTimeout(() => setShowPopup(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setFavoriteItems(favoriteItems.filter((item) => item.id !== id));
    } else {
      setFavoriteItems(favoriteItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromFavorites = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowPopup({
        type: 'error',
        message: 'Please log in to remove items from favorites.',
      });
      setTimeout(() => {
        setShowPopup(null);
        router.push('/electronicsmarketplace/login');
      }, 2000);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/user/favoriteProduct/remove`,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setFavoriteItems(favoriteItems.filter((item) => item.id !== id));
      setShowPopup({
        type: 'success',
        message: 'Item removed from favorites.',
      });
      setTimeout(() => setShowPopup(null), 2000);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setShowPopup({
        type: 'error',
        message: error.response?.data?.message || 'Failed to remove item from favorites.',
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const totalItems = favoriteItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = favoriteItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md relative">
        {showPopup && (
          <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[1000] transition-opacity duration-300 ${
              showPopup.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {showPopup.message}
          </div>
        )}
        <div className="bg-green-600 text-white p-6">
          <div className="flex items-center gap-4 mb-6" onClick={() => router.push('/electronicsmarketplace')}>
            <ArrowLeft className="cursor-pointer" size={24} />
            <h1 className="text-2xl font-bold">My Favorites</h1>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Your favorite food items</p>
              <p className="text-sm text-green-200">
                {favoriteItems.length} items favorite • {totalItems} total quantity
              </p>
            </div>
            <Heart className="text-white" size={32} fill="currentColor" />
          </div>
        </div>
        <div className="p-6 bg-white">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Loading favorites...</p>
            </div>
          ) : favoriteItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex flex-col justify-center items-center py-16 text-center">
                <Heart className="mx-auto mb-4 text-gray-400" size={64} />
                <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                <p className="text-gray-500 mb-6">
                  Start adding items to your favorites to see them here
                </p>
                <Link 
                  href="/electronicsmarketplace"
                  className="inline-flex w-fit h-fit items-center px-6 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition-colors"
                >
                  Browse More Items
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {favoriteItems.map((item) => (
                  <FavoriteItemCard 
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveFromFavorites={removeFromFavorites}
                    setShowPopup={setShowPopup}
                  />
                ))}
              </div>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Order Summary</h3>
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-green-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold text-green-900">
                      <span>Total:</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Add All to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;