"use client";

import { useParams, useRouter } from "next/navigation";
import { MapPin, Star, ChevronDown, Clock, ChevronRight, Search, Filter, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../../components/ItemCard";
import BottomNav from "../../../components/BottomNavbar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function Restaurants() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sortBy: "price_high_to_low",
    isVeg: true,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.warn("Invalid cart data in localStorage, resetting to empty array");
          setCartItems([]);
          localStorage.setItem("cart", JSON.stringify([]));
        }
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        setCartItems([]);
        localStorage.setItem("cart", JSON.stringify([]));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [cartItems]);

  // Listen for storage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(newCart)) {
            setCartItems(newCart);
          }
        } catch (error) {
          console.error("Error parsing updated cart from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Show popup when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

   const addToCart = (itemId) => {
    if (!itemId) {
      console.error("Invalid itemId provided to addToCart");
      return;
    }
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { id: itemId, quantity: 1 }];
      }
      return newCart;
    });
  };  


  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilterOptions((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setIsFilterBoxOpen(false);
    fetchRestaurantAndMenu();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      sortBy: "price_high_to_low",
      isVeg: true,
    });
    setIsFilterBoxOpen(false);
  };

  // Fetch restaurant and menu
  const fetchRestaurantAndMenu = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching with storeId:", id); // Debug: Log storeId
      const token = localStorage.getItem("token");
      console.log("Token:", token ? "Present" : "Missing"); // Debug: Log token presence

      if (!BASE_URL) {
        throw new Error("BASE_URL is not defined");
      }
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }
      if (!id) {
        throw new Error("No store ID provided");
      }

      // Fetch store data
      const storeResponse = await axios.post(
        `${BASE_URL}/user/store/list`,
        { limit: 1, offset: 0},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Store API response:", storeResponse.data); // Debug: Log full response
      const storeData = storeResponse.data.data?.rows?.[0];
      if (!storeData) {
        throw new Error(`No restaurant found for storeId: ${id}`);
      }

      const restaurantData = {
        id: storeData.id || id,
        name: storeData.name || storeData.location?.name || "Unknown Restaurant",
        rating: storeData.rating || "N/A",
        totalReviews: storeData.totalReviews || "0",
        costForTwo: storeData.costForTwo || "₹20",
        location: storeData.location?.name || "Unknown Location",
        deliveryTime: storeData.deliveryTime || "30-45 min",
        itemsServ: storeData.itemsServ || "Various",
      };
      setRestaurant(restaurantData);

      // Fetch menu data
      const menuResponse = await axios.post(
        `${BASE_URL}/user/product/listv1`,
        {
          limit: 40,
          offset: 0,
          sortBy: filterOptions.sortBy,
          isVeg: filterOptions.isVeg,
          storeId: id,
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
          ...(debouncedSearchQuery && { searchKey: debouncedSearchQuery }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Menu API response:", menuResponse.data); // Debug: Log full response
      const items = menuResponse.data.data?.rows || [];

      const categoryMap = {};
      items.forEach((item) => {
        const categoryId = item?.category?.id || "0";
        const categoryName =
          item?.category?.categoryLanguages?.find(
            (lang) => lang?.languageId === "2bfa9d89-61c4-401e-aae3-346627460558"
          )?.name || "Uncategorized";

        if (categoryId && !categoryMap[categoryId]) {
          categoryMap[categoryId] = { id: categoryId, name: categoryName };
        }
      });

      const uniqueCategories = Object.values(categoryMap);
      setCategories(uniqueCategories);

      const mappedItems = items.map((item) => ({
        id: item?.id || item?.productId || `${Date.now()}-${Math.random()}`,
        productId: item?.productId || item?.id || "default-product-id",
        isVeg: item?.isVeg ?? true,
        name: item?.productLanguages?.[0]?.name || "Unnamed Item",
        price: `${parseFloat(
          item.varients?.[0]?.productVarientUoms?.[0]?.inventory?.price || 10
        ).toFixed(2)}`,
        discountedPrice: `${parseFloat(
          item.varients?.[0]?.productVarientUoms?.[0]?.inventory?.price || item?.price || 8
        ).toFixed(2)}`,
        rating: item?.rating || 4.0,
        totalReviews: item?.totalReviews || "100+",
        description: item?.productLanguages?.[0]?.shortDescription || "No description available",
        image: item?.image || "/placeholder.jpg",
        category: item?.category || {},
        categoryName:
          item?.category?.categoryLanguages?.find(
            (lang) => lang?.languageId === "2bfa9d89-61c4-401e-aae3-346627460558"
          )?.name || "Uncategorized",
        productVarientUomId: item?.varients?.[0]?.productVarientUoms[0]?.id || "",
        variants: item?.variants || [],
        addonDetails: item?.addons || [],
      }));

      setMenuItems(mappedItems);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = "Failed to load restaurant data. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
        localStorage.removeItem("token");
        router.push("/login");
      } else if (error.response?.status === 404) {
        errorMessage = `Restaurant not found for ID: ${id}`;
      } else if (error.message.includes("No restaurant found")) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setRestaurant(null);
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRestaurantAndMenu();
    } else {
      setError("Invalid store ID");
      setIsLoading(false);
    }
  }, [id, debouncedSearchQuery, filterOptions]);

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory ? item.category?.id === selectedCategory : true;
    return matchesCategory;
  });

  const fullMenuItems = selectedTab
    ? menuItems.filter((item) => item.category?.id === selectedTab)
    : [];

  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading restaurant...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">{error}</p>
        <button
          onClick={fetchRestaurantAndMenu}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!id) {
    return <div className="container mx-auto p-4">Invalid store ID</div>;
  }

  return (
    <div className="flex justify-center overflow-x-hidden">
      {isFullMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
          onClick={() => setIsFullMenuOpen(false)}
        ></div>
      )}

      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[120] transition-opacity duration-300 opacity-100">
          Item added to cart!
        </div>
      )}

      <BottomNav />
      <div className="max-w-md w-full relative">
        <div className="w-full bg-black h-8 flex items-center px-2">
          <Link href="/foodmarketplace">
            <span className="text-white text-sm">Home</span>
          </Link>
          <span className="text-white text-sm mx-2">/</span>
          <span className="text-white text-sm">{restaurant?.name || "Loading..."}</span>
          <Link href="/foodmarketplace/cart" className="absolute right-2 flex items-center">
            <div className="relative">
              <ShoppingCart color="white" size={20} className="transform -translate-x-1" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
        <div className="bg-gradient-to-b from-white to-gray-200 h-44 rounded-b-xl flex flex-col justify-center p-2">
          <h1 className="text-black font-bold text-2xl mb-2 mt-1">{restaurant?.name || "Loading..."}</h1>
          {restaurant && (
            <div className="border border-gray-200 bg-white rounded-xl w-full h-full p-2 flex flex-col gap-2">
              <div className="w-full flex justify-between gap-1">
                <div className="flex gap-1 transform translate-y-1">
                  <div className="w-fit h-fit rounded-full bg-green-700 p-1">
                    <Star size={10} color="white" fill="white" />
                  </div>
                  <span className="text-xs font-semibold">
                    {restaurant.rating} ({restaurant.totalReviews} reviews)
                  </span>
                  <div className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700/80 rounded-lg h-4 px-2">
                    <p className="text-[0.5rem] text-white">Top Rated</p>
                  </div>
                </div>
                <div className="bg-orange-600 rounded-lg flex justify-center items-center p-1">
                  <p className="text-[0.6rem] text-white font-semibold">{restaurant.costForTwo} for two</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg w-full flex justify-between items-center p-2">
                <div className="flex items-center justify-center gap-1">
                  <div className="bg-blue-700 w-fit h-fit rounded-full p-1 flex items-center justify-center">
                    <MapPin size={10} color="white" />
                  </div>
                  <p className="text-[0.5rem] text-black font-semibold">Outlet:</p>
                  <span className="text-[0.5rem] text-black font-medium">{restaurant.location}</span>
                  <ChevronDown size={10} color="black" />
                </div>
                <div className="flex gap-1 items-center">
                  <Clock size={10} color="black" />
                  <span className="text-black text-[0.5rem] font-medium">{restaurant.deliveryTime}</span>
                </div>
              </div>
              <div className="w-full flex justify-between">
                <div className="flex gap-2 flex-wrap">
                  {restaurant.itemsServ?.split(",")?.map((cuisine, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center whitespace-nowrap bg-gray-200 border border-black/30 p-1 rounded-lg text-[0.7rem] font-semibold"
                    >
                      <p>{cuisine.trim()}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsFullMenuOpen(!isFullMenuOpen)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-md flex items-center justify-center py-1 px-2"
                >
                  <p className="text-white text-[0.5rem] font-medium">Full Menu</p>
                  <ChevronRight color="white" size={10} />
                </button>
              </div>
            </div>
          )}
        </div>

        {isFullMenuOpen && (
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bottom-0 bg-white z-[100] max-h-screen overflow-y-auto transition-all duration-300 ease-in-out pb-20 rounded-b-xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 z-10 p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Full Menu</h2>
              <button onClick={() => setIsFullMenuOpen(false)}>
                <X size={20} color="white" />
              </button>
            </div>
            <div className="w-full px-2 flex gap-2 mt-3 overflow-x-auto pb-2 border-b border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedTab(category.id)}
                  className={`w-fit flex items-center justify-center p-2 rounded-t-lg transition-all duration-200 ${
                    selectedTab === category.id
                      ? "border-b-2 border-orange-500 text-orange-500 font-semibold bg-gray-50"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <p className="text-sm font-medium px-2">{category.name}</p>
                </button>
              ))}
            </div>
            <div className="w-full flex flex-col gap-3 mt-4 p-3">
              {selectedTab ? (
                fullMenuItems.length > 0 ? (
                  fullMenuItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      id={item.id}
                      productId={item.productId}
                      isVeg={item.isVeg}
                      name={item.name}
                      price={item.price}
                      discountedPrice={item.discountedPrice}
                      description={item.description}
                      image={item.image}  
                      variants={item.variants}
                      addonDetails={item.addonDetails}
                      productVarientUomId={item.productVarientUomId}
                      addToCart={addToCart}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-600">No items in this category.</p>
                )
              ) : (
                <p className="text-center text-gray-600">Select a category to view items.</p>
              )}
            </div>
          </div>
        )}

        <div className="w-full mt-4 bg-gray-50 rounded-lg h-12 flex items-center px-2 border border-gray-400">
          <div className="w-full flex justify-between bg-white gap-2">
            <div className="flex gap-2 border border-gray-400 w-[80%] rounded-lg px-1 items-center">
              <Search color="gray" size={20} />
              <input
                type="text"
                placeholder="Search by product name..."
                className="outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterBoxOpen(!isFilterBoxOpen)}
                className="bg-white flex items-center justify-center px-4 py-1 border border-gray-400 rounded-lg"
              >
                <Filter size={18} color="black" />
                <p className="text-[0.5rem] font-semibold ml-1">Filter</p>
              </button>
              {isFilterBoxOpen && (
                <div className="absolute top-full right-0 mt-2 w-full sm:w-64 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4 z-[100]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-black">Filters</h2>
                    <button onClick={() => setIsFilterBoxOpen(false)}>
                      <X size={20} color="black" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-black">Sort By</h3>
                      <select
                        name="sortBy"
                        value={filterOptions.sortBy}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg bg-white h-10 text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="price_high_to_low">Price: High to Low</option>
                        <option value="price_low_to_high">Price: Low to High</option>
                        <option value="rating_high_to_low">Rating: High to Low</option>
                        <option value="rating_low_to_high">Rating: Low to High</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-black">Preference</h3>
                      <label className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          name="isVeg"
                          checked={filterOptions.isVeg}
                          onChange={handleFilterChange}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-black">Vegetarian Only</span>
                      </label>
                    </div>
                    <div className="flex justify-between gap-2 mt-2">
                      <button
                        onClick={resetFilters}
                        className="flex-1 py-2 px-4 rounded-lg bg-gray-200 text-black text-sm font-semibold hover:bg-gray-300"
                      >
                        Reset
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 py-2 px-4 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full px-1 flex gap-3 mt-8 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("")}
            className={`w-fit flex items-center justify-center p-1 rounded-lg ${
              selectedCategory === "" ? "bg-orange-600 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <p className="text-sm font-medium px-2">All</p>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-fit flex items-center justify-center p-1 rounded-lg ${
                selectedCategory === category.id ? "bg-orange-600 text-white" : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm font-medium px-2">{category.name}</p>
            </button>
          ))}
        </div>
        <div className="w-full flex flex-col gap-2 mt-4 pb-20">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading menu items...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                productId={item.productId}
                isVeg={item.isVeg}
                name={item.name}
                price={item.price}
                discountedPrice={item.discountedPrice}
                rating={item.rating}
                totalReviews={item.totalReviews}
                description={item.description}
                image={item.image}
                variants={item.variants}
                addonDetails={item.addonDetails}
                productVarientUomId={item.productVarientUomId}
                addToCart={addToCart}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">
              No items found{searchQuery ? ` for "${searchQuery}"` : ""} in the selected category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}