"use client";

import Header from "../components/Header";
import { MapPin, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Card from "../components/Card";
import { restaurants } from "../components/data/RestaurantCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const translations = {
  English: {
    orderFood: "Order food online from your favourite restaurants",
    description: "Get your favourite food delivered in a flash...",
    locationPlaceholder: "Location",
    searchPlaceholder: ["Search", "Food items", "Restaurants"],
    searchButton: "Search",
    popularItems: "POPULAR FOOD ITEMS",
  },
  Gujarati: {
    orderFood: "તમારા પસંદીદા રેસ્ટોરન્ટમાંથી ઓનલાઇન ભોજન મંગાવો",
    description: "તમારું મનપસંદ ભોજન તાત્કાલિક પહોંચાડવામાં આવશે...",
    locationPlaceholder: "સ્થાન",
    searchPlaceholder: ["શોધો", "ભોજન વસ્તુઓ", "રેસ્ટોરાં"],
    searchButton: "શોધો",
    popularItems: "પ્રسિદ્ધ ભોજન વસ્તુઓ",
  },
  Arabic: {
    orderFood: "اطلب الطعام عبر الإنترنت من مطاعمك المفضلة",
    description: "احصل على طعامك المفضل بسرعة...",
    locationPlaceholder: "الموقع",
    searchPlaceholder: ["بحث", "أطعمة", "مطاعم"],
    searchButton: "بحث",
    popularItems: "الأطعمة الشائعة",
  },
};
const popularItems = [
  { id: 1, name: "Chilli Paneer", image: "/chillipaneer.png" },
  { id: 2, name: "Burger", image: "/chillipaneer.png" },
  { id: 3, name: "Pizza", image: "/chillipaneer.png" },
  { id: 4, name: "Dosa", image: "/chillipaneer.png" },
  { id: 5, name: "Samosa", image: "/chillipaneer.png" },
  { id: 6, name: "Momos", image: "/chillipaneer.png" },
];

export default function FoodMarketPlace() {
  const [selectedLang, setSelectedLang] = useState("English");
  const [index, setIndex] = useState(0);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const lang = localStorage.getItem("selectedLang") || "English";
    setSelectedLang(lang);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLang", selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % translations[selectedLang]?.searchPlaceholder.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedLang]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}/user/store/list`,
          { limit: 4, offset: 0 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.data.rows?.[0].id)
        setStores(response.data.data.rows || []);
      } catch (error) {
        console.error("Error fetching stores:", error.response?.data || error.message);
      }
    };
    fetchStores();
  }, []);
  
  useEffect(()=>{
    console.log(stores)
  },[stores])

  const t = translations[selectedLang] || translations.English;

  return (
    <div className="flex justify-center overflow-x-hidden">
      <div className="max-w-md w-full flex flex-col">
        <Header selectedLang={selectedLang} setSelectedLang={setSelectedLang} />
        {/* MAIN SECTION */}
        <section className="w-full bg-gradient-to-r from-[#f98c37] to-[#ee6416] flex flex-col items-center gap-4">
          <h1 className="text-white text-2xl font-bold text-center w-[65%] mt-4">{t.orderFood}</h1>
          <p className="text-lg text-white w-[70%] text-center">{t.description}</p>

          <div className="w-full mb-8 flex justify-center">
            <div className="flex justify-between w-[80%] bg-white h-12 rounded-lg shadow-xl">
              {/* LOCATION BLOCK */}
              <div className="w-1/3 border-r border-gray-200 flex items-center pl-1">
                <MapPin size={20} color="gray" className="absolute" />
                <input
                  type="text"
                  placeholder={t.locationPlaceholder}
                  className="placeholder:text-sm text-sm pl-6 w-full outline-0"
                />
              </div>

              {/* SEARCH BLOCK */}
              <div className="w-1/3 border-r border-gray-200 flex items-center pl-1">
                <Search size={20} color="gray" className="absolute" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder[index]}
                  className="placeholder:text-sm text-sm pl-6 w-full outline-0"
                />
              </div>

              {/* SEARCH BUTTON */}
              <button className="w-1/3 bg-[#f97316] rounded-r-lg flex items-center justify-center">
                <p className="text-white text-2xl font-semibold">{t.searchButton}</p>
              </button>
            </div>
          </div>
        </section>

        {/* POPULAR FOOD SECTION */}
        <section className="w-full px-2">
          <h1 className="text-black text-2xl font-bold mt-4">{t.popularItems}</h1>
          <div className="mt-8 w-full overflow-x-auto">
            <div className="flex gap-4 w-max flex-wrap" style={{ rowGap: "2rem" }}>
              {popularItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 items-center">
                  <div className="w-32 h-32 rounded-full relative bg-gray-100 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center rounded-full ml-1 aspect-auto"
                    />
                  </div>
                  <p className="text-black text-xl font-bold">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POPULAR RESTAURANTS SECTION */}
        <section className="w-full px-2">
          <h1 className="text-black text-2xl font-bold mt-8">POPULAR RESTAURANTS</h1>
          {stores.length > 0 ? (
            stores.map((item) => (    
              <Card key={item.id} 
                    id={item.id}
                    name={item.location?.name} 
                    rating={item.rating}
                    itemsServ={item.itemsServ}
                    deliveryTime={""}
                    costForTwo={""}
                    image={"/chillipaneer.png"}
              />
            ))
          ) : (
            <p>No restaurants available.</p>
          )}
         {/* {restaurants.map((items)=>(<Card key={items.id} {...items}/>))}  */}
        </section>
      </div>
    </div>
  );
}