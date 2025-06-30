"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [quantities, setQuantities] = useState({});
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/autopartsmarketplace/login");
          return;
        }
        const payload = {
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        };
        const response = await axios.post(`${BASE_URL}/user/favoriteProduct/listv1`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success && response.data?.data?.rows.length > 0) {
          const apiFavorites = response.data.data.rows.map((product) => {
            const variant = product.varients[0];
            const price = variant?.inventory?.price || 0;
            const originalPrice = price * 1.3;
            const discount = "-23%";
            return {
              id: product.id,
              name: product.productLanguages[0]?.name || "Unknown Product",
              brand: "Generic",
              price: `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              originalPrice: `₹${originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              discount,
              rating: 4.5,
              reviews: 100,
              image: product.productImages?.[0]?.url || "/placeholder.svg?height=200&width=200",
              inStock: parseInt(variant?.inventory?.quantity || 0) > 0,
              variantId: variant?.id || null,
            };
          });
          setFavorites(apiFavorites);
          setQuantities(apiFavorites.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {}));
        } else {
          // console.log("No favorite products found");
        }
      } catch (error) {
        console.error("Error fetching favorite products:", error);
        setShowPopup({
          type: "error",
          message: error.response?.data?.message || "Failed to load favorites.",
        });
        setTimeout(() => setShowPopup(null), 3000);
      }
    };

    fetchFavorites();
  }, [router]);

  const fetchCartItemCount = async () => {
    // Placeholder for cart item count refresh logic
    // Implement if needed or leave as is
  };

  const incrementQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: parseInt(prev[productId]) + 1,
    }));
  };

  const decrementQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: parseInt(prev[productId]) > 1 ? parseInt(prev[productId]) - 1 : 1,
    }));
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup({
        type: "error",
        message: "Login In First To Add Item To Cart",
      });
      setTimeout(() => {
        setShowPopup(null);
        router.push("/autopartsmarketplace/login");
      }, 1000);
      return;
    }

    try {
      if (!product?.variantId) throw new Error("Variant ID not found.");

      const cartResponse = await axios.post(
        `${BASE_URL}/user/cart/listv2`,
        { languageId: "2bfa9d89-61c4-401e-aae3-346627460558" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Cart list response:", cartResponse.data);
      const cartItems = cartResponse.data?.data?.rows || [];
      const existingItem = cartItems.find(
        (item) => item.product?.id === product.id && item.varientId === product.variantId
      );

      if (existingItem) {
        const newQuantity = parseInt(existingItem.quantity) + parseInt(quantities[product.id]);
        const editResponse = await axios.post(
          `${BASE_URL}/user/cart/edit`,
          {
            cartId: existingItem.id,
            quantity: newQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("Edit cart response:", editResponse.data);
        setShowPopup({
          type: "success",
          message: `${product.name} quantity updated in cart!`,
        });
      } else {
        const cartItem = {
          productId: product.id,
          quantity: parseInt(quantities[product.id]),
          varientId: product.variantId,
        };

        const addResponse = await axios.post(`${BASE_URL}/user/cart/addv2`, cartItem, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // console.log("Add to cart response:", addResponse.data);
        setShowPopup({
          type: "success",
          message: `${product.name} added successfully to cart!`,
        });
      }

      await fetchCartItemCount();
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setShowPopup({
        type: "error",
        message: "Failed to add to cart. Please try again.",
      });
    } finally {
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const removeFromFavorites = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectUrl", "/autopartsmarketplace/favorites");
      setShowPopup({
        type: "error",
        message: "Please log in to manage favorites.",
      });
      setTimeout(() => {
        setShowPopup(null);
        router.push("/autopartsmarketplace/login");
      }, 2000);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/user/favoriteProduct/remove`,
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFavorites((prev) => prev.filter((item) => item.id !== product.id));
      setShowPopup({
        type: "success",
        message: `${product.name} removed from favorites!`,
      });
      setTimeout(() => setShowPopup(null), 2000);
    } catch (error) {
      console.error("Error removing favorite:", error);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to remove from favorites.",
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  return (
    <Layout title="My Wishlist">
      <div className="p-4">
        {showPopup && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-lg text-white ${
              showPopup.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {showPopup.message}
          </div>
        )}

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div
                      className="w-24 h-24 bg-slate-700 relative cursor-pointer"
                      onClick={() => router.push(`/autopartsmarketplace/product/${item.id}`)}
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                      {/* {item.discount && (
                        <Badge variant="danger" className="absolute top-1 left-1 text-xs">
                          {item.discount}
                        </Badge>
                      )} */}
                    </div>
                    <div className="flex-1 p-3">
                      <div className="cursor-pointer" onClick={() => router.push(`/autopartsmarketplace/product/${item.id}`)}>
                        <div className="text-xs text-blue-400 mb-1">{item.brand}</div>
                        <h3 className="text-sm font-medium mb-1 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center gap-1 mb-1">
                          <Icon name="star" size={12} className="text-yellow-400" />
                          <span className="text-xs">{item.rating}</span>
                          <span className="text-xs text-gray-400">({item.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.price}</span>
                          <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge variant={item.inStock ? "success" : "danger"} className="text-xs">
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="p-1 bg-slate-700 rounded-full"
                              disabled={quantities[item.id] <= 1}
                            >
                              <Icon name="minus" size={14} className="text-white" />
                            </button>
                            <span className="text-sm">{quantities[item.id]}</span>
                            <button
                              onClick={() => incrementQuantity(item.id)}
                              className="p-1 bg-slate-700 rounded-full"
                            >
                              <Icon name="plus" size={14} className="text-white" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromFavorites(item)}
                            className="p-1.5 bg-slate-700 rounded-full"
                          >
                            <Icon name="trash" size={14} className="text-red-400" />
                          </button>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={!item.inStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-800 rounded-full p-6 mb-4">
              <Icon name="heart" size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-center mb-6">
              Save items you like by clicking the heart icon on products.
            </p>
            <Button variant="primary" onClick={() => router.push("/autopartsmarketplace")}>
              Explore Products
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}