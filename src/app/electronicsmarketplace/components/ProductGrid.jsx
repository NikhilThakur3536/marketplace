"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import CategoryTabs from "./CategoryTabs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "ALL" }]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCategoryName, setActiveCategoryName] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Categories state updated:", categories);
  }, [categories]);

  const fetchProducts = async (categoryId = null) => {
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
        ...(categoryId && categoryId !== "all" && { categoryId }),
      };

      console.log("Fetching products with payload:", payload);

      const response = await axios.post(`${BASE_URL}/user/product/listv2`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Products API response:", response.data);

      const fetchedProducts = response.data?.data?.rows || [];

      // Log category IDs to verify consistency
      fetchedProducts.forEach((product, index) => {
        console.log(`Product ${index}: categoryId=${product.categoryId}, category.id=${product.category?.id}`);
      });

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

      console.log("Extracted categories:", uniqueCategories);

      const finalCategories = uniqueCategories.length > 1 ? uniqueCategories : [{ id: "all", name: "ALL" }];
      setCategories(finalCategories);
      console.log("Set categories with ID:", finalCategories, Date.now());

      const formattedProducts = fetchedProducts.map((product) => ({
        id: product.id,
        name: product.productLanguages?.[0]?.name || "Unknown Product",
        specs: product.varients?.[0]?.varientLanguages?.[0]?.name || "N/A",
        price: Number.isFinite(product.varients?.[0]?.inventory?.price)
          ? product.varients?.[0]?.inventory?.price
          : 0,
        isFavorite: product.isFavorite || false,
        categoryId: product.category?.id || product.categoryId, // Use category.id if available
      }));

      setProducts(formattedProducts);
      console.log("Formatted products:", formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.message || "Failed to load products. Please try again.");
      setCategories([{ id: "all", name: "ALL" }]);
      console.log("Set categories on error:", [{ id: "all", name: "ALL" }], Date.now());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (categoryId, categoryName) => {
    console.log("handleCategoryChange called with:", categoryId, categoryName);
    setActiveCategory(categoryId);
    setActiveCategoryName(categoryName);
    fetchProducts(categoryId); // Removed searchKey
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.categoryId === activeCategory);

  console.log("Filtered products:", filteredProducts);
  console.log("Categories before rendering CategoryTabs:", categories);

  if (loading) {
    return <div className="text-center text-gray-500 py-4">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <CategoryTabs
        categories={categories}
        onCategoryChange={handleCategoryChange}
        activeTab={activeCategory}
      />
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No products available.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}