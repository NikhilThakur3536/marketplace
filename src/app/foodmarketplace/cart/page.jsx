'use client';

import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, ShoppingBag, X } from 'lucide-react';
import ItemCards from './components/ItemCards';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import AddressForm from './components/AddressForm';
import BottomNav from '../components/BottomNavbar';
import {
  fetchCartItems,
  fetchCoupons,
  fetchUserAddress,
  removeItem,
  updateQuantity,
  placeOrder,
  setRedirectUrl,
  setOrderType,
  setSelectedCoupon,
  setShowPopup,
  setShowAddressForm,
  setIsEditAddress,
  setShowAuthPrompt,
  setUserAddress,
  calculateTotal,
  applyCoupon,
} from '../../../cartSlice';

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    cartItems,
    totalComponents,
    totalPrice,
    subTotal,
    originalTotalPrice,
    orderStatus,
    loading,
    orderLoading,
    redirectUrl,
    coupons,
    selectedCoupon,
    couponLoading,
    showPopup,
    orderType,
    userAddress,
    addressLoading,
    showAddressForm,
    isEditAddress,
    showAuthPrompt,
  } = useSelector((state) => state.cart);

  const normalizeUrl = (url) => url.replace(/\s+/g, '-').toLowerCase();

  // Fetch initial data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(fetchCartItems());
        dispatch(fetchUserAddress());
        if (originalTotalPrice > 0) {
          dispatch(fetchCoupons({ totalAmount: originalTotalPrice }));
        }
      } else {
        console.warn('No token found, prompting login');
        dispatch(setShowAuthPrompt(true));
      }
      const url = localStorage.getItem('lastRestaurantUrl') || '/';
      dispatch(setRedirectUrl(normalizeUrl(url)));
    }
  }, [dispatch, originalTotalPrice]);

  // Calculate total when cartItems change
  useEffect(() => {
    if (cartItems.length > 0 && !loading) {
      console.log('Calculating total for cartItems:', cartItems);
      dispatch(calculateTotal());
    }
  }, [cartItems, loading, dispatch]);

  // Show cart update popup
  useEffect(() => {
    if (cartItems.length > 0 && !loading) {
      console.log('Cart updated, showing popup');
      dispatch(setShowPopup({ type: 'success', message: 'Cart updated!' }));
      const timer = setTimeout(() => dispatch(setShowPopup(null)), 2000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, loading, dispatch]);

  // Apply or clear coupon
  useEffect(() => {
    if (selectedCoupon && cartItems.length > 0) {
      console.log('Applying coupon:', selectedCoupon);
      dispatch(applyCoupon(selectedCoupon));
    } else if (!cartItems.length) {
      console.log('Clearing coupon due to empty cart');
      dispatch(setSelectedCoupon(null));
    }
  }, [cartItems, selectedCoupon, dispatch]);

  // Handle order status changes
  useEffect(() => {
    console.log('Order status changed:', orderStatus);
    if (orderStatus?.type === 'success') {
      dispatch(setShowPopup({ type: 'success', message: 'Order placed successfully!' }));
      setTimeout(() => dispatch(setShowPopup(null)), 5000);
    } else if (orderStatus?.type === 'error') {
      dispatch(setShowPopup({ type: 'error', message: orderStatus.message }));
    }
  }, [orderStatus, dispatch]);

  // Debounced quantity update
  const debouncedUpdateQuantity = useCallback(
    debounce((cartId, newQuantity) => {
      console.log('Updating quantity for cartId:', cartId, 'newQuantity:', newQuantity);
      dispatch(updateQuantity({ cartId, quantity: newQuantity, cartItems }));
    }, 300),
    [dispatch, cartItems]
  );

  // Cleanup debounced updates
  useEffect(() => {
    return () => {
      console.log('Cleaning up debouncedUpdateQuantity');
      debouncedUpdateQuantity.cancel();
    };
  }, [debouncedUpdateQuantity]);

  const handleRemoveItem = async (cartId) => {
    console.log('Removing item with cartId:', cartId);
    await dispatch(removeItem({ cartId }));
  };

  const handleUpdateQuantity = async (cartId, quantity) => {
    const parsedQuantity = Number(quantity);
    console.log('Handling quantity update for cartId:', cartId, 'quantity:', quantity);
    if (isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity)) {
      dispatch(setShowPopup({ type: 'error', message: 'Quantity must be a valid integer.' }));
      return;
    }
    if (parsedQuantity < 0) {
      dispatch(setShowPopup({ type: 'error', message: 'Quantity cannot be negative.' }));
      return;
    }
    if (parsedQuantity === 0) {
      await handleRemoveItem(cartId);
      return;
    }
    await debouncedUpdateQuantity(cartId, parsedQuantity);
  };

  const handlePlaceOrder = async () => {
    if (!userAddress && orderType === 'DELIVERY') {
      dispatch(setShowPopup({ type: 'error', message: 'Please add a delivery address.' }));
      return;
    }
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      dispatch(setShowAuthPrompt(true));
      return;
    }
    console.log('Placing order with totalPrice:', totalPrice);
    await dispatch(placeOrder({ totalPrice, subTotal, orderType, selectedCoupon, userAddress }));
  };

  const handleAuthChoice = (choice) => {
    dispatch(setShowAuthPrompt(false));
    if (typeof window !== 'undefined') {
      localStorage.setItem('redirectUrl', '/foodmarketplace/cart');
    }
    router.push(`/foodmarketplace/${choice}`);
  };

  const handleAddressSubmit = (address) => {
    console.log('Submitting address:', address);
    dispatch(setUserAddress(address));
    dispatch(setShowAddressForm(false));
    dispatch(
      setShowPopup({
        type: 'success',
        message: isEditAddress ? 'Address updated successfully!' : 'Address saved successfully!',
      })
    );
    setTimeout(() => dispatch(setShowPopup(null)), 2000);
  };

  const handleCancel = () => {
    console.log('Cancelling address form');
    dispatch(setShowAddressForm(false));
    dispatch(setIsEditAddress(false));
  };

  const handleChangeAddress = () => {
    console.log('Changing address');
    dispatch(setIsEditAddress(true));
    dispatch(setShowAddressForm(true));
  };

  console.log('Rendering Cart with state:', { cartItems, totalPrice, loading, showAuthPrompt, showPopup, orderStatus });

  return (
    <div className="relative flex justify-center">
      <div className="max-w-md w-full min-h-screen bg-white p-4 flex flex-col gap-4">
        {showPopup && showPopup.message && (
          <div
            className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[120] transition-opacity duration-300 ${
              showPopup.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {showPopup.message}
          </div>
        )}
        {showAuthPrompt && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[130] overflow-y-auto"
            onClick={() => dispatch(setShowAuthPrompt(false))}
          >
            <div
              className="max-w-md w-full bg-white rounded-xl m-4 p-6 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800 text-center flex-1">
                  Please log in or register to place your order
                </p>
                <button
                  onClick={() => dispatch(setShowAuthPrompt(false))}
                  className="p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close authentication prompt"
                >
                  <X size={20} color="gray" />
                </button>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleAuthChoice('login')}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleAuthChoice('register')}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
        {!userAddress && !addressLoading && orderType === 'DELIVERY' && (
          <div className="w-full rounded-xl px-4 bg-red-100 text-red-600 p-4 mb-4">
            <p className="text-center">Please add a delivery address to place your order.</p>
            <button
              onClick={() => {
                dispatch(setIsEditAddress(false));
                dispatch(setShowAddressForm(true));
              }}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
            >
              Add Address
            </button>
          </div>
        )}
        {addressLoading ? (
          <div className="w-full rounded-xl px-4 bg-gradient-to-r from-blue-100 to-blue-200">
            <p className="text-center p-4">Loading address...</p>
          </div>
        ) : userAddress ? (
          <div className="w-full rounded-xl px-4 bg-gradient-to-r from-blue-100 to-blue-200">
            <div className="flex gap-4 p-4">
              <div className="w-[5%] flex items-center">
                <div className="w-fit h-fit rounded-full p-1 bg-blue-200">
                  <MapPin color="blue" size={20} />
                </div>
              </div>
              <div className="flex flex-col w-[60%]">
                <p className="font-bold text-black text-xl">Delivery Address</p>
                <p className="text-xs">
                  {[
                    userAddress?.addressLine1 || '',
                    userAddress?.addressLine2 || '',
                    userAddress?.road || '',
                    userAddress?.landmark || '',
                    userAddress?.label || '',
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
              <button
                onClick={handleChangeAddress}
                className="bg-blue-600 text-white flex items-center justify-center w-fit h-fit px-4 py-2 transform translate-y-2 rounded-lg"
              >
                <span className="text-xs">Change</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-xl px-4 bg-gradient-to-r from-blue-100 to-blue-200">
            <div className="p-4 flex justify-center">
              <button
                onClick={() => {
                  dispatch(setIsEditAddress(false));
                  dispatch(setShowAddressForm(true));
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
              >
                Enter Your Address for Delivery
              </button>
            </div>
          </div>
        )}
        {showAddressForm && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[130] overflow-y-auto"
            onClick={handleCancel}
          >
            <div
              className="max-w-md w-full bg-white rounded-xl m-4 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AddressForm
                onAddressSubmit={handleAddressSubmit}
                onCancel={handleCancel}
                baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
                userAddress={isEditAddress ? userAddress : null}
                isEdit={isEditAddress}
              />
            </div>
          </div>
        )}
        <div className="w-full flex flex-col gap-2 flex-1">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 w-full flex items-center gap-2 px-2 py-4">
            <ShoppingBag color="white" size={20} />
            <p className="text-white font-bold text-xl">Your Items</p>
          </div>
          <div className="w-full flex flex-col gap-4 px-2 bg-white border border-gray-200 flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-gray-500 text-center">Loading...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                {orderStatus?.type === 'success' ? 'Cart is empty after order.' : 'Your cart is empty. Add items to start shopping!'}
              </p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-gray-800">Order Type</p>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg border ${
                        orderType === 'PICKUP'
                          ? 'border-blue-600 bg-blue-100 text-blue-600'
                          : 'border-gray-200 hover:bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => dispatch(setOrderType('PICKUP'))}
                    >
                      Pickup
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg border ${
                        orderType === 'DELIVERY'
                          ? 'border-blue-600 bg-blue-100 text-blue-600'
                          : 'border-gray-200 hover:bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => dispatch(setOrderType('DELIVERY'))}
                    >
                      Delivery
                    </button>
                  </div>
                </div>
                {cartItems.map((item) => {
                  console.log('Item passed to ItemCards:', item);
                  const addOns = item.addons || [];
                  const addOnPrice = addOns.reduce(
                    (sum, addon) => sum + (addon.priceInfo?.price || addon.product?.priceInfo?.price || 0),
                    0
                  );
                  const itemTotal = ((item.priceInfo?.price || 0) + addOnPrice) * Math.floor(item.quantity || 0);
                  const isIncrementDisabled = item.product?.variants?.[0]?.quantity <= item.quantity;
                  return (
                    <ItemCards
                      key={item.id}
                      id={item.id}
                      name={item.name || item.product?.productLanguages?.[0]?.name || 'Unknown Product'}
                      total={itemTotal}
                      restaurantName={item.store?.name || 'Unknown Restaurant'}
                      description={
                        item.product?.productLanguages?.[0]?.shortDescription || 'No description'
                      }
                      customizations={item.customizations || ''}
                      count={Math.floor(item.quantity || 0)}
                      addOns={
                        addOns.length > 0
                          ? addOns
                              .map((addon) => addon.product?.productLanguages?.[0]?.name || addon.name || '')
                              .filter(Boolean)
                              .join(', ')
                          : 'No add-ons'
                      }
                      onRemove={() => handleRemoveItem(item.id)}
                      onIncrement={() => debouncedUpdateQuantity(item.id, (item.quantity || 0) + 1)}
                      onDecrement={() => debouncedUpdateQuantity(item.id, Math.max(1, (item.quantity || 0) - 1))}
                      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                      isIncrementDisabled={isIncrementDisabled}
                    />
                  );
                })}
                <button
                  className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white mb-2"
                  onClick={() => router.push(normalizeUrl(redirectUrl))}
                >
                  Add Items
                </button>
                {cartItems.length > 0 && (
                  <div className="border-t pt-4 mt-2 bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="mb-4">
                      <p className="text-lg font-semibold text-gray-800 mb-2">Available Coupons</p>
                      {couponLoading ? (
                        <p className="text-sm text-gray-500">Loading coupons...</p>
                      ) : coupons.length === 0 ? (
                        <p className="text-sm text-gray-500">No coupons available.</p>
                      ) : (
                        <div className="flex flex-row overflow-x-auto gap-3 pb-2 snap-x">
                          {coupons.map((coupon) => (
                            <button
                              key={coupon.id}
                              onClick={() => dispatch(applyCoupon(coupon))}
                              className={`flex-shrink-0 w-[150px] p-3 rounded-lg border ${
                                selectedCoupon?.id === coupon.id
                                  ? 'border-blue-600 bg-blue-100 text-blue-600'
                                  : 'border-gray-200 hover:bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm font-medium text-left">
                                {coupon.name || coupon.code} -{' '}
                                {coupon.isPercentage
                                  ? `${coupon.discount}% off`
                                  : `₹${coupon.discount} off`}
                                {coupon.minPurchaseAmount && ` (Min ₹${coupon.minPurchaseAmount})`}
                              </p>
                              <p className="text-xs text-gray-500 text-left mt-1">
                                {coupon.description || 'No description'}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-semibold text-gray-800">Total Items</p>
                      <p className="text-lg font-medium">{totalComponents}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-semibold text-gray-600">Subtotal</p>
                      <p className="text-lg font-medium">₹{subTotal.toFixed(2)}</p>
                    </div>
                    {selectedCoupon && (
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-600">Coupon Discount</p>
                        <p className="text-sm text-green-600">
                          -₹{(subTotal - totalPrice).toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-800">Total</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{totalPrice.toFixed(2)}
                      </p>
                    </div>
                    {selectedCoupon && (
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-600">Coupon Applied</p>
                        <p className="text-sm text-green-600">
                          {selectedCoupon.name || selectedCoupon.code}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {orderStatus && orderStatus.message && (
                  <div
                    className={`p-2 rounded-lg text-white text-center ${
                      orderStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    role="alert"
                  >
                    {orderStatus.message}
                    {orderStatus.type === 'success' && (
                      <button
                        className="ml-2 text-sm underline"
                        onClick={() => router.push('/food-marketplace/orders')}
                      >
                        View Orders
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0 || orderLoading}
          className={`w-full py-4 rounded-xl text-white font-semibold text-lg mb-16 ${
            cartItems.length === 0 || orderLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {orderLoading ? (
            <span className="inline-flex items-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
              Placing Order...
            </span>
          ) : (
            `Place Order ₹${totalPrice.toFixed(2)}`
          )}
        </button>
        <BottomNav />
      </div>
    </div>
  );
}