"use client";

import { ChevronLeft, Star, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const { id } = useParams();
  const router = useRouter();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error("Invalid cart data in localStorage, resetting to empty array");
          setCartItems([]);
          localStorage.setItem("cart", JSON.stringify([]));
        }
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        setCartItems([]);
        localStorage.setItem("cart", JSON.stringify([]));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Listen for storage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(newCart)) {
            setCartItems(newCart);
          }
        } catch (error) {
          console.error("Error parsing updated cart from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");
        if (!BASE_URL) throw new Error("API base URL is not set.");

        const payload = {
          limit: 4000,
          offset: 0,
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        };

        const response = await axios.post(`${BASE_URL}/user/product/listv2`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const fetchedProducts = response.data?.data?.rows || [];
        
        if (!fetchedProducts.length) throw new Error("No products found.");

        const formattedProducts = fetchedProducts.map((product) => ({
          id: product.id,
          name: product.productLanguages?.[0]?.name || "Unknown Product",
          description:
            product.productLanguages?.[0]?.description || "No description available",
          specifications: product.specifications || [],
          reviews: product.reviews || [],
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          price: Number.isFinite(product.price)
            ? parseFloat(product.price)
            : Number.isFinite(product.varients?.[0]?.inventory?.price)
              ? parseFloat(product.varients?.[0]?.inventory?.price)
              : 0,
          discountedPrice: product.discountedPrice && Number.isFinite(product.discountPrice)
            ? parseFloat(product.discountedPrice) : product.varients?.[0]?.discountedPrice || null,
          discountPercentage: product.discountPercentage && Number.isFinite(product.discountPercentage)
            ? parseFloat(product.discountPercentage) : product.varients?.[0]?.discountPercentage || null,
          image: product.productImages?.[0]?.url || "/placeholder.png",
          colors: product.varients?.[0]?.colors || ["Silver"],
          storage: product.varients?.[0]?.storage || ["512GB"],
          isFavorite: product.isFavorite || false,
          varientId: product.varients?.[0]?.id || null,
        }));

        const selectedProduct = formattedProducts.find((p) => p.id.toString() === id.toString());

        if (!selectedProduct) throw new Error("Product not found.");

        setProduct(selectedProduct);
        setSelectedColor(selectedProduct.colors?.[0] || "");
        setSelectedStorage(selectedProduct.storage?.[0] || "");
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError(err.message || "Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  const updateQuantity = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      if (!product.varientId) throw new Error("Variant ID not found for this product.");

      // Update server-side cart
      const cartItem = {
        productId: product.id,
        quantity,
        varientId: product.varientId,
      };

      await axios.post(`${BASE_URL}/user/cart/addv2`, cartItem, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update client-side cart
      setCartItems((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id && item.varientId === product.varientId);
        let newCart;
        if (existingItem) {
          newCart = prevCart.map((item) =>
            item.id === product.id && item.varientId === product.varientId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart = [...prevCart, { id: product.id, varientId: product.varientId, quantity }];
        }
        return newCart;
      });

      setCartMessage(`${product.name} added to cart!`);
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setCartMessage("Failed to add to cart. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  // Calculate total cart item count for notification badge
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const starCount = [1, 2, 3, 4, 5];

  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-500 py-4">Product not found.</div>;
  }

  return (
    <div className="w-screen flex justify-center bg-[#f9fafb] h-screen overflow-y-auto">
      <div className="max-w-md w-full flex flex-col">
        <div className="w-full bg-white flex justify-between p-2 sticky top-0 z-10">
          <ChevronLeft
            color="black"
            size={20}
            onClick={() => router.push("/electronicsmarketplace")}
            className="cursor-pointer"
          />
          <span className="text-2xl font-semibold text-black">Product</span>
          <div className="relative">
            <ShoppingCart
              size={20}
              color="black"
              className="transform translate-y-1 cursor-pointer"
              onClick={() => router.push("/electronicsmarketplace/cart")}
            />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
        <div className="w-full px-2 pb-6">
          <div className="w-full h-56 bg-blue-200 relative rounded-xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-1">
              {starCount.map((item) => (
                <Star
                  key={item}
                  size={15}
                  fill={item <= Math.floor(product.rating) ? "#facc15" : "none"}
                  stroke={item <= Math.floor(product.rating) ? "none" : "#facc15"}
                />
              ))}
              <div className="flex gap-1 transform -translate-y-1">
                <span className="text-gray-700 text-sm">{product.rating}</span>
                <span className="text-gray-700 text-sm">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
            <h2 className="font-bold text-2xl text-black">{product.name}</h2>
            <h3 className="text-gray-600 text-sm">
              {Array.isArray(product.specifications)
                ? product.specifications
                    .map((spec) => spec.specValue || spec.value || "N/A")
                    .filter(Boolean)
                    .join(", ")
                : "N/A"}
            </h3>
            <div className="flex gap-2">
              <span className="font-bold text-2xl text-black">
                ${product.price.toLocaleString()}
              </span>
              {product.discountedPrice && (
                <s className="text-sm text-gray-500 transform translate-y-1">
                  ${product.discountedPrice.toLocaleString()}
                </s>
              )}
              {product.discountPercentage && (
                <span className="bg-[#dcfce7] text-[#166534] font-bold px-2 py-1 rounded-lg border border-[#166534]">
                  {product.discountPercentage}% Off
                </span>
              )}
            </div>
            <hr className="h-[1px] w-full border-none bg-gray-400 rounded-xl mt-1" />
            <div className="flex flex-col gap-4">
              <h2 className="text-black font-bold text-2xl">Color</h2>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-2 py-1 border border-green-600 rounded-lg ${
                      selectedColor === color
                        ? "bg-[#22c55e] text-white"
                        : "bg-white text-green-600"
                    }`}
                  >
                    <span className="font-bold text-lg">{color}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-black font-bold text-2xl">Storage</h2>
              <div className="flex gap-2">
                {product.storage.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-2 py-1 border border-green-600 rounded-lg ${
                      selectedStorage === storage
                        ? "bg-[#22c55e] text-white"
                        : "bg-white text-green-600"
                    }`}
                  >
                    <span className="font-bold text-lg">{storage}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(1)}
                  className="h-10 w-10 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mb-6">
              <button
                onClick={addToCart}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              {cartMessage && (
                <p
                  className={`mt-2 text-center text-sm ${
                    cartMessage.includes("Failed") ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {cartMessage}
                </p>
              )}
            </div>
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                {[
                  { id: "description", label: "Description" },
                  { id: "specifications", label: "Specifications" },
                  { id: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    aria-selected={activeTab === tab.id}
                    role="tab"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                {activeTab === "description" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Product Description</h4>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}
                {activeTab === "specifications" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Technical Specifications
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {product.specifications.map((spec, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-2 border-b border-gray-100"
                          >
                            <span className="text-gray-600">{spec.specKey || spec.label}</span>
                            <span className="font-medium text-gray-900">
                              {spec.specValue || spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Customer Reviews</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {starCount.map((item) => (
                            <Star
                              key={item}
                              className={`h-4 w-4 ${
                                item <= Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} out of 5 ({product.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {product.reviews.length > 0 ? (
                        product.reviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {review.name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">{review.name}</span>
                              </div>
                              <div className="flex items-center">
                                {starCount.map((item) => (
                                  <Star
                                    key={item}
                                    className={`h-3 w-3 ${
                                      item <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No reviews yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}