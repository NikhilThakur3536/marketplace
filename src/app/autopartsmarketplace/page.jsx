"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "./components/Layout";
import { Button } from "./components/Button";
import { Icon } from "./components/Icon";
import { Input } from "./components/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import debounce from "lodash/debounce";
import { useLanguage } from "./context/languageContext";

export default function HomePage() {
  const router = useRouter();
  const { selectedLanguageId, setSelectedLanguageId } = useLanguage();
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [brandSlideIndex, setBrandSlideIndex] = useState(0);
  const [modelSlideIndex, setModelSlideIndex] = useState(0);
  const [yearStart, setYearStart] = useState(null);
  const [yearEnd, setYearEnd] = useState(null);

  const itemsPerSlide = 6;

  // Fetch languages on mount
  const fetchLanguages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const languageResponse = await axios.post(
        `${BASE_URL}/user/language/list`,
        { limit: 10, offset: 0 },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      if (languageResponse.data?.success && languageResponse.data?.data?.length > 0) {
        setLanguages(languageResponse.data.data);
        if (!selectedLanguageId) {
          setSelectedLanguageId(languageResponse.data.data[0].id);
        }
      } else {
        // console.log("No languages found");
        setLanguages([]);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to load languages.",
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  }, [router, selectedLanguageId, setSelectedLanguageId]);

  // Fetch manufacturers on mount or language change
  const fetchManufacturers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const manufacturerResponse = await axios.post(
        `${BASE_URL}/user/manufacturer/list`,
        { limit: 10, offset: 0 },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      if (manufacturerResponse.data?.success && manufacturerResponse.data?.data?.length > 0) {
        setBrands(manufacturerResponse.data.data);
      } else {
        // console.log("No manufacturers found");
        setBrands([]);
;
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to load manufacturers.",
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  }, [router]);

  // Fetch models when brand is selected
  const fetchModels = useCallback(
    debounce(async (brandId, search, yearStart, yearEnd) => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
        if (!token || !brandId) {
          setModels([]);
          return;
        }

        const modelPayload = {
          limit: 10,
          offset: 0,
          manufacturedId: brandId,
        };
        if (search) {
          modelPayload.name = search;
        }
        if (yearStart) {
          modelPayload.yearStart = parseInt(yearStart);
        }
        if (yearEnd) {
          modelPayload.yearEnd = parseInt(yearEnd);
        }

        const modelResponse = await axios.post(
          `${BASE_URL}/user/productModel/list`,
          modelPayload,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );

        if (modelResponse.data?.success && modelResponse.data?.data?.length > 0) {
          setModels(modelResponse.data.data);
        } else {
          // console.log("No models found for selected brand or filters");
          setModels([]);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setShowPopup({
          type: "error",
          message: error.response?.data?.message || "Failed to load models.",
        });
        setTimeout(() => setShowPopup(null), 3000);
      }
    }, 300),
    [router]
  );

  // Fetch products
  const fetchProducts = useCallback(
    debounce(async (search, brandId, modelId) => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
        if (!token) {
          router.push("/autopartsmarketplace/login");
          return;
        }

        const productPayload = {
          limit: 4000,
          offset: 0,
          languageId: selectedLanguageId,
        };
        if (brandId) {
          productPayload.manufacturerId = brandId;
        }
        if (modelId) {
          productPayload.productModelId = modelId;
        }
        if (search && !brandId && !modelId) {
          productPayload.searchKey = search;
        }

        const productResponse = await axios.post(
          `${BASE_URL}/user/product/listv2`,
          productPayload,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );

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
              price: `₹${price.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              originalPrice: `₹${originalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              discount,
              rating: 4.5,
              reviews: 100,
              image: product.productImages?.[0]?.url || "/placeholder.svg?height=200&width=200",
              freeShipping: true,
              inStock: parseFloat(variant?.inventory?.quantity || 0) > 0,
              isFavorite: false,
              variantId: variant?.id || null,
            };
          });
          setProducts(apiProducts);
        } else {
          // console.log("No products found");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setShowPopup({
          type: "error",
          message: error.response?.data?.message || "Failed to load products.",
        });
        setTimeout(() => setShowPopup(null), 3000);
      }
    }, 300),
    [router, selectedLanguageId]
  );

  // Fetch languages and manufacturers on mount
  useEffect(() => {
    fetchLanguages();
    fetchManufacturers();
  }, [fetchLanguages, fetchManufacturers]);

  // Fetch models when brand or filters change
  useEffect(() => {
    if (selectedBrandId) {
      fetchModels(selectedBrandId, searchTerm, yearStart, yearEnd);
    } else {
      setModels([]);
    }
  }, [selectedBrandId, searchTerm, yearStart, yearEnd, fetchModels]);

  useEffect(() => {
    if (selectedLanguageId) {
      fetchProducts(searchTerm, selectedBrandId, selectedModelId);
    }
  }, [searchTerm, selectedBrandId, selectedModelId, selectedLanguageId, fetchProducts]);

  // Memoize brands and languages to prevent reference changes
  const memoizedBrands = useMemo(() => brands, [brands]);
  const memoizedLanguages = useMemo(() => languages, [languages]);

  const handleYearChange = (type, value) => {
    const year = value ? parseInt(value) : null;
    const currentYear = new Date().getFullYear() + 1;
    if (year && (year < 1900 || year > currentYear)) {
      setShowPopup({
        type: "error",
        message: `Please enter a valid year between 1900 and ${currentYear}.`,
      });
      setTimeout(() => setShowPopup(null), 3000);
      return;
    }
    if (type === "start") {
      setYearStart(year);
    } else {
      setYearEnd(year);
    }
  };

  const handleBrandClick = (brand) => {
    setSelectedBrandId(brand.id);
    setSelectedModelId(null);
    setModelSlideIndex(0);
  };

  const handleModelClick = (model) => {
    setSelectedModelId(model.id);
  };

  const handleLanguageChange = (languageId) => {
    setSelectedLanguageId(languageId);
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSearchTerm("");
    setYearStart(null);
    setYearEnd(null);
    setBrandSlideIndex(0);
    setModelSlideIndex(0);
    setBrands([]);
    setModels([]);
    fetchManufacturers(); // Re-fetch brands for new language
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setYearStart(null);
    setYearEnd(null);
    setBrandSlideIndex(0);
    setModelSlideIndex(0);
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
    if (!token) {
      setShowPopup({ type: "error", message: "Please log in to add item to cart." });
      setTimeout(() => {
        setShowPopup(null);
        router.push("/autopartsmarketplace/login");
      }, 1000);
      return;
    }
    try {
      if (!product.variantId) throw new Error("Variant ID not found.");
      const cartResponse = await axios.post(
        `${BASE_URL}/user/cart/listv2`,
        { languageId: selectedLanguageId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const cartItems = cartResponse.data?.data?.rows || [];
      const existingItem = cartItems.find(
        (item) => item.product?.id === product.id && item.varientId === product.variantId
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        await axios.post(
          `${BASE_URL}/user/cart/edit`,
          { cartId: existingItem.id, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        setShowPopup({ type: "success", message: `${product.name} quantity updated in cart!` });
      } else {
        const cartItem = { productId: product.id, quantity: 1, varientId: product.variantId };
        await axios.post(`${BASE_URL}/user/cart/addv2`, cartItem, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setShowPopup({ type: "success", message: `${product.name} added successfully to cart!` });
      }
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setShowPopup({ type: "error", message: "Failed to add to cart. Please try again." });
    } finally {
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const toggleFavorite = async (e, product) => {
    e.stopPropagation();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

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
    const endpoint = newFavoriteState ? "/user/favoriteProduct/add" : "/user/favoriteProduct/remove";
    const action = newFavoriteState ? "added to" : "removed from";

    try {
      await axios.post(
        `${BASE_URL}${endpoint}`,
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === product.id ? { ...p, isFavorite: newFavoriteState } : p))
      );

      setShowPopup({
        type: "success",
        message: `Product ${action} favorites.`,
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

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleBrandPrev = () => {
    setBrandSlideIndex((prev) => Math.max(prev - itemsPerSlide, 0));
  };

  const handleBrandNext = () => {
    setBrandSlideIndex((prev) =>
      Math.min(prev + itemsPerSlide, Math.ceil(memoizedBrands.length / itemsPerSlide) * itemsPerSlide - itemsPerSlide)
    );
  };

  const handleModelPrev = () => {
    setModelSlideIndex((prev) => Math.max(prev - itemsPerSlide, 0));
  };

  const handleModelNext = () => {
    setModelSlideIndex((prev) =>
      Math.min(prev + itemsPerSlide, Math.ceil(models.length / itemsPerSlide) * itemsPerSlide - itemsPerSlide)
    );
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
          <Icon
            name="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search by item or brand"
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 text-white"
              onClick={toggleFilter}
              aria-expanded={isFilterOpen}
            >
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

        {isFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleFilter}
              aria-hidden="true"
            ></div>
            <div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-slate-800 rounded-lg z-50 overflow-y-auto max-h-[80vh]"
              aria-hidden={!isFilterOpen}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={toggleFilter}
                    aria-label="Close filter popup"
                  >
                    <Icon name="x" size={16} />
                  </Button>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white mb-2">Language</h3>
                  <div className="relative">
                    <select
                      value={selectedLanguageId || ""}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {memoizedLanguages.length === 0 ? (
                        <option value="" disabled>
                          Loading languages...
                        </option>
                      ) : (
                        memoizedLanguages.map((language) => (
                          <option key={language.id} value={language.id}>
                            {language.name}
                          </option>
                        ))
                      )}
                    </select>
                    <Icon
                      name="globe"
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white mb-2">Title and Brand</h3>
                  <div className="w-full p-2 bg-slate-700 rounded-lg">
                    <div className="relative">
                      <div className="grid grid-rows-2 grid-cols-3 gap-2">
                        {memoizedBrands.slice(brandSlideIndex, brandSlideIndex + itemsPerSlide).map((brand) => (
                          <Button
                            key={brand.id}
                            variant="outline"
                            className={`bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-10 text-ellipsis overflow-hidden whitespace-nowrap ${
                              selectedBrandId === brand.id ? "bg-blue-600 border-blue-600" : ""
                            }`}
                            onClick={() => handleBrandClick(brand)}
                          >
                            {brand.name}
                          </Button>
                        ))}
                        {memoizedBrands.slice(brandSlideIndex, brandSlideIndex + itemsPerSlide).length <
                          itemsPerSlide &&
                          Array(
                            itemsPerSlide -
                              memoizedBrands.slice(brandSlideIndex, brandSlideIndex + itemsPerSlide).length
                          )
                            .fill()
                            .map((_, index) => (
                              <div key={`empty-brand-${index}`} className="h-10"></div>
                            ))}
                      </div>
                      {memoizedBrands.length > itemsPerSlide && (
                        <div className="flex justify-between mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-slate-700 text-white hover:bg-slate-600"
                            onClick={handleBrandPrev}
                            disabled={brandSlideIndex === 0}
                            aria-label="Previous brands"
                          >
                            <Icon name="chevron-left" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-slate-700 text-white hover:bg-slate-600"
                            onClick={handleBrandNext}
                            disabled={
                              brandSlideIndex >=
                              Math.ceil(memoizedBrands.length / itemsPerSlide) * itemsPerSlide - itemsPerSlide
                            }
                            aria-label="Next brands"
                          >
                            <Icon name="chevron-right" size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white mb-2">Model</h3>
                  {selectedBrandId ? (
                    models.length > 0 ? (
                      <div className="w-full p-2 bg-slate-700 rounded-lg">
                        <div className="relative">
                          <div className="grid grid-rows-2 grid-cols-3 gap-2">
                            {models.slice(modelSlideIndex, modelSlideIndex + itemsPerSlide).map((model) => (
                              <Button
                                key={model.id}
                                variant="outline"
                                className={`bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-10 text-ellipsis overflow-hidden whitespace-nowrap ${
                                  selectedModelId === model.id ? "bg-blue-600 border-blue-600" : ""
                                }`}
                                onClick={() => handleModelClick(model)}
                              >
                                {model.name}
                              </Button>
                            ))}
                            {models.slice(modelSlideIndex, modelSlideIndex + itemsPerSlide).length <
                              itemsPerSlide &&
                              Array(
                                itemsPerSlide -
                                  models.slice(modelSlideIndex, modelSlideIndex + itemsPerSlide).length
                              )
                                .fill()
                                .map((_, index) => (
                                  <div key={`empty-model-${index}`} className="h-10"></div>
                                ))}
                          </div>
                          {models.length > itemsPerSlide && (
                            <div className="flex justify-between mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-slate-700 text-white hover:bg-slate-600"
                                onClick={handleModelPrev}
                                disabled={modelSlideIndex === 0}
                                aria-label="Previous models"
                              >
                                <Icon name="chevron-left" size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-slate-700 text-white hover:bg-slate-600"
                                onClick={handleModelNext}
                                disabled={
                                  modelSlideIndex >=
                                  Math.ceil(models.length / itemsPerSlide) * itemsPerSlide - itemsPerSlide
                                }
                                aria-label="Next models"
                              >
                                <Icon name="chevron-right" size={16} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-sm">No models available</div>
                    )
                  ) : (
                    <div className="text-gray-300 text-sm">Select a brand first</div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white mb-2">Year Range</h3>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Start Year"
                      value={yearStart || ""}
                      onChange={(e) => handleYearChange("start", e.target.value)}
                      className="bg-slate-700 text-white border-slate-600"
                    />
                    <Input
                      type="number"
                      placeholder="End Year"
                      value={yearEnd || ""}
                      onChange={(e) => handleYearChange("end", e.target.value)}
                      className="bg-slate-700 text-white border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Category</h3>
                  <div className="text-gray-300 text-sm">Coming soon...</div>
                </div>
              </div>
            </div>
          </>
        )}

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
                      addToCart(product);
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