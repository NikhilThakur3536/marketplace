"use client";

import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Card, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Icon } from "../../components/Icon";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import { useChat } from "../../context/chatContext";
import ChatInterface from "../../components/ChatInterface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [popup, setPopup] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { cartItemCount, fetchCartItemCount } = useCart();
  const { initiateChat, chatError } = useChat();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/autopartsmarketplace/login");
          return;
        }

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

        const products = response.data?.data?.rows || [];
        if (!products.length) throw new Error("No products found.");

        const rawProduct = products.find((p) => p.id === id);
        if (!rawProduct) throw new Error("Product not found.");

        const formattedProduct = {
          id: rawProduct.id,
          name: rawProduct.productLanguages?.[0]?.name || "Unknown Product",
          brand: rawProduct.category?.categoryLanguages?.[0]?.name || "Generic",
          price: `₹${rawProduct.varients?.[0]?.inventory?.price.toLocaleString() || "N/A"}`,
          originalPrice: rawProduct.varients?.[0]?.inventory?.originalPrice
            ? `₹${rawProduct.varients[0].inventory.originalPrice.toLocaleString()}`
            : null,
          discount: rawProduct.varients?.[0]?.inventory?.discountPercentage
            ? `-${rawProduct.varients[0].inventory.discountPercentage}%`
            : null,
          rating: 4.5,
          reviews: 128,
          shortDescription: rawProduct.productLanguages?.[0]?.shortDescription,
          description:
            rawProduct.productLanguages?.[0]?.longDescription ||
            "No description available for this product.",
          specifications: Array.isArray(rawProduct.specifications)
            ? rawProduct.specifications.map((spec) => ({
                name: spec.specKey || "Specifications",
                value: spec.specValue || "N/A",
              }))
            : [],
          images: rawProduct.productImages?.length
            ? rawProduct.productImages.map((img) => img.url)
            : ["/placeholder.svg?height=400&width=400"],
          inStock: rawProduct.varients?.[0]?.inventory?.quantity > 0,
          variantId: rawProduct.varients?.[0]?.id || null,
          inventoryId: rawProduct.varients?.[0]?.inventory?.id || null,
          sellerId: rawProduct.store?.id || null,
          sellerName:rawProduct.store?.name
        };

        setProduct(formattedProduct);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError(err.message || "Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, router]);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPopup("Login In First To Add Item To Cart");
      setTimeout(() => {
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
        },
      );

      const cartItems = cartResponse.data?.data?.rows || [];
      const existingItem = cartItems.find(
        (item) => item.product?.id === product.id && item.varientId === product.variantId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await axios.post(
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
          },
        );
        setCartMessage(`${product.name} quantity updated in cart!`);
      } else {
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
      }

      await fetchCartItemCount();
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setCartMessage("Failed to add to cart. Please try again.");
    } finally {
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  const toggleChat = async () => {
    if (!isChatOpen) {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup("Please log in to start a chat.");
        setTimeout(() => {
          router.push("/autopartsmarketplace/login");
        }, 1000);
        return;
      }

      if (!product?.sellerId || !product?.id || !product?.variantId || !product?.inventoryId) {
        setPopup("Missing product or seller information.");
        return;
      }

      const chatId = await initiateChat(
        product.sellerId,
        product.id,
        product.variantId,
        product.inventoryId
      );

      if (chatId) {
        setIsChatOpen(true);
      } 
    } else {
      setIsChatOpen(false);
    }
  };

  if (loading) {
    return (
      <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
        <div className="p-6 text-center text-gray-500">Loading product...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
        <div className="p-6 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
        <div className="p-6 text-center text-gray-500">Product not found.</div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
      <div className="p-6 max-w-md mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Product Images and Info */}
          <div>
            {/* Product Images */}
            <div className="relative mb-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 object-contain p-4"
                />
              </div>
              {product.discount && (
                <Badge variant="danger" className="absolute top-4 right-4 text-sm font-bold">
                  {product.discount}
                </Badge>
              )}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-full hover:bg-slate-700 transition">
                  <Icon name="share" size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="mb-6">
              <div className="text-sm text-blue-400 mb-2">{product.brand}</div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-white mb-2 pr-4">{product.name}</h1>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  <Icon name="star" size={18} className="text-yellow-400" />
                  <span className="ml-1 text-sm text-white">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-white">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                )}
              </div>
              {product.freeShipping && (
                <Badge variant="success" className="mt-2">Free Shipping</Badge>
              )}
              <p className="text-gray-300 mt-4">{product.shortDescription}</p>
            </div>

            {/* Quantity Selector, Actions, and Chat Button */}
            <Card className="mb-6 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-300">Quantity</span>
                  <div className="flex items-center bg-slate-700 rounded-md overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-600 transition"
                      disabled={quantity <= 1}
                    >
                      <Icon name="minus" size={16} className="text-white" />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center text-white">
                      {quantity}
                    </div>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-600 transition"
                    >
                      <Icon name="plus" size={16} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={toggleChat}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white flex items-center justify-center gap-2"
                    aria-label="Toggle Chat"
                  >
                    <Icon name={isChatOpen ? "x" : "message-circle"} size={20} />
                    {isChatOpen ? "Close Chat" : "Chat with Seller"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Details Sections */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                  <p className="text-sm text-gray-300">{product.description}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Specifications</h2>
                  <div className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-400">{spec.name}</span>
                        <span className="text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Reviews</h2>
                  <p className="text-sm text-gray-400">Reviews coming soon</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chat Interface */}
          {isChatOpen && (
            <ChatInterface
              onClose={toggleChat}
              productId={product.id}
              variantId={product.variantId}
              inventoryId={product.inventoryId}
              productName={product.name} 
              productImage={product.image}
              productDescription={product.description}
              productSeller={product.sellerName}
            />
          )}
        </div>

        {/* Notifications */}
        {cartMessage && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-60 flex items-center gap-4 max-w-md w-full">
            <p>{cartMessage}</p>
            <button
              onClick={() => setCartMessage("")}
              className="text-white hover:text-gray-200"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        )}
        {popup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-60 flex items-center gap-4 max-w-md w-full">
            <p>{popup}</p>
            <button
              onClick={() => setPopup("")}
              className="text-white hover:text-gray-200"
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