"use client";

import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Button } from "./components/Button";
import { Icon } from "./components/Icon";
import { Input } from "./components/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);

  const staticProducts = [
    {
      id: "1",
      name: "Brembo Front Brake Pad Set P85121",
      brand: "Brembo",
      price: "₹2,450",
      originalPrice: "₹3,200",
      discount: "-23%",
      rating: 4.5,
      reviews: 128,
      image: "/placeholder.svg?height=200&width=200",
      freeShipping: true,
      inStock: true,
    },
    {
      id: "2",
      name: "Brembo Front Brake Pad Set P54030",
      brand: "Brembo",
      price: "₹2,890",
      originalPrice: "₹3,750",
      discount: "-23%",
      rating: 4.7,
      reviews: 95,
      image: "/placeholder.svg?height=200&width=200",
      freeShipping: true,
      inStock: true,
    },
    {
      id: "3",
      name: "Brembo Front Brake Pad Set P28034",
      brand: "Brembo",
      price: "₹3,120",
      originalPrice: "₹4,050",
      discount: "-23%",
      rating: 4.6,
      reviews: 156,
      image: "/placeholder.svg?height=200&width=200",
      freeShipping: true,
      inStock: false,
    },
    {
      id: "4",
      name: "Brembo Front Brake Pad Set P28023",
      brand: "Brembo",
      price: "₹2,750",
      originalPrice: "₹3,580",
      discount: "-23%",
      rating: 4.4,
      reviews: 87,
      image: "/placeholder.svg?height=200&width=200",
      freeShipping: true,
      inStock: true,
    },
  ];

  const categories = [
    { name: "Brake", icon: "🛞", color: "bg-blue-600" },
    { name: "Engine", icon: "⚙️", color: "bg-green-600" },
    { name: "Suspension", icon: "🔧", color: "bg-purple-600" },
  ];

  const brands = ["BMW", "AUDI", "MERC", "TOYO", "NISS", "FORD"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await axios.post(`${BASE_URL}/user/product/listv2`, {
          limit: 4000,
          offset: 0,
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success && response.data?.data?.rows?.length > 0) {
          const apiProducts = response.data.data.rows.map((product) => {
            const variant = product.varients[0];
            const price = variant?.inventory?.price || 0;
            const originalPrice = price * 1.3; // Assume 30% discount for original price
            const discount = "-23%"; // Static discount for consistency
            return {
              id: product.id,
              name: product.productLanguages[0]?.name || "Unknown Product",
              brand: "Generic", // API doesn't provide brand
              price: `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              originalPrice: `₹${originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              discount,
              rating: 4.5, // Static rating as API doesn't provide
              reviews: 100, // Static reviews as API doesn't provide
              image: "/placeholder.svg?height=200&width=200", // Fallback image
              freeShipping: true, // Static value
              inStock: parseFloat(variant?.inventory?.quantity || 0) > 0,
            };
          });
          setProducts(apiProducts);
        } else {
          setProducts(staticProducts); // Fallback to static data
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(staticProducts); // Fallback to static data on error
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input placeholder="Search in Motrparts Store" className="pl-10" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`${category.color} rounded-lg p-4 text-center cursor-pointer`}
              onClick={() => router.push(`/category/${category.name.toLowerCase()}`)}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-white font-medium text-sm">{category.name} Parts</div>
            </div>
          ))}
        </div>

        {/* Search by Brands */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search by Brands</h2>
            <Button variant="link" className="text-blue-400 p-0 h-auto">
              Learn More
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {brands.map((brand) => (
              <Button
                key={brand}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-12"
                onClick={() => router.push(`/brand/${brand.toLowerCase()}`)}
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>

        {/* Flash Sale Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full inline-block mb-2">
                Flash Sale
              </div>
              <div className="text-2xl font-bold text-white">50% OFF</div>
              <div className="text-white/90 text-sm">First time buyers</div>
              <div className="text-white/80 text-xs mt-1">⏰ 12 hours left</div>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </div>

        {/* Filter and View Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white">
              <Icon name="filter" size={14} className="mr-2" />
              Filter
            </Button>
            <div className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">Brake Pads</div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-600" : "bg-slate-700"}`}
              onClick={() => setViewMode("grid")}
            >
              <Icon name="grid" size={16} className="text-white" />
            </button>
            <button
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-600" : "bg-slate-700"}`}
              onClick={() => setViewMode("list")}
            >
              <Icon name="list" size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                {product.freeShipping && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Free Shipping
                  </div>
                )}
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {product.discount}
                  </div>
                )}
                <button
                  className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to favorites logic
                  }}
                >
                  <Icon name="heart" size={16} />
                </button>
              </div>
              <div className="p-3">
                <div className="text-xs text-blue-400 mb-1">{product.brand}</div>
                <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Icon name="star" size={12} className="text-yellow-400" />
                  <span className="text-xs text-gray-300">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">{product.price}</div>
                    <div className="text-xs text-gray-400 line-through">{product.originalPrice}</div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!product.inStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic
                    }}
                  >
                    {product.inStock ? "Add" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}