"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Layout from "./components/Layout";
import { Button } from "./components/Button";
import { Icon } from "./components/Icon";
import { Input } from "./components/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import debounce from "lodash/debounce";
import { useLanguage } from "./context/languageContext";
import { useFavorite } from "./context/favoriteContext";
import { useCart } from "./context/cartContext";
import { Toaster } from "react-hot-toast";

// Memoized ProductCard component to prevent unnecessary re-renders
const ProductCard = memo(({ product, onToggleFavorite, onAddToCart, onIncrement, onDecrement, router }) => {
  return (
    <div
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
        <button
          className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
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
          {product.inCart ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 text-white hover:bg-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement(product);
                }}
                disabled={product.cartQuantity <= 1}
              >
                <Icon name="minus" size={12} />
              </Button>
              <span className="text-white text-sm">{Math.floor(product.cartQuantity)}</span>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 text-white hover:bg-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement(product);
                }}
              >
                <Icon name="plus" size={12} />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              {product.inStock ? "Add" : "Out of Stock"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export default function HomePage() {
  const router = useRouter();
  const { selectedLanguageId, setSelectedLanguageId } = useLanguage();
  const { isFavorite, toggleFavorite, showPopup } = useFavorite();
  const { addToCart, updateCartQuantity, fetchCartItemCount } = useCart();
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [brandSlideIndex, setBrandSlideIndex] = useState(0);
  const [modelSlideIndex, setModelSlideIndex] = useState(0);
  const [localShowPopup, setLocalShowPopup] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerSlide = 6;

  // Fetch languages
  const fetchLanguages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
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
        setLanguages([]);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      setLocalShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to load languages.",
      });
      setTimeout(() => setLocalShowPopup(null), 300);
    }
  }, [selectedLanguageId, setSelectedLanguageId]);

  // Fetch manufacturers
  const fetchManufacturers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
      const manufacturerResponse = await axios.post(
        `${BASE_URL}/user/manufacturer/list`,
        { limit: 10, offset: 0 },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      if (manufacturerResponse.data?.success && manufacturerResponse.data?.data?.length > 0) {
        setBrands(manufacturerResponse.data.data);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      setLocalShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to load manufacturers.",
      });
      setTimeout(() => setLocalShowPopup(null), 300);
    }
  }, []);

  // Fetch models
  const fetchModels = useCallback(
    debounce(async (brandId, search) => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
        const modelPayload = {
          limit: 10,
          offset: 0,
          manufacturedId: brandId,
        };
        if (search) {
          modelPayload.name = search;
        }
        const modelResponse = await axios.post(
          `${BASE_URL}/user/productModel/list`,
          modelPayload,
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );
        if (modelResponse.data?.success && modelResponse.data?.data?.length > 0) {
          setModels(modelResponse.data.data);
        } else {
          setModels([]);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setLocalShowPopup({
          type: "error",
          message: error.response?.data?.message || "Failed to load models.",
        });
        setTimeout(() => setLocalShowPopup(null), 300);
      }
    }, 300),
    []
  );

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
      if (!token) {
        setCartItems([]);
        return;
      }
      const cartResponse = await axios.post(
        `${BASE_URL}/user/cart/listv2`,
        { languageId: selectedLanguageId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (cartResponse.data?.success) {
        setCartItems(cartResponse.data.data.rows || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart items:", err.message);
      setCartItems([]);
    }
  }, [selectedLanguageId]);

  // Fetch products
  const fetchProducts = useCallback(
    debounce(async (search, brandId, modelId, cartItems) => {
      try {
        const token = localStorage.getItem("token");
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
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
            const cartItem = cartItems.find(
              (item) => item.product?.id === product.id && item.varientId === variant?.id
            );
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
              isFavorite: isFavorite(product.id),
              variantId: variant?.id || null,
              productVarientUomId: product.variant?.productVarientUom?.[0]?.id || null,
              inCart: !!cartItem,
              cartQuantity: cartItem ? Math.floor(cartItem.quantity) : 0,
            };
          });
          setProducts(apiProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setLocalShowPopup({
          type: "error",
          message: error.response?.data?.message || "Failed to load products.",
        });
        setTimeout(() => setLocalShowPopup(null), 300);
      }
    }, 300),
    [selectedLanguageId,isFavorite]
  );

  // Update favorite status without refetching products
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        isFavorite: isFavorite(product.id),
      }))
    );
  }, [isFavorite]);

  // Fetch data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchLanguages();
      await fetchManufacturers();
      await fetchCartItems();
      if (selectedLanguageId) {
        await fetchProducts(searchTerm, selectedBrandId, selectedModelId, cartItems);
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [fetchLanguages, fetchManufacturers, fetchCartItems, selectedLanguageId]);

  // Fetch models when brand or search changes
  useEffect(() => {
    if (selectedBrandId) {
      fetchModels(selectedBrandId, searchTerm);
    } else {
      setModels([]);
    }
  }, [selectedBrandId, searchTerm, fetchModels]);

  // Fetch products when filters change
  useEffect(() => {
    if (selectedLanguageId && !isLoading) {
      fetchProducts(searchTerm, selectedBrandId, selectedModelId, cartItems);
    }
  }, [searchTerm, selectedBrandId, selectedModelId, selectedLanguageId, cartItems, fetchProducts, isLoading]);

  // Memoize brands and languages
  const memoizedBrands = useMemo(() => brands, [brands]);
  const memoizedLanguages = useMemo(() => languages, [languages]);

  // Handlers
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
    setBrandSlideIndex(0);
    setModelSlideIndex(0);
    setBrands([]);
    setModels([]);
    fetchManufacturers();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setBrandSlideIndex(0);
    setModelSlideIndex(0);
  };

  const clearFilters = () => {
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSearchTerm("");
    setBrandSlideIndex(0);
    setModelSlideIndex(0);
  };

  const handleAddToCart = async (product) => {
    try {
      if (!product.variantId) throw new Error("Variant ID not found.");
      await addToCart({
        productId: product.id,
        quantity: 1,
        varientId: product.variantId,
      });
      setLocalShowPopup({
        type: "success",
        message: `${product.name} added successfully to cart!`,
      });
      await fetchCartItems();
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setLocalShowPopup({
        type: "error",
        message: err.message === "No token" ? "Please log in to add item to cart." : "Failed to add to cart.",
      });
      if (err.message === "No token") {
        setTimeout(() => {
          setLocalShowPopup(null);
          router.push("/autopartsmarketplace/login");
        }, 1000);
      } else {
        setTimeout(() => setLocalShowPopup(null), 300);
      }
    }
  };

  const handleIncrement = async (product) => {
    try {
      const cartItem = cartItems.find(
        (item) => item.product?.id === product.id && item.varientId === product.variantId
      );
      if (cartItem) {
        const newQuantity = Math.floor(cartItem.quantity) + 1;
        await updateCartQuantity({ cartId: cartItem.id, quantity: newQuantity });
        setLocalShowPopup({
          type: "success",
          message: `${product.name} quantity updated in cart!`,
        });
        await fetchCartItems();
      }
    } catch (err) {
      console.error("Error incrementing quantity:", err.message);
      setLocalShowPopup({
        type: "error",
        message: "Failed to update quantity.",
      });
      setTimeout(() => setLocalShowPopup(null), 300);
    }
  };

  const handleDecrement = async (product) => {
    try {
      const cartItem = cartItems.find(
        (item) => item.product?.id === product.id && item.varientId === product.variantId
      );
      if (cartItem && cartItem.quantity > 1) {
        const newQuantity = Math.floor(cartItem.quantity) - 1;
        await updateCartQuantity({ cartId: cartItem.id, quantity: newQuantity });
        setLocalShowPopup({
          type: "success",
          message: `${product.name} quantity updated in cart!`,
        });
        await fetchCartItems();
      }
    } catch (err) {
      console.error("Error decrementing quantity:", err.message);
      setLocalShowPopup({
        type: "error",
        message: "Failed to update quantity.",
      });
      setTimeout(() => setLocalShowPopup(null), 300);
    }
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite({
      productId: product.id,
      name: product.name,
    });
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
        <Toaster />
        {(localShowPopup || showPopup) && (
          <div
            className={`fixed top-4 z-70 left-1/2 transform -translate-x-1/2 p-4 rounded-lg text-white ${
              (localShowPopup || showPopup).type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {(localShowPopup || showPopup).message}
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
              className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-slate-800 rounded-t-lg z-50 overflow-y-auto max-h-[80vh]"
              aria-hidden={!isFilterOpen}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-slate-700"
                    onClick={toggleFilter}
                    aria-label="Close filter popup"
                  >
                    <Icon name="x" size={16} />
                  </Button>
                </div>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white mb-2">Title and Brand</h3>
                  <div className="w-full p-2 bg-slate-700 rounded-lg">
                    <div className="relative">
                      <div className="grid grid-rows-2 grid-cols-3 gap-2">
                        {memoizedBrands
                          .slice(brandSlideIndex, brandSlideIndex + itemsPerSlide)
                          .map((brand) => (
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

                <div className="flex justify-between gap-2 pt-4 border-t border-slate-700">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 text-white hover:bg-slate-600"
                    onClick={clearFilters}
                    aria-label="Clear filters"
                  >
                    Clear Filters
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={toggleFilter}
                      aria-label="Apply filters"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {isLoading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                router={router}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}