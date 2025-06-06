"use client";

import { useParams } from "next/navigation";
import { MapPin, Star, ChevronDown, Clock, ChevronRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import BottomNav from "../../components/BottomNavbar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Restaurants() {
  const params = useParams();
  const id = params?.id;
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!BASE_URL) {
          throw new Error("BASE_URL is not defined");
        }
        if (!token) {
          throw new Error("No token found");
        }
        if (!id) {
          throw new Error("No store ID provided");
        }

        // Fetch restaurant details
        const storeResponse = await axios.post(
          `${BASE_URL}/user/store/list`,
          { limit: 1, offset: 0 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const storeData = storeResponse.data.data?.rows?.[0];
        if (!storeData) {
          throw new Error("Restaurant not found");
        }
        const restaurantData = {
          id: storeData.id || id,
          name: storeData.name || storeData.location?.name || "Unknown Restaurant",
          rating: storeData.rating || 4.0,
          totalReviews: storeData.totalReviews || "100+",
          costForTwo: storeData.costForTwo || "$20",
          location: storeData.location?.name || "Unknown Location",
          deliveryTime: storeData.deliveryTime || "30-45 min",
          itemsServ: storeData.itemsServ || "Various",
        };
        setRestaurant(restaurantData);

        // Fetch menu items
        const menuResponse = await axios.post(
          `${BASE_URL}/user/product/listv1`,
          {
            limit: 20,
            offset: 0,
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

        const items = menuResponse.data.data?.rows || [];
        console.log("menu items", menuResponse.data.data?.rows);

        // Extract unique categories by id
        const categoryMap = {};
        items.forEach((item) => {
          const categoryId = item.category?.id;
          const categoryName =
            item.category?.categoryLanguages?.find(
              (lang) => lang.languageId === "2bfa9d89-61c4-401e-aae3-346627460558"
            )?.name || "Uncategorized";

          if (categoryId && !categoryMap[categoryId]) {
            categoryMap[categoryId] = { id: categoryId, name: categoryName };
          }
        });

        const uniqueCategories = Object.values(categoryMap);
        console.log("unique categories", uniqueCategories);
        setCategories(uniqueCategories);

        // Map menu items
        const mappedItems = items.map((item) => ({
          id: item.id || item.productId || `${Date.now()}-${Math.random()}`,
          productId: item.productId || item.id || "default-product-id",
          isVeg: item.isVeg ?? true,
          name: item.productLanguages?.[0]?.name || "Unknown Item",
          price: `$${parseFloat(
            item.varients?.[0]?.productVarientUoms?.[0]?.inventory?.price || 10
          ).toFixed(2)}`,
          discountedPrice: `$${parseFloat(
            item.varients?.[0]?.productVarientUoms?.[0]?.inventory?.price || item.price || 8
          ).toFixed(2)}`,
          rating: item.rating || 4.0,
          totalReviews: item.totalReviews || "100+",
          description: item.description || "No description available",
          image: item.image || "/pepperoni.jpg",
          category: item.category, // Store category for filtering
          productVarientUomId: item.varients?.[0]?.productVarientUoms?.[0]?.id,
          variants: item.variants || [
            {
              name: "Small",
              price: parseFloat(item.discountedPrice?.replace("$", "") || 8) - 2,
              productVarientUomId: item.variantUomId || "small-uom-id",
            },
            {
              name: "Regular",
              price: parseFloat(item.discountedPrice?.replace("$", "") || 8),
              productVarientUomId: item.variantUomId || "50285fd5-284a-4125-83cb-198966f38230",
            },
            {
              name: "Large",
              price: parseFloat(item.discountedPrice?.replace("$", "") || 8) + 3,
              productVarientUomId: item.variantUomId || "large-uom-id",
            },
          ],
          addonDetails: item.addons,
        }));

        setMenuItems(mappedItems);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError("Failed to load restaurant or menu items.");
        setMenuItems([]);
        setRestaurant(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRestaurantAndMenu();
    }
  }, [id, debouncedSearchQuery]);

  // Filter menu items based on selected category
  const filteredMenuItems = selectedCategory
    ? menuItems.filter((item) => item.category?.id === selectedCategory)
    : menuItems;

  if (!id) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="container mx-auto p-4">Restaurant not found</div>;
  }

  return (
    <div className="flex justify-center overflow-x-hidden">
      <BottomNav />
      <div className="max-w-md w-full">
        <div className="w-full bg-black h-6 flex items-center px-2">
          <Link href="/foodmarketplace">
            <span className="text-white text-sm">Home</span>
          </Link>
          <span className="text-white text-sm mx-2">/</span>
          <span className="text-white text-sm">{restaurant.name}</span>
        </div>
        <div className="bg-gradient-to-b from-white to-gray-200 h-44 rounded-b-xl flex flex-col justify-center p-2">
          <h1 className="text-black font-bold text-2xl mb-2 mt-1">{restaurant.name}</h1>
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
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-md flex items-center justify-center py-1 px-2">
                <p className="text-white text-[0.5rem] font-medium">Full Menu</p>
                <ChevronRight color="white" size={10} />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 bg-gray-50 rounded-lg h-12 flex items-center px-2 border border-gray-400">
          <div className="w-full flex justify-between bg-white gap-2">
            <div className="flex gap-2 border border-gray-400 w-[80%] rounded-lg px-1 items-center">
              <Search color="gray" size={20} />
              <input
                type="text"
                placeholder="Search by name or category..."
                className="outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="bg-white flex items-center justify-center px-4 py-1 border border-gray-400 rounded-lg">
              <Filter size={18} color="black" />
              <p className="text-[0.5rem] font-semibold ml-1">Filter</p>
            </div>
          </div>
        </div>
        <div className="w-full px-1 flex gap-3 mt-8 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("")}
            className={`w-fit flex items-center justify-center p-1 rounded-lg ${
              selectedCategory === "" ? "bg-orange-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <p className="text-sm font-medium px-2">All</p>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-fit flex items-center justify-center p-1 rounded-lg ${
                selectedCategory === category.id ? "bg-orange-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm font-medium px-2">{category.name}</p>
            </button>
          ))}
        </div>
        <div className="w-full flex flex-col gap-2 mt-4">
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