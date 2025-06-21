"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/cartContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const { cartItemCount, fetchCartItemCount } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [formData, setFormData] = useState({
    customerAddressId: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    road: "",
    landmark: "",
    mobile: "",
    defaultAddress: false,
    label: "Home",
    latitude: "",
    longitude: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [addressError, setAddressError] = useState(null);

  const fetchCartItems = async () => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/autopartsmarketplace/login");
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/user/cart/listv2`,
      {
        languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Fetch cart items response:", response.data); // Debug
    if (response.data?.success && response.data?.data?.rows?.length >= 0) {
      const apiItems = response.data.data.rows.map((item) => ({
        id: item.id,
        productId: item.product?.id,
        variantId: item.product?.varients?.[0]?.id,
        name: item.product?.productLanguages?.[0]?.name || "Unknown Product",
        brand: item.product?.category?.categoryLanguages?.[0]?.name || "Generic",
        price: item.priceInfo?.price || 0,
        originalPrice: (item.priceInfo?.price || 0) * 1.3,
        quantity: Math.floor(item.quantity) || 1,
        image: item.product?.productImages?.[0]?.url || "/placeholder.svg",
      }));
      setCartItems(apiItems);
    } else {
      setCartItems([]);
    }
    await fetchCartItemCount();
  } catch (err) {
    console.error("Error fetching cart items:", err.message);
    setError("Failed to load cart. Please try again.");
    await fetchCartItemCount();
  } finally {
    setLoading(false);
  }
};

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const response = await axios.post(`${BASE_URL}/user/customerAddress/list`,{
          limit: 4,
          offset: 0,
        }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        
      });

      if (response.data?.success && response.data?.data?.rows) {
        setAddresses(response.data.data.rows);
        const defaultAddress = response.data.data.rows.find((addr) => addr.defaultAddress);
        setSelectedAddress(defaultAddress || response.data.data.rows[0] || null);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err.message);
      setAddressError("Failed to load addresses. Please try again.");
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, [router]);

  useEffect(() => {
    if (isEdit && userAddress) {
      setFormData({
        customerAddressId: userAddress.id || userAddress.customerAddressId || "",
        name: userAddress.name || "",
        addressLine1: userAddress.addressLine1 || "",
        addressLine2: userAddress.addressLine2 || "",
        road: userAddress.road || "",
        landmark: userAddress.landmark || "",
        mobile: userAddress.mobile || "",
        defaultAddress: userAddress.defaultAddress || false,
        label: userAddress.label || "Home",
        latitude: userAddress.latitude || "",
        longitude: userAddress.longitude || "",
      });
    } else {
      setFormData({
        customerAddressId: "",
        name: "",
        addressLine1: "",
        addressLine2: "",
        road: "",
        landmark: "",
        mobile: "",
        defaultAddress: false,
        label: "Home",
        latitude: "",
        longitude: "",
      });
    }
  }, [isEdit, userAddress]);

  const updateQuantity = async (id, newQuantity) => {
    const parsedQuantity = Math.floor(Number(newQuantity));
    if (parsedQuantity < 1 || isNaN(parsedQuantity)) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user/cart/edit`,
        {
          cartId: id,
          quantity: parsedQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        await fetchCartItems();
        setCartMessage("Quantity updated successfully!");
      } else {
        setCartMessage("Unexpected response from server.");
      }
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      console.error("Error updating quantity:", err.message);
      setCartMessage("Failed to update quantity. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user/cart/remove`,
        {
          cartId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        await fetchCartItems();
        setCartMessage("Item removed from cart!");
      } else {
        setCartMessage("Failed to remove item.");
      }
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      console.error("Error removing item:", err.message);
      setCartMessage("Failed to remove item. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, defaultAddress: e.target.checked }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setAddressError("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setLoadingLocation(false);
        setAddressError(null);
      },
      (err) => {
        setAddressError("Unable to fetch location. Please enter coordinates manually.");
        setLoadingLocation(false);
      }
    );
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.addressLine1 || (!isEdit && (!formData.latitude || !formData.longitude))) {
      setAddressError("Please fill in all required fields.");
      return;
    }
    if (isEdit && !formData.customerAddressId) {
      setAddressError("Invalid address ID. Please try again.");
      return;
    }

    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const url = isEdit ? `${BASE_URL}/user/customerAddress/edit` : `${BASE_URL}/user/customerAddress/add`;
      const payload = isEdit
        ? {
            customerAddressId: formData.customerAddressId,
            name: formData.name,
            addressLine1: formData.addressLine1,
            landmark: formData.landmark,
            defaultAddress: formData.defaultAddress,
          }
        : {
            name: formData.name,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            road: formData.road,
            landmark: formData.landmark,
            mobile: formData.mobile,
            defaultAddress: formData.defaultAddress,
            label: formData.label,
            latitude: formData.latitude,
            longitude: formData.longitude,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? "update" : "add"} address.`);
      }

      await fetchAddresses();
      setShowAddressModal(false);
      setAddressError(null);
      setCartMessage(`Address ${isEdit ? "updated" : "added"} successfully!`);
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      setAddressError(err.message || `Failed to ${isEdit ? "update" : "add"} address.`);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setCartMessage("Your cart is empty. Add items before checking out.");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }
    if (!selectedAddress) {
      setCartMessage("Please select a delivery address.");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user/order/addv2`,
        {
          timezone: "Asia/Kolkata",
          totalAmount: total.toFixed(2),
          paymentType: "CASH",
          customerAddressId: selectedAddress.id || selectedAddress.customerAddressId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setCartItems([]);
        setCartMessage("Order placed successfully!");
        await fetchCartItemCount();
        setTimeout(() => {
          setCartMessage("");
          router.push("/autopartsmarketplace");
        }, 3000);
      } else {
        setCartMessage("Failed to place order. Please try again.");
        setTimeout(() => setCartMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error placing order:", err.message);
      setCartMessage("Failed to place order. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <Layout showBackButton title="Shopping Cart" cartItemCount={cartItemCount}>
        <div className="p-4 text-center text-gray-400">Loading cart...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showBackButton title="Shopping Cart" cartItemCount={cartItemCount}>
        <div className="p-4 text-center text-red-400">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton title="Shopping Cart" cartItemCount={cartItemCount}>
      <div className="p-4 relative">
        {cartItems.length > 0 ? (
          <>
            <div className="mb-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-blue-400 mb-1">{item.brand}</div>
                        <h3 className="text-sm font-medium mb-2 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold">
                              {formatPrice(item.price * item.quantity)}
                              <span className="text-xs text-gray-400 ml-2">({formatPrice(item.price)} each)</span>
                            </div>
                            <div className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice * item.quantity)}</div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-slate-700 rounded-l-md"
                              disabled={loading}
                            >
                              <Icon name="minus" size={14} />
                            </button>
                            <div className="w-8 h-7 flex items-center justify-center bg-slate-700 border-x border-slate-600">{item.quantity}</div>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-slate-700 rounded-r-md"
                              disabled={loading}
                            >
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-400 flex items-center"
                        disabled={loading}
                      >
                        <Icon name="trash" size={14} className="mr-1" /> Remove
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-4">
              <CardContent>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Delivery Address</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEdit(false);
                      setUserAddress(null);
                      setShowAddressModal(true);
                    }}
                  >
                    Add New
                  </Button>
                </div>
                {addresses.length > 0 ? (
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-3 rounded-md border ${selectedAddress?.id === addr.id ? "border-blue-400" : "border-slate-700"} cursor-pointer`}
                        onClick={() => setSelectedAddress(addr)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium">{addr.name}</div>
                            <div className="text-xs text-gray-400">
                              {addr.addressLine1}, {addr.landmark || ""}
                            </div>
                            {addr.defaultAddress && (
                              <span className="text-xs text-blue-400">Default</span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEdit(true);
                              setUserAddress(addr);
                              setShowAddressModal(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">No addresses saved. Add a new address to proceed.</div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent>
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-green-400">- {formatPrice(discount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                  <div className="border-t border-slate-700 pt-2 mt-2">
                    <div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(total)}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="primary"
              fullWidth
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-800 rounded-full p-6 mb-4"><Icon name="cart" size={48} className="text-gray-400" /></div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-center mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button variant="primary" onClick={() => router.push("/autopartsmarketplace")}>Continue Shopping</Button>
          </div>
        )}

        {showAddressModal && (
          <div className="fixed inset-2  flex items-center justify-center z-50 p-4 backdrop-blur-sm max-h-screen">
            <Card className="w-full max-w-sm max-h-screen">
              <CardContent className="p-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{isEdit ? "Edit Address" : "Add New Address"}</h3>
                  <button onClick={() => setShowAddressModal(false)} className="text-gray-400">
                    <Icon name="x" size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddressSubmit} className="space-y-1">
                  <div>
                    <label className="text-sm text-gray-400">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-700 rounded-md p-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="w-full bg-slate-700 rounded-md p-2 text-sm"
                      required
                    />
                  </div>
                  {!isEdit && (
                    <>
                      <div>
                        <label className="text-sm text-gray-400">Address Line 2</label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleChange}
                          className="w-full bg-slate-700 rounded-md p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Road</label>
                        <input
                          type="text"
                          name="road"
                          value={formData.road}
                          onChange={handleChange}
                          className="w-full bg-slate-700 rounded-md p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Landmark</label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleChange}
                          className="w-full bg-slate-700 rounded-md p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Mobile</label>
                        <input
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full bg-slate-700 rounded-md p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Label</label>
                        <select
                          name="label"
                          value={formData.label}
                          onChange={handleChange}
                          className="w-full bg-slate-700 rounded-md p-2 text-sm"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-sm text-gray-400">Latitude *</label>
                          <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            className="w-full bg-slate-700 rounded-md p-2 text-sm"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm text-gray-400">Longitude *</label>
                          <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            className="w-full bg-slate-700 rounded-md p-2 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={getCurrentLocation}
                        disabled={loadingLocation}
                        className="mt-2"
                      >
                        {loadingLocation ? "Fetching Location..." : "Use Current Location"}
                      </Button>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="defaultAddress"
                      checked={formData.defaultAddress}
                      onChange={handleCheckboxChange}
                      className="bg-slate-700 rounded"
                    />
                    <label className="text-sm text-gray-400">Set as default address</label>
                  </div>
                  {addressError && <div className="text-xs text-red-400">{addressError}</div>}
                  <Button variant="primary" fullWidth type="submit" disabled={loadingLocation}>
                    {isEdit ? "Update Address" : "Add Address"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {cartMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-xs w-full">
            <p>{cartMessage}</p>
            <button
              onClick={() => setCartMessage("")}
              className="ml-4 text-white hover:text-gray-200"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}