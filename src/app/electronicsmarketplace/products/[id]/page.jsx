"use client";

import { ChevronLeft, Star, Minus, Plus, ShoppingCart, MessageCircle, Heart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const [showPopup, setShowPopup] = useState(null);
  const router = useRouter();

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    if (!token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectUrl", "/electronicsmarketplace");
      }
      setShowPopup({
        type: "error",
        message: "Please log in to manage favorites.",
      });
      setTimeout(() => {
        setShowPopup(null);
        router.push("/electronicsmarketplace/login");
      }, 2000);
      return;
    }

    const newFavoriteState = !isFavorite;
    const endpoint = newFavoriteState
      ? "/user/favoriteProduct/add"
      : "/user/favoriteProduct/remove";
    const action = newFavoriteState ? "added to" : "removed from";

    try {
      await axios.post(
        `${BASE_URL}${endpoint}`,
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsFavorite(newFavoriteState);
      setShowPopup({
        type: "success",
        message: `${product.name} ${action} favorites!`,
      });
      setTimeout(() => setShowPopup(null), 2000);
    } catch (error) {
      console.error(`Error ${action} favorite:`, error);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || `Failed to ${action} favorites.`,
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const handleCardClick = () => {
    router.push(`/electronicsmarketplace/products/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
    >
      {showPopup && (
        <div
          className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[1000] transition-opacity duration-300 ${
            showPopup.type === "success" ? "bg-blue-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {showPopup.message}
        </div>
      )}
      <div className="relative mb-3">
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          width={160}
          height={120}
          className="w-full h-4 object-cover rounded-lg bg-blue-300/30 py-4"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center"
        >
          <Heart
            size={20}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="space-y-1 mb-3 relative">
        <h3 className="font-semibold bg-gradient-to-r from-blue-500 via-violet-600 to-orange-500 bg-clip-text text-transparent line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-3 font-semibold">{product.shortDescription}</p>
        {typeof product.price === "number" && (
          <p className="font-bold text-red-600 mt-2">₹{product.price.toLocaleString()}</p>
        )}
        <button
          onClick={() => router.push(`/electronicsmarketplace/products/${product.id}`)}
          className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center ml-auto hover:bg-green-600 transition-colors absolute right-4 transform -translate-y-8"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Placeholder ChatInterface (replace with actual implementation if available)
const ChatInterface = ({ onClose }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-xl">
      <h3 className="font-semibold">Chat Placeholder</h3>
      <p className="text-sm text-gray-600">Chat functionality not implemented.</p>
      <button
        onClick={onClose}
        className="mt-2 text-red-500 hover:underline"
      >
        Close
      </button>
    </div>
  );
};

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  // Fetch main product
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
          const colorSpec = product.specifications.find((spec) => spec.specKey === "Colour");
          const color = colorSpec ? colorSpec.specValue : product.varients?.[0]?.colors?.[0] || "Silver";
          const storage = product.varients?.[0]?.varientLanguages?.[0]?.name || product.varients?.[0]?.storage?.[0] || "N/A";

          return {
            id: product.id,
            name: product.productLanguages?.[0]?.name || "Unknown Product",
            description: product.productLanguages?.[0]?.longDescription || product.productLanguages?.[0]?.description || "No description available",
            shortDescription: product.productLanguages?.[0]?.shortDescription || "No specs available",
            productModel: product.compatibilities?.[0]?.productModel?.name || "N/A",
            specifications: [
              ...(product.specifications || []),
              { specKey: "Manufacturer", specValue: product.manufacturer?.name || "N/A" },
              { specKey: "Category", specValue: product.category?.categoryLanguages?.[0]?.name || "N/A" },
              { specKey: "Product Model", specValue: product.compatibilities?.[0]?.productModel?.name || "N/A" },
              { specKey: "Compatibility", specValue: product.compatibilities?.[0]?.notes || "N/A" },
              { specKey: "SKU", specValue: product.varients?.[0]?.sku || "N/A" },
              { specKey: "Battery Life", specValue: "50 hours" },
            ],
            reviews: product.reviews || [],
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            price: product.varients?.[0]?.inventory?.price || 0,
            discountedPrice: product.discountPrice && Number.isFinite(product.discountPrice)
              ? parseFloat(product.discountPrice) : product.varients?.[0]?.[0]?.discountedPrice || null,
            discountPercentage: product.discountPercentage && Number.isFinite(product.discountPercentage)
              ? parseFloat(product.discountPercentage) : product.varients?.[0]?.[0]?.discountPercentage || null,
            image: product.productImages?.[0]?.url || "/placeholder.png",
            colors: product.varients?.[0]?.colors || [color],
            storage: product.varients?.[0]?.storage || [storage.split(" ")[0]],
            isFavorite: product.isFavorite || false,
            variantId: product.varients?.[0]?.id || null,
            categoryId: product.category?.id || null,
          };
        });

        const selectedProduct = formattedProducts.find((p) => p.id.toString() === id.toString());

        if (!selectedProduct) {
          throw new Error("Product not found.");
        }

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

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.categoryId) return;

      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          console.warn("No token found for fetching related products.");
          return;
        }

        const payload = {
          limit: 10,
          offset: 0,
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
          categoryId: product.categoryId,
        };

        const response = await axios.post(`${BASE_URL}/user/product/listv2`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const fetchedProducts = response.data?.data?.rows || [];

        const formattedProducts = fetchedProducts
          .filter((p) => p.id.toString() !== id.toString()) // Exclude current product
          .map((product) => ({
            id: product.id,
            name: product.productLanguages?.[0]?.name || "Unknown Product",
            price: product.varients?.[0]?.inventory?.price || 0,
            image: product.productImages?.[0]?.url || "/placeholder.png",
            isFavorite: product.isFavorite || false,
            shortDescription: product.productLanguages?.[0]?.shortDescription || "No specs available",
          }));

        setRelatedProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching related products:", error.message);
      }
    };

    if (product?.categoryId) {
      fetchRelatedProducts();
    }
  }, [product?.categoryId, id]);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center text-gray-600 text-lg animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center text-gray-600 text-lg">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center overflow-y-auto font-sans">
      <div className="max-w-md w-full flex flex-col relative px-4">
        {/* Header */}
        <div className="w-full bg-white flex justify-between items-center p-4 sticky top-0 z-10 shadow-md rounded-b-xl bg-opacity-90 backdrop-blur-sm">
          <button
            onClick={() => router.push("/electronicsmarketplace")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to marketplace"
          >
            <ChevronLeft color="#1f2937" size={24} className="hover:scale-110 transition-transform" onClick={()=>redirect("/electronicsmarketplace")}/>
          </button>
          <span className="text-xl font-bold text-gray-800 tracking-tight">Product Details</span>
          <div className="relative">
            <button
              onClick={() => router.push("/electronicsmarketplace/cart")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="View cart"
            >
              <ShoppingCart color="#1f2937" size={24} className="hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Product Content */}
        <div className="w-full mt-4 space-y-6">
          {/* Product Image */}
          <div className="w-full h-64 relative rounded-2xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <Image
              src={"/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-2xl text-gray-900 tracking-tight">{product.name}</h2>
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-4 py-1.5 rounded-full flex items-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-sm"
              >
                <MessageCircle size={16} />
                Chat
              </button>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{product.shortDescription}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-baseline">
                <span className="font-bold text-2xl text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.discountedPrice && (
                  <s className="text-sm text-gray-400">₹{product.discountedPrice.toLocaleString()}</s>
                )}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Model:</span> {product.productModel}
              </p>
            </div>

            <div className="flex justify-between gap-4 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Manufacturer:</span>{" "}
                {product.specifications.find((spec) => spec.specKey === "Manufacturer")?.specValue || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {product.specifications.find((spec) => spec.specKey === "Category")?.specValue || "N/A"}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {starCount.map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={star <= product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            <hr className="h-px w-full bg-gray-200 rounded-full" />

            {/* Description, Specifications, Reviews */}
            <div className="space-y-4">
              {/* Description */}
              <div className="p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              <div className="p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Specifications</h4>
                {product.specifications.length > 0 ? (
                  <table className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="border border-gray-200 px-4 py-2 font-medium">{spec.specKey || spec.label || "N/A"}</td>
                          <td className="border border-gray-200 px-4 py-2">{spec.specValue || spec.value || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-600">No specifications available</p>
                )}
              </div>

              {/* Reviews */}
              <div className="p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Reviews</h4>
                <div className="text-sm text-gray-600 space-y-3">
                  {product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-100 pb-2">
                        <p className="text-gray-700">{review.comment || "No comment"}</p>
                        <span className="text-xs text-gray-400">{review.name || "Anonymous"}</span>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Quantity</h3>
              <div className="flex items-center gap-4 bg-white p-3 rounded-full shadow-sm w-[50%]">
                <button
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(1)}
                  className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="relative">
              <button
                onClick={addToCart}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              {cartMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-1000 flex items-center justify-between max-w-xs w-full">
                  <p>{cartMessage}</p>
                  <button
                    onClick={() => setCartMessage("")}
                    className="ml-4 text-white hover:text-gray-200"
                    aria-label="Close notification"
                  >
                    ✘
                  </button>
                </div>
              )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Related Products</h3>
                <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="flex-shrink-0 w-48">
                      <ProductCard product={relatedProduct} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auth Popup */}
            {showAuthPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-1000">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <p className="text-center text-gray-700 mb-4 text-sm">
                    Please login to add items to your cart.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setShowAuthPopup(false);
                        router.push("/electronicsmarketplace/login");
                      }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthPopup(false);
                        router.push("/electronicsmarketplace/register");
                      }}
                      className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Interface */}
            {showChat && (
              <div className="fixed bottom-4 right-4 z-1000">
                <ChatInterface onClose={() => setShowChat(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}