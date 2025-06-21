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
  const [activeSection, setActiveSection] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const { id } = useParams();
  const router = useRouter();

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

        const formattedProducts = fetchedProducts.map((product) => {
          const colorSpec = product.specifications.find((spec) => spec.specKey === "Color");
          const color = colorSpec ? colorSpec.specValue : product.variants?.[0]?.colors?.[0] || "Silver";
          const storage = product.variants?.[0]?.varientLanguages?.[0]?.name || product.variants?.[0]?.storage?.[0] || "512GB";

          return {
            id: product.id,
            name: product.productLanguages?.[0]?.name || "Unknown Product",
            description: product.productLanguages?.[0]?.longDescription || product.productLanguages?.[0]?.description || "No description available",
            specifications: [
              ...(product.specifications || []),
              { specKey: "Manufacturer", specValue: product.manufacturer?.name || "N/A" },
              { specKey: "Category", specValue: product.category?.categoryLanguages?.[0]?.name || "N/A" },
              { specKey: "Compatibility", specValue: product.compatibilities?.[0]?.notes || "N/A" },
              { specKey: "SKU", specValue: product.varients?.[0]?.sku || "N/A" },
              { specKey: "Battery Life", specValue: "50 hours" }, // Derived from longDescription
            ],
            reviews: product.reviews || [],
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            price: product.varients?.[0]?.inventory?.price || 0,
            discountedPrice: product.discountedPrice && Number.isFinite(product.discountPrice)
              ? parseFloat(product.discountedPrice) : product.variants?.[0]?.discountedPrice || null,
            discountPercentage: product.discountPercentage && Number.isFinite(product.discountPercentage)
              ? parseFloat(product.discountPercentage) : product.variants?.[0]?.discountPercentage || null,
            image: product.productImages?.[0]?.url || "/placeholder.png",
            colors: product.variants?.[0]?.colors || [color],
            storage: product.variants?.[0]?.storage || [storage.split(" ")[0]],
            isFavorite: product.isFavorite || false,
            variantId: product.varients?.[0]?.id || null,
          };
        });

        const selectedProduct = formattedProducts.find((p) => p.id.toString() === id.toString());

        if (!selectedProduct) throw new Error("Product not found.");

        setProduct(selectedProduct);
        setSelectedColor(selectedProduct.colors[0]);

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
    const token = localStorage.getItem("userToken");
    if (!token) {
      setShowAuthPopup(true);
      return;
    }

    try {
      if (!product.variantId) throw new Error("Variant ID not found for this product.");

      const cartItem = {
        productId: product.id,
        quantity,
        varientId: product.variantId,
      };

      await axios.post(`${BASE_URL}/user/cart/addv2`, cartItem, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCartMessage(`${product.name} added successfully to cart!`);
      setTimeout(() => setCartMessage(""), 3000);

      setCartItems((prev) => [...prev, { ...cartItem, name: product.name }]);

    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setCartMessage("Failed to add to cart. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

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
            <div className="flex gap-2">
              <span className="font-bold text-2xl text-black">
                ₹{product.price.toLocaleString()}
              </span>
              {product.discountedPrice && (
                <s className="text-sm text-gray-500 transform translate-y-1">
                  ₹{product.discountedPrice.toLocaleString()}
                </s>
              )}
              {product.discountPercentage && (
                <span className="bg-[#dcfce7] text-[#166534] font-bold px-2 py-1 rounded-lg border border-[#166534]">
                  {product.discountPercentage}% Off
                </span>
              )}
            </div>
            <hr className="h-[1px] w-full border-none bg-gray-400 rounded-xl mt-1" />
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div
                onClick={() => setActiveSection("description")}
                className={`cursor-pointer p-3 rounded-lg border ${
                  activeSection === "description"
                    ? "bg-green-100 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <h4 className="font-medium text-gray-800 text-sm">Description</h4>
                {activeSection === "description" && (
                  <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                )}
              </div>
              <div
                onClick={() => setActiveSection("specifications")}
                className={`cursor-pointer p-3 rounded-lg border ${
                  activeSection === "specifications"
                    ? "bg-green-100 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <h4 className="font-medium text-gray-800 text-sm">Specifications</h4>
                {activeSection === "specifications" && (
                  <div className="text-sm text-gray-600 mt-2">
                    {product.specifications.length > 0 ? (
                      product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-1Контроллер: py-1 border-b border-gray-100">
                          <span>{spec.specKey || spec.label || "N/A"}</span>
                          <span>{spec.specValue || spec.value || "N/A"}</span>
                        </div>
                      ))
                    ) : (
                      <p>No specifications available</p>
                    )}
                  </div>
                )}
              </div>
              <div
                onClick={() => setActiveSection("reviews")}
                className={`cursor-pointer p-3 rounded-lg border ${
                  activeSection === "reviews"
                    ? "bg-green-100 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <h4 className="font-medium text-gray-800 text-sm">Reviews</h4>
                {activeSection === "reviews" && (
                  <div className="text-sm text-gray-600 mt-2">
                    {product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 py-2">
                          <p>{review.comment || "No comment"}</p>
                          <span className="text-xs text-gray-400">{review.name || "Anonymous"}</span>
                        </div>
                      ))
                    ) : (
                      <p>No reviews available</p>
                    )}
                  </div>
                )}
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
            <div className="mb-6 relative">
              <button
                onClick={addToCart}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              {cartMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-xs w-full">
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
            {showAuthPopup && (
              <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <p className="text-center text-gray-800 mb-4">
                    Please login first to add item to cart.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setShowAuthPopup(false);
                        router.push("/electronicsmarketplace/login");
                      }}
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthPopup(false);
                        router.push("/electronicsmarketplace/register");
                      }}
                      className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}