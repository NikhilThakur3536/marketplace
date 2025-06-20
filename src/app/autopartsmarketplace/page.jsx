"use client";

import { useState, useEffect, useCallback } from "react";
import Layout from "./components/Layout";
import { Button } from "./components/Button";
import { Icon } from "./components/Icon";
import { Input } from "./components/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import debounce from "lodash/debounce";

export default function HomePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { name: "Brake", icon: "🛞", color: "bg-blue-600" },
    { name: "Engine", icon: "⚙️", color: "bg-green-600" },
    { name: "Suspension", icon: "🔧", color: "bg-purple-600" },
  ];

  const fetchData = useCallback(
    debounce(async (search, brandId) => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        if (!token) {
          router.push("/autopartsmarketplace/login");
          return;
        }

        // Fetch manufacturers
        const manufacturerResponse = await axios.post(
          `${BASE_URL}/user/manufacturer/list`,
          {
            limit: 10,
            offset: 0,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Manufacturer List Response:", manufacturerResponse.data);

        if (manufacturerResponse.data?.success && manufacturerResponse.data?.data?.length > 0) {
          setBrands(manufacturerResponse.data.data);
        } else {
          console.log("No manufacturers found");
        }

        // Fetch products
        const productPayload = {
          limit: 4000,
          offset: 0,
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        };
        if (search) {
          productPayload.searchKey = search;
        } else if (brandId) {
          productPayload.manufacturerId = brandId;
        }

        const productResponse = await axios.post(
          `${BASE_URL}/user/product/listv2`,
          productPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Product List Response:", productResponse.data);

        if (productResponse.data?.success && productResponse.data?.data?.rows?.length > 0) {
          const apiProducts = productResponse.data.data.rows.map((product) => {
            const variant = product.varients[0];
            const price = variant?.inventory?.price || 0;
            const originalPrice = price * 1.3;
            const discount = "-23%";
            return {
              id: product.id,
              name: product.productLanguages[0]?.name || "Unknown Product",
              brand: product.manufacturer?.name || "Generic",
              price: `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              originalPrice: `₹${originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              discount,
              rating: 4.5,
              reviews: 100,
              image: product.productImages?.[0]?.url || "/placeholder.svg?height=200&width=200",
              freeShipping: true,
              inStock: parseFloat(variant?.inventory?.quantity || 0) > 0,
              isFavorite: false,
            };
          });
          setProducts(apiProducts);
        } else {
          console.log("No products found");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowPopup({
          type: "error",
          message: error.response?.data?.message || "Failed to load data.",
        });
        setTimeout(() => setShowPopup(null), 3000);
      }
    }, 300),
    [router]
  );

  useEffect(() => {
    fetchData(searchTerm, selectedBrandId);
  }, [searchTerm, selectedBrandId, fetchData]);

  const handleBrandClick = (manufacturerId) => {
    setSelectedBrandId(manufacturerId);
    setSearchTerm(""); // Clear search term when selecting a brand
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedBrandId(null); // Clear brand selection when searching
  };

  const toggleFavorite = async (e, product) => {
    e.stopPropagation();
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectUrl", "/autopartsmarketplace");
      }
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

    const newFavoriteState = !product.isFavorite;
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

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, isFavorite: newFavoriteState } : p
        )
      );

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

  return (
    <Layout>
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

        <div className="relative mb-6">
          <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search by item or brand"
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

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

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search by Brands</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {brands.map((brand) => (
              <Button
                key={brand.id}
                variant="outline"
                className={`bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-12 ${
                  selectedBrandId === brand.name ? "bg-blue-600 border-blue-600" : ""
                }`}
                onClick={() => handleBrandClick(brand.name)}
              >
                {brand.name}
              </Button>
            ))}
          </div>
        </div>

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

        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
              onClick={() => router.push(`/autopartsmarketplace/product/${product.id}`)}
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
                  onClick={(e) => toggleFavorite(e, product)}
                >
                  <Icon
                    name="heart"
                    size={16}
                    className={product.isFavorite ? "text-red-500" : "text-white"}
                  />
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