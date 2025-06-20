"use client";

import { useState, useEffect } from "react";
import Layout  from "../../components/Layout";
import { Card, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Icon } from "../../components/Icon";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useCart } from "../../context/cartContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [popup,setPopup] = useState("")
  const { cartItemCount, fetchCartItemCount } = useCart();

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
          description:
            rawProduct.productLanguages?.[0]?.description ||
            "No description available for this product.",
          specifications: rawProduct.specifications.map((spec) => ({
            name: spec.specKey || "N/A",
            value: spec.specValue || "N/A",
          })),
          images: rawProduct.productImages?.length
            ? rawProduct.productImages.map((img) => img.url)
            : ["/placeholder.svg?height=400&width=400"],
          inStock: rawProduct.varients?.[0]?.inventory?.quantity > 0,
          freeShipping: true,
          variantId: rawProduct.varients?.[0]?.id || null,
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
    const token = localStorage.getItem("userToken");
    if (!token) {
      setPopup("Login In First To Add Item To Cart")
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
        }
      );

      console.log("Cart list response:", cartResponse.data);
      const cartItems = cartResponse.data?.data?.rows || [];
      const existingItem = cartItems.find(
        (item) => item.product?.id === product.id && item.varientId === product.variantId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
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
        console.log("Edit cart response:", editResponse.data); 
        setCartMessage(`${product.name} quantity updated in cart!`);
      } else {
        const cartItem = {
          productId: product.id,
          quantity,
          varientId: product.variantId,
        };

        const addResponse = await axios.post(`${BASE_URL}/user/cart/addv2`, cartItem, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Add to cart response:", addResponse.data); 
        setCartMessage(`${product.name} added successfully to cart!`);
      }

      await fetchCartItemCount(); // Refresh cart count
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setCartMessage("Failed to add to cart. Please try again.");
    } finally {
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
        <div className="p-4 text-center text-gray-400">Loading product...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
        <div className="p-4 text-center text-red-400">{error}</div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
        <div className="p-4 text-center text-gray-400">Product not found.</div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton title="Product Details" cartItemCount={cartItemCount}>
      <div className="p-4">
        {/* Product Images */}
        <div className="relative mb-4">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-64 object-contain"
            />
          </div>
          {product.discount && (
            <Badge variant="danger" className="absolute top-2 right-2">
              {product.discount}
            </Badge>
          )}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button className="bg-slate-700/80 backdrop-blur-sm p-2 rounded-full">
              <Icon name="heart" size={20} className="text-white" />
            </button>
            <button className="bg-slate-700/80 backdrop-blur-sm p-2 rounded-full">
              <Icon name="share" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <div className="text-sm text-blue-400 mb-1">{product.brand}</div>
          <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Icon name="star" size={16} className="text-yellow-400" />
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">{product.originalPrice}</span>
            )}
          </div>
          {product.freeShipping && (
            <div className="mt-2">
              <Badge variant="success">Free Shipping</Badge>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <Card className="mb-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-l-md"
                  disabled={quantity <= 1}
                >
                  <Icon name="minus" size={16} />
                </button>
                <div className="w-10 h-8 flex items-center justify-center bg-slate-700 border-x border-slate-600">
                  {quantity}
                </div>
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-r-md"
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex border-b border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "description" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "specifications" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "reviews" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>
          <div className="py-4">
            {activeTab === "description" && <p className="text-sm text-gray-300">{product.description}</p>}
            {activeTab === "specifications" && (
              <div className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-400">{spec.name}</span>
                    <span className="text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">Reviews coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 relative">
          <Button variant="primary" className="flex-1" onClick={addToCart}>
            Add to Cart
          </Button>
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
          {popup && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-xs w-full">
              <p>{popup}</p>
              <button
                onClick={() => setPopup("")}
                className="ml-4 text-white hover:text-gray-200"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}