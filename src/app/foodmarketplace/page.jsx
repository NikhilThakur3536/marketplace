"use client";

import Header from "../components/Header";
import { MapPin, MessageCircle, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import Card from "../components/Card";
import Link from "next/link";
import BottomNav from "./components/BottomNavbar";
import ChatBox from "./components/ChatBox";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const translations = {
  English: {
    orderFood: "Order food online from your favourite restaurants",
    description: "Get your favourite food delivered in a flash...",
    locationPlaceholder: "Location",
    searchPlaceholder: ["Search", "Food items", "Restaurants"],
    searchButton: "Search",
    popularItems: "POPULAR FOOD ITEMS",
    noLocationMessage: "Please select a location to view restaurants and items.",
    noStoresFound: "No restaurants found for this search.",
  },
  Gujarati: {
    orderFood: "તમારા પસંદીદા રેસ્ટોરન્ટમાંથી ઓનલાઇન ભોજન મંગાવો",
    description: "તમારું મનપસંદ ભોજન તાત્કાલિક પહોંચાડવામાં આવશે...",
    locationPlaceholder: "સ્થાન",
    searchPlaceholder: ["શોધો", "ભોજન વસ્તુઓ", "રેસ્ટોરાં"],
    searchButton: "શોધો",
    popularItems: "પ્રસિદ્ધ ભોજન વસ્તુઓ",
    noLocationMessage: "કૃપા કરીને રેસ્ટોરન્ટ અને વસ્તુઓ જોવા માટે સ્થાન પસંદ કરો.",
    noStoresFound: "આ શોધ માટે કોઈ રેસ્ટોરન્ટ મળ્યું નથી.",
  },
  Arabic: {
    orderFood: "اطلب الطعام عبر الإنترنت من مطاعمك المفضلة",
    description: "احصل على طعامك المفضل بسرعة...",
    locationPlaceholder: "الموقع",
    searchPlaceholder: ["بحث", "أطعمة", "مطاعم"],
    searchButton: "بحث",
    popularItems: "الأطعمة الشائعة",
    noLocationMessage: "يرجى تحديد موقع لعرض المطاعم والعناصر.",
    noStoresFound: "لم يتم العثور على مطاعم لهذا البحث.",
  },
};

export default function FoodMarketPlace() {
  const [selectedLang, setSelectedLang] = useState("English");
  const [index, setIndex] = useState(0);
  const [stores, setStores] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const locationDropdownRef = useRef(null);
  const storeDropdownRef = useRef(null);

  // Load selected language from localStorage
  useEffect(() => {
    const lang = localStorage.getItem("selectedLang") || "English";
    setSelectedLang(lang);
  }, []);

  // Save selected language to localStorage
  useEffect(() => {
    localStorage.setItem("selectedLang", selectedLang);
  }, [selectedLang]);

  // Load selected location from localStorage on mount
  useEffect(() => {
    const savedLocationId = localStorage.getItem("selectedLocationId");
    const savedLocationName = localStorage.getItem("selectedLocationName");
    if (savedLocationId && savedLocationName) {
      setSelectedLocation(savedLocationId);
      setLocationSearch(savedLocationName);
    }
  }, []);

  // Save selected location to localStorage
  useEffect(() => {
    if (selectedLocation && locationSearch) {
      localStorage.setItem("selectedLocationId", selectedLocation);
      localStorage.setItem("selectedLocationName", locationSearch);
    }
  }, [selectedLocation, locationSearch]);

  // Placeholder text rotation for search input
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % translations[selectedLang]?.searchPlaceholder.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedLang]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (storeDropdownRef.current && !storeDropdownRef.current.contains(event.target)) {
        setShowStoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch default location (Paldi) only if no location is stored
  useEffect(() => {
    const fetchDefaultLocation = async () => {
      setIsLoadingLocations(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await axios.post(
          `${BASE_URL}/user/location/list`,
          {
            languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
            searchKey: "Paldi",
            limit: 10,
            offset: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const locationData = response.data.data.rows || [];
        const paldiLocation = locationData.find(
          (location) => location.name.toLowerCase() === "paldi"
        );
        if (paldiLocation && !localStorage.getItem("selectedLocationId")) {
          setSelectedLocation(paldiLocation.id);
          setLocationSearch(paldiLocation.name);
          localStorage.setItem("selectedLocationId", paldiLocation.id);
          localStorage.setItem("selectedLocationName", paldiLocation.name);
        }
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching default location:", error.response?.data || error.message);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    if (!selectedLocation && !localStorage.getItem("selectedLocationId")) {
      fetchDefaultLocation();
    }
  }, [selectedLocation]);

  // Fetch locations based on search
  useEffect(() => {
    const fetchLocations = async () => {
      if (!locationSearch) return;
      setIsLoadingLocations(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await axios.post(
          `${BASE_URL}/user/location/list`,
          {
            languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
            searchKey: locationSearch || undefined,
            limit: 10,
            offset: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const locationData = response.data.data.rows || [];
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching locations:", error.response?.data || error.message);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocations();
  }, [locationSearch]);

  // Fetch stores when a location is selected
  useEffect(() => {
    const fetchStores = async () => {
      if (!selectedLocation) {
        setStores([]);
        setStoreId(null);
        setPopularItems([]);
        return;
      }
      setIsLoadingStores(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await axios.post(
          `${BASE_URL}/user/store/list`,
          {
            limit: 10,
            offset: 0,
            locationId: selectedLocation,
            searchKey: storeSearch || undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const storeData = response.data.data.rows || [];
        setStores(storeData);
        if (storeData.length > 0) {
          setStoreId(storeData[0].id || "617ad5ce-7981-4e9f-afd1-c629172df441");
        } else {
          setStoreId(null);
        }
      } catch (error) {
        console.error("Error fetching stores:", error.response?.data || error.message);
        setStores([]);
        setStoreId(null);
      } finally {
        setIsLoadingStores(false);
      }
    };
    fetchStores();
  }, [selectedLocation, storeSearch]);

  // Fetch popular items when a storeId is available
  useEffect(() => {
    const fetchPopularItems = async () => {
      if (!storeId) {
        setPopularItems([]);
        return;
      }
      setIsLoadingItems(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await axios.post(
          `${BASE_URL}/user/product/listv1`,
          {
            limit: 6,
            offset: 0,
            storeId: storeId,
            languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const items = response.data.data?.rows || [];
        const mappedItems = items.map((item) => ({
          id: item.id,
          name:
            item.productLanguages?.find(
              (lang) => lang.languageId === "2bfa9d89-61c4-401e-aae3-346627460558"
            )?.name || "Unknown Item",
          image: item.productImages?.[0]?.url || "/chillipaneer.png",
          storeId: storeId,
        }));
        setPopularItems(mappedItems);
      } catch (error) {
        console.error("Error fetching popular items:", error.response?.data || error.message);
        setPopularItems([]);
      } finally {
        setIsLoadingItems(false);
      }
    };
    fetchPopularItems();
  }, [storeId]);

  const t = translations[selectedLang] || translations.English;

  const handleLocationSelect = (locationId, locationName) => {
    setSelectedLocation(locationId);
    setLocationSearch(locationName);
    setShowLocationDropdown(false);
    setStoreSearch("");
    setStores([]);
    setStoreId(null);
    setPopularItems([]);
  };

  const handleStoreSelect = (storeId, storeName) => {
    setStoreSearch(storeName);
    setShowStoreDropdown(false);
    setStores(stores.filter((store) => store.id === storeId));
    setStoreId(storeId);
  };

  const handleSearchButtonClick = () => {
    if (selectedLocation && storeSearch) {
      setIsLoadingStores(true);
      setShowStoreDropdown(true);
    }
  };

  // Helper function to get store and location details for an item
  const getRestaurantLink = (item) => {
    const store = stores.find((s) => s.id === item.storeId);
    if (!store) {
      // Fallback to a default URL if store is not found
      return `/foodmarketplace/Tasty-Bites/Paldi/617ad5ce-7981-4e9f-afd1-c629172df441`;
    }
    const restaurantName = encodeURIComponent(store.name.replace(/\s+/g, '-'));
    const locationName = encodeURIComponent((store.location?.name || locationSearch).replace(/\s+/g, '-'));
    return `/foodmarketplace/${restaurantName}/${locationName}/${store.id}`;
  };

  return (
    <div className="flex justify-center overflow-x-hidden">
      <div className="max-w-md w-full flex flex-col relative">
        <Header selectedLang={selectedLang} setSelectedLang={setSelectedLang} />
         <button
          className="z-30 w-fit h-fit rounded-full p-2 bg-orange-400 absolute bottom-20 right-4 sm:right-12"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle size={20} color="white" />
        </button>
        {isChatOpen && (
          <div className="z-40 absolute bottom-32 right-4 sm:right-12 w-64 sm:w-80">
            <ChatBox onClose={() => setIsChatOpen(false)} />
          </div>
        )}
        {/* MAIN SECTION */}
        <section className="w-full bg-gradient-to-r from-[#f98c37] to-[#ee6416] flex flex-col items-center gap-4">
          <h1 className="text-white text-2xl font-bold text-center w-[65%] mt-4">{t.orderFood}</h1>
          <p className="text-lg text-white w-[70%] text-center">{t.description}</p>

          <div className="w-full mb-8 flex justify-center">
            <div className="flex justify-between w-[80%] bg-white h-12 rounded-lg shadow-xl relative">
              {/* LOCATION BLOCK */}
              <div className="w-1/3 border-r border-gray-200 flex items-center pl-1 relative" ref={locationDropdownRef}>
                <MapPin size={20} color="gray" className="absolute" />
                <input
                  type="text"
                  placeholder={t.locationPlaceholder}
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationDropdown(true);
                  }}
                  className="placeholder:text-sm text-sm pl-6 w-full outline-0"
                  onFocus={() => setShowLocationDropdown(true)}
                />
                {showLocationDropdown && (
                  <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                    {isLoadingLocations ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin"></div>
                      </div>
                    ) : locations.length > 0 ? (
                      locations.map((location) => (
                        <div
                          key={location.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLocationSelect(location.id, location.name)}
                        >
                          {location.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-600">No locations found</div>
                    )}
                  </div>
                )}
              </div>

              {/* SEARCH BLOCK */}
              <div className="w-1/3 border-r border-gray-200 flex items-center pl-1 relative" ref={storeDropdownRef}>
                <Search size={20} color="gray" className="absolute" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder[index]}
                  value={storeSearch}
                  onChange={(e) => {
                    setStoreSearch(e.target.value);
                    setShowStoreDropdown(true);
                  }}
                  className="placeholder:text-sm text-sm pl-6 w-full outline-0"
                  onFocus={() => setShowStoreDropdown(true)}
                  disabled={!selectedLocation}
                />
                {showStoreDropdown && selectedLocation && (
                  <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                    {isLoadingStores ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin"></div>
                      </div>
                    ) : stores.length > 0 ? (
                      stores.map((store) => (
                        <div
                          key={store.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleStoreSelect(store.id, store.name)}
                        >
                          {store.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-600">{t.noStoresFound}</div>
                    )}
                  </div>
                )}
              </div>

              {/* SEARCH BUTTON */}
              <button
                className={`w-1/3 bg-[#f97316] rounded-r-lg flex items-center justify-center ${!selectedLocation ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!selectedLocation}
                onClick={handleSearchButtonClick}
              >
                <p className="text-white text-2xl font-semibold">{t.searchButton}</p>
              </button>
            </div>
          </div>
        </section>

        {/* POPULAR FOOD SECTION */}
        <section className="w-full px-2">
          <h1 className="text-black text-2xl font-bold mt-4">{t.popularItems}</h1>
          <div className="mt-8 w-full overflow-x-auto">
            {selectedLocation ? (
              isLoadingItems ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin"></div>
                </div>
              ) : popularItems.length > 0 ? (
                <div className="flex gap-4 w-max flex-wrap" style={{ rowGap: "2rem" }}>
                  {popularItems.map((item) => (
                    <Link key={item.id} href={getRestaurantLink(item)}>
                      <div className="flex flex-col gap-2 items-center">
                        <div className="w-32 h-32 rounded-full relative bg-gray-100 flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center rounded-full ml-1 aspect-auto"
                          />
                        </div>
                        <p className="text-black text-lg font-bold">{item.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 mt-4">No popular items available.</p>
              )
            ) : (
              <p className="text-center text-gray-600 mt-4">{t.noLocationMessage}</p>
            )}
          </div>
        </section>

        {/* POPULAR RESTAURANTS SECTION */}
        <section className="w-full px-2 mb-14">
          <h1 className="text-black text-2xl font-bold mt-8">POPULAR RESTAURANTS</h1>
          {selectedLocation ? (
            isLoadingStores ? (
              <div className="flex justify-center items-center py-4">
                <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin"></div>
              </div>
            ) : stores.length > 0 ? (
              stores.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  rating={item.rating}
                  itemsServ={item.itemsServ}
                  deliveryTime={""}
                  costForTwo={""}
                  image={"/placeholder.jpg"}
                  location={item.location?.name}
                  restaurant={item.name}
                />
              ))
            ) : (
              <p className="text-center text-gray-600 mt-4">{t.noStoresFound}</p>
            )
          ) : (
            <p className="text-center text-gray-600 mt-4">{t.noLocationMessage}</p>
          )}
        </section>
      </div>
      <BottomNav />
      
    </div>
  );
}