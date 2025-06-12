"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import ProductCard from "./ProductCard";
import CategoryTabs from "./CategoryTabs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = debounce((term) => onSearch(term.trim()), 300);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
      />
    </div>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "ALL" }]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (categoryId = null, searchTerm = "") => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to view products.");
      if (!BASE_URL) throw new Error("API configuration is missing.");

      const payload = {
        limit: 20, 
        offset: 0,
        languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        ...(categoryId && categoryId !== "all" && { categoryId }),
        ...(searchTerm && { searchKey: searchTerm }),
      };

      const response = await axios.post(`${BASE_URL}/user/product/listv2`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const fetchedProducts = response.data?.data?.rows || [];
      console.log("products",response.data?.data?.rows)
      const uniqueCategories = [
        { id: "all", name: "ALL" },
        ...[...new Map(
          fetchedProducts
            .filter((product) => product.category?.id && product.category?.categoryLanguages?.[0]?.name)
            .map((product) => [
              product.category.id,
              {
                id: product.category.id,
                name: product.category.categoryLanguages[0].name || product.category.code || "Unknown",
              },
            ])
        ).values()],
      ];

      setCategories(uniqueCategories.length > 1 ? uniqueCategories : [{ id: "all", name: "ALL" }]);

      const formattedProducts = fetchedProducts.map((product) => ({
        id: product.id,
        name: product.productLanguages?.[0]?.name || "Unknown Product",
        specs: Array.isArray(product.specifications)
          ? product.specifications
              .map((spec) => `${spec.specKey}: ${spec.specValue}`)
              .join(", ") || "N/A"
          : "N/A",
        price: Number.isFinite(product.varients?.[0]?.inventory?.price)
          ? product.varients[0].inventory.price
          : 0,
        isFavorite: product.isFavorite || false,
        categoryId: product.category?.id || product.categoryId,
        image: product.productImages?.[0]?.url || "/laptop.png",
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : err.message || "Failed to load products."
      );
      setCategories([{ id: "all", name: "ALL" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    fetchProducts(categoryId, searchKey);
  };

  const handleSearch = (term) => {
    setSearchKey(term);
    fetchProducts(activeCategory, term);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <CategoryTabs
          categories={categories}
          onCategoryChange={handleCategoryChange}
          activeTab={activeCategory}
        />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array(4).fill().map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 font-medium">Error: {error}</p>
            <button
              onClick={() => fetchProducts(activeCategory, searchKey)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 font-medium">No products found.</p>
            {searchKey && (
              <button
                onClick={() => handleSearch("")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-24">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}