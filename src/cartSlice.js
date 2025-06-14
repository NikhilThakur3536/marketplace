'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.example.com';
const LANGUAGE_ID = '2bfa9d89-61c4-401e-aae3-346627460558';

const initialState = {
  cartItems: [],
  totalComponents: 0,
  totalPrice: 0,
  subTotal: 0,
  originalTotalPrice: 0,
  orderStatus: null,
  loading: true,
  orderLoading: false,
  redirectUrl: '/',
  coupons: [],
  selectedCoupon: null,
  couponLoading: false,
  showPopup: null,
  orderType: 'PICKUP',
  userAddress: null,
  addressLoading: true,
  showAddressForm: false,
  isEditAddress: false,
  showAuthPrompt: false,
};

export const fetchProductDetails = createAsyncThunk(
  'cart/fetchProductDetails',
  async ({ productId, token }, { rejectWithValue }) => {
    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    try {
      const response = await axios.post(
        `${BASE_URL}/user/product/listv2`,
        { productIds: [productId], languageId: LANGUAGE_ID },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      const product = response.data?.data?.rows?.[0];
      if (!product) {
        console.warn(`No product data returned for productId: ${productId}`);
        return null;
      }
      console.log(`Product details for ${productId}:`, product);
      return {
        productLanguages: product?.productLanguages || [{ name: 'Unknown Product', description: 'No description' }],
        variants: product?.variants || [],
        store: product?.store || { id: null, name: 'Unknown Restaurant' },
      };
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const mergeCarts = createAsyncThunk(
  'cart/mergeCarts',
  async ({ localCart, serverCart, token }, { dispatch, rejectWithValue }) => {
    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    console.log('Merging carts - Local:', localCart, 'Server:', serverCart);
    const mergedItems = [...serverCart];

    for (const localItem of localCart) {
      if (!localItem.productId || !localItem.productVarientUomId) {
        console.warn('Skipping local item due to missing fields:', localItem);
        continue;
      }
      const existingItem = mergedItems.find((item) => item.product?.id === localItem.productId);
      if (existingItem) {
        existingItem.quantity = Math.max(existingItem.quantity, localItem.quantity);
        existingItem.product = {
          ...existingItem.product,
          productLanguages: existingItem.product?.productLanguages || [
            { name: localItem.name || 'Unknown Product', description: localItem.description || 'No description' },
          ],
        };
        existingItem.store = localItem.store || existingItem.store || { id: null, name: 'Unknown Restaurant' };
        existingItem.addons = (existingItem.addons || []).map((addon, index) => ({
          ...addon,
          product: {
            ...addon.product,
            productLanguages: addon.product?.productLanguages || [
              { name: localItem.addons[index]?.name || 'Unknown Add-on' },
            ],
          },
        }));
        existingItem.name = localItem.name || existingItem.product?.productLanguages?.[0]?.name || 'Unknown Product';
      } else {
        const payload = {
          productVarientUomId: localItem.productVarientUomId,
          productId: localItem.productId,
          quantity: localItem.quantity,
          addons: localItem.addons || [],
        };
        try {
          const response = await axios.post(`${BASE_URL}/user/cart/add`, payload, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          });
          const newItem = response.data?.data;
          console.log('Server response for cart/add:', response.data);
          if (!newItem) {
            console.warn('No new item returned from /user/cart/add for productId:', localItem.productId);
            continue;
          }
          if (!newItem.product || !newItem.product.id) {
            console.warn('New item missing product or product.id:', newItem);
            newItem.product = {
              id: localItem.productId,
              productLanguages: [
                { name: localItem.name || 'Unknown Product', description: localItem.description || 'No description' },
              ],
              variants: localItem.variants || [],
            };
            newItem.store = localItem.store || { id: null, name: 'Unknown Restaurant' };
          } else if (!newItem.product?.productLanguages || !newItem.store) {
            const productDetails = await dispatch(fetchProductDetails({ productId: newItem.product.id, token })).unwrap();
            if (productDetails) {
              newItem.product = {
                ...newItem.product,
                productLanguages: productDetails.productLanguages || [
                  { name: localItem.name || 'Unknown Product', description: localItem.description || 'No description' },
                ],
                variants: productDetails.variants || newItem.product.variants || [],
              };
              newItem.store = localItem.store || productDetails.store || { id: null, name: 'Unknown Restaurant' };
            } else {
              newItem.product.productLanguages = [
                { name: localItem.name || 'Unknown Product', description: localItem.description || 'No description' },
              ];
              newItem.store = localItem.store || { id: null, name: 'Unknown Restaurant' };
            }
          }
          newItem.addons = (newItem.addons || []).map((addon, index) => ({
            ...addon,
            product: {
              ...addon.product,
              productLanguages: addon.product?.productLanguages || [
                { name: localItem.addons[index]?.name || 'Unknown Add-on' },
              ],
            },
          }));
          newItem.name = localItem.name || newItem.product?.productLanguages?.[0]?.name || 'Unknown Product';
          mergedItems.push(newItem);
        } catch (error) {
          console.error('Error adding local item to server cart:', error);
        }
      }
    }

    try {
      for (const item of mergedItems) {
        if (!item.product?.id || !item.id || !item.product?.variants?.[0]?.productVarientUoms?.[0]?.id) {
          console.warn('Skipping item with missing fields:', item);
          continue;
        }
        const payload = {
          cartId: item.id,
          productVarientUomId: item.product.variants[0].productVarientUoms[0].id,
          productId: item.product.id,
          quantity: item.quantity,
          addons: (item.addons || []).map((addon) => ({
            addOnId: addon.id,
            addOnProductId: addon.productId,
            addOnVarientId: addon.product?.variants?.[0]?.id || null,
            productVarientUomId: addon.product?.variants?.[0]?.productVarientUoms?.[0]?.id || null,
            quantity: addon.quantity || 1,
          })),
        };
        await axios.post(`${BASE_URL}/user/cart/edit`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }

      localStorage.setItem(
        'cart',
        JSON.stringify(
          mergedItems.map((item) => ({
            id: item.id,
            productId: item.product?.id,
            productVarientUomId: item.product?.variants?.[0]?.productVarientUoms?.[0]?.id,
            quantity: item.quantity,
            name: item.name || item.product?.productLanguages?.[0]?.name || 'Unknown Product',
            description: item.description || item.product?.productLanguages?.[0]?.description || 'No description',
            store: item.store || { id: null, name: 'Unknown Restaurant' },
            addons: (item.addons || []).map((addon) => ({
              addOnId: addon.id,
              addOnProductId: addon.productId,
              addOnVarientId: addon.product?.variants?.[0]?.id || null,
              productVarientUomId: addon.product?.variants?.[0]?.productVarientUoms?.[0]?.id || null,
              quantity: addon.quantity || 1,
              name: addon.product?.productLanguages?.[0]?.name || addon.name || 'Unknown Add-on',
            })),
            priceInfo: item.priceInfo || { price: 0 },
          }))
        )
      );
      console.log('Merged cart:', mergedItems);
      return mergedItems;
    } catch (error) {
      console.error('Error merging carts:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { dispatch, rejectWithValue, getState }) => {
    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    const token = localStorage.getItem('token');
    console.log('Fetching cart items with token:', token);
    if (!token) {
      console.warn('No token found, preserving local cart');
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      return localCart;
    }
    try {
      const payload = { languageId: LANGUAGE_ID };
      const response = await axios.post(`${BASE_URL}/user/cart/listv1`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('Server cart response:', response.data?.data?.rows);
      const serverItems = response.data?.data?.rows || [];
      const normalizedServerItems = serverItems.map((item) => ({
        ...item,
        quantity: Math.floor(item.quantity || 1),
        name: item.product?.productLanguages?.[0]?.name || item.name || 'Unknown Product',
        priceInfo: item.priceInfo || { price: 0 },
      }));
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Local cart before merge:', localCart);
      const mergedCart = await dispatch(mergeCarts({ localCart, serverCart: normalizedServerItems, token })).unwrap();
      console.log('Cart items after merge:', mergedCart);
      dispatch(calculateTotal()); // Ensure total is recalculated after fetch
      return mergedCart;
    } catch (error) {
      console.error('Failed to fetch or merge cart items:', error);
      const { cartItems } = getState().cart; // Preserve existing cartItems on error
      dispatch(calculateTotal()); // Recalculate total to ensure consistency
      return cartItems; // Return existing items instead of clearing
    }
  }
);

export const fetchCoupons = createAsyncThunk(
  'cart/fetchCoupons',
  async ({ totalAmount }, { rejectWithValue }) => {
    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    const token = localStorage.getItem('token');
    if (!token || totalAmount <= 0) return [];
    try {
      const payload = { limit: 4000, offset: 0, totalAmount: totalAmount.toString() };
      const response = await axios.post(`${BASE_URL}/user/coupon/list`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const couponList = response.data?.data?.rows || [];
      return couponList.filter(
        (coupon) => coupon.isEligible && totalAmount >= (coupon.minPurchaseAmount || 0)
      );
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserAddress = createAsyncThunk(
  'cart/fetchUserAddress',
  async (_, { rejectWithValue }) => {
    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const response = await axios.post(
        `${BASE_URL}/user/customerAddress/list`,
        { limit: 4, offset: 0 },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      const addresses = response.data?.data?.rows || [];
      console.log('Fetched addresses:', addresses);
      return addresses.find((addr) => addr.defaultAddress) || addresses[0] || null;
    } catch (error) {
      console.error('Failed to fetch user address:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async ({ cartId }, { rejectWithValue, dispatch }) => {
    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Please log in to remove items.');
    }
    try {
      await axios.post(
        `${BASE_URL}/user/cart/remove`,
        { cartId },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      dispatch(calculateTotal()); // Recalculate total after removal
      return cartId;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ cartId, quantity, cartItems }, { dispatch, rejectWithValue, getState }) => {
            console.log("cart",cartItems)

    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    const token = localStorage.getItem('token');
    console.log('updateQuantity thunk called:', { cartId, quantity, token });
    if (!token) {
      return rejectWithValue('Please log in to update cart.');
    }
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity)) {
      console.error('Invalid quantity:', quantity);
      return rejectWithValue('Quantity must be a valid integer.');
    }
    const adjustedQuantity = Math.max(1, Math.floor(parsedQuantity));
    try {
        console.log("cart",cartItems)
      const item = cartItems.find((item) => item.id === cartId);
      if (!item) {
        console.error('Item not found in cart:', cartId);
        return rejectWithValue('Item not found in cart.');
      }
      if (!item.productId || !item.productVarientUomId) {
        console.error('Product information missing for item:', item);
        return rejectWithValue('Product information missing.');
      }
      // Optimistic update
      dispatch({
        type: 'cart/updateQuantityOptimistic',
        payload: { cartId, quantity: adjustedQuantity },
      });
      dispatch(calculateTotal());
      const payload = {
        cartId,
        productVarientUomId: item.productVarientUomsId,
        productId: item.productId,
        quantity: adjustedQuantity,
      };
      console.log('Sending updateQuantity payload:', payload);
      await axios.post(`${BASE_URL}/user/cart/edit`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('updateQuantity API call succeeded');
      return { cartId, quantity: adjustedQuantity };
    } catch (error) {
      console.error('Error updating item quantity:', error);
      // Revert optimistic update on error
      const { cartItems } = getState().cart;
      dispatch({
        type: 'cart/updateQuantityOptimistic',
        payload: { cartId, quantity: cartItems.find((item) => item.id === cartId)?.quantity || 1 },
      });
      dispatch(calculateTotal());
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async ({ totalPrice, subTotal, orderType, selectedCoupon, userAddress }, { dispatch, rejectWithValue, getState }) => {
    if (typeof window === 'undefined') return rejectWithValue('Server-side execution not supported');
    const token = localStorage.getItem('token');
    console.log('placeOrder called:', { totalPrice, subTotal, orderType, selectedCoupon, userAddress, token: !!token });
    if (!token) {
      dispatch(setShowAuthPrompt(true));
      return rejectWithValue('Please log in to place order.');
    }
    try {
      const payload = {
        timezone: 'Asia/Kolkata',
        totalAmount: totalPrice.toFixed(2),
        subTotal: subTotal.toFixed(2),
        paymentType: 'CASH',
        orderType,
      };
      if (orderType === 'DELIVERY' && userAddress) {
        payload.addressId = userAddress.id;
      }
      if (selectedCoupon) {
        const couponAmount = (subTotal - totalPrice).toFixed(2);
        payload.couponCode = selectedCoupon.code || selectedCoupon.name || '';
        payload.couponAmount = couponAmount;
      }
      console.log('Sending placeOrder payload:', payload);
      const response = await axios.post(`${BASE_URL}/user/order/addv1`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('placeOrder API response:', response.data);
      dispatch(setCartItems([]));
      dispatch(calculateTotal());
      localStorage.removeItem('cart');
      localStorage.removeItem('lastRestaurantUrl');
      return { type: 'success', message: 'Order placed successfully!' };
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.cartItems = action.payload;
      console.log('Set cartItems:', action.payload);
    },
    setRedirectUrl(state, action) {
      state.redirectUrl = action.payload;
    },
    setOrderType(state, action) {
      state.orderType = action.payload;
    },
    setSelectedCoupon(state, action) {
      state.selectedCoupon = action.payload;
      if (!action.payload) {
        state.totalPrice = state.originalTotalPrice;
        state.subTotal = state.originalTotalPrice;
      }
    },
    setShowPopup(state, action) {
      state.showPopup = action.payload;
    },
    setShowAddressForm(state, action) {
      state.showAddressForm = action.payload;
    },
    setIsEditAddress(state, action) {
      state.isEditAddress = action.payload;
    },
    setShowAuthPrompt(state, action) {
      state.showAuthPrompt = action.payload;
    },
    setUserAddress(state, action) {
      state.userAddress = action.payload;
    },
    calculateTotal(state) {
      console.log('Calculating total for cartItems:', state.cartItems);
      let totalQuantity = state.cartItems.reduce((sum, item) => sum + Math.floor(item.quantity || 1), 0);
      let totalPrice = 0;
      state.cartItems.forEach((item) => {
        const basePrice = item.priceInfo?.price || 0;
        if (!item.priceInfo?.price) {
          console.warn('Missing priceInfo for item:', item);
        }
        let addOnPrice = 0;
        const addOns = item.addons || item.CartAddOns || [];
        if (addOns.length > 0) {
          addOnPrice = addOns.reduce((sum, addon) => {
            const addonPrice = addon.priceInfo?.price || addon.product?.priceInfo?.price || 0;
            return sum + addonPrice;
          }, 0);
        }
        const itemTotal = (basePrice + addOnPrice) * Math.floor(item.quantity || 1);
        totalPrice += itemTotal;
      });
      state.totalComponents = totalQuantity;
      state.originalTotalPrice = totalPrice;
      state.subTotal = totalPrice;
      if (!state.selectedCoupon) {
        state.totalPrice = totalPrice;
      }
      console.log('Calculated totals:', { totalQuantity, totalPrice });
    },
    // Add custom reducer for optimistic updates
    updateQuantityOptimistic(state, action) {
      const { cartId, quantity } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item.id === cartId ? { ...item, quantity } : item
      );
      console.log('Optimistic update applied:', { cartId, quantity });
    },
    applyCoupon(state, action) {
      const coupon = action.payload;
      console.log('Applying coupon:', coupon);
      if (state.originalTotalPrice < (coupon.minPurchaseAmount || 0)) {
        state.showPopup = {
          type: 'error',
          message: `Minimum purchase of ₹${coupon.minPurchaseAmount || 0} required for ${coupon.code || ''}`,
        };
        return;
      }
      state.selectedCoupon = coupon;
      let discount = 0;
      if (coupon.isPercentage) {
        discount = (state.originalTotalPrice * coupon.discount) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discount || 0;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      }
      state.totalPrice = Math.max(0, state.originalTotalPrice - discount);
      state.showPopup = {
        type: 'success',
        message: `Coupon ${coupon.code || ''} applied! Saved ₹${discount.toFixed(2)}`,
      };
      console.log('Coupon applied, new totalPrice:', state.totalPrice);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.orderStatus = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        state.orderStatus = null;
        console.log('fetchCartItems fulfilled, cartItems:', action.payload);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.orderStatus = { type: 'error', message: action.payload || 'Failed to load cart items.' };
        state.showAuthPrompt = true;
        console.log('fetchCartItems rejected:', action.payload);
      })
      .addCase(fetchCoupons.pending, (state) => {
        state.couponLoading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.couponLoading = false;
        state.orderStatus = { type: 'error', message: action.payload || 'Failed to load coupons.' };
      })
      .addCase(fetchUserAddress.pending, (state) => {
        state.addressLoading = true;
      })
      .addCase(fetchUserAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.userAddress = action.payload;
      })
      .addCase(fetchUserAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.showPopup = { type: 'error', message: action.payload || 'Failed to load address.' };
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        state.showPopup = { type: 'success', message: 'Item removed from cart!' };
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.orderStatus = { type: 'error', message: action.payload || 'Failed to remove item.' };
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { cartId, quantity } = action.payload;
        state.cartItems = state.cartItems.map((item) =>
          item.id === cartId ? { ...item, quantity } : item
        );
        state.showPopup = { type: 'success', message: 'Cart quantity updated!' };
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.orderStatus = { type: 'error', message: action.payload || 'Failed to update quantity.' };
      })
      .addCase(placeOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderStatus = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.orderLoading = false;
        state.orderStatus = { type: 'success', message: 'Order placed successfully!' };
        state.cartItems = [];
        state.totalComponents = 0;
        state.totalPrice = 0;
        state.subTotal = 0;
        state.originalTotalPrice = 0;
        state.selectedCoupon = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lastRestaurantUrl');
          localStorage.setItem('cart', JSON.stringify([]));
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderStatus = { type: 'error', message: action.payload || 'Failed to place order.' };
      });
  },
});

export const {
  setCartItems,
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
} = cartSlice.actions;

export default cartSlice.reducer;