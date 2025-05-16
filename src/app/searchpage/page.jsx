"use client"

import { Search, Filter, ShoppingCart, MapPin, Star, Clock, ChevronRight, X } from "lucide-react"
import { useState } from "react"

export default function FoodDeliveryApp() {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedCuisines, setSelectedCuisines] = useState(["All"])
  const [priceRange, setPriceRange] = useState(0)

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
  }

  const handleCuisineToggle = (cuisine) => {
    if (cuisine === "All") {
      setSelectedCuisines(["All"])
      return
    }

    const newSelected = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter((c) => c !== cuisine)
      : [...selectedCuisines.filter((c) => c !== "All"), cuisine]

    setSelectedCuisines(newSelected.length ? newSelected : ["All"])
  }

  const applyFilters = () => {
    // Here you would apply the filters to your data
    console.log("Applying filters:", { sortBy, selectedCuisines, priceRange })
    setShowFilters(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-md px-4 py-6">

        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 mr-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white" />
            </div>
            <input
              type="text"
              placeholder="Enter item/restaurant to search"
              className="w-full bg-orange bg-opacity-90 text-white placeholder-white placeholder-opacity-90 rounded-full py-2 pl-10 pr-4 focus:outline-none"
            />
          </div>
          <div className="flex space-x-3">
            <button className="bg-gray-800 rounded-full p-2" onClick={toggleFilters}>
              <Filter className="h-5 w-5" />
            </button>
            <button className="bg-gray-800 rounded-full p-2">
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">CATEGORIES</h2>
          <div className="flex justify-between">
            <CategoryItem icon="/cpizza.png" name="Pizza" />
            <CategoryItem icon="/cburger.png" name="Burger" />
            <CategoryItem icon="/cshake.png" name="Shakes" />
            <CategoryItem icon="cpasta.png" name="Pasta" />
            <CategoryItem icon="csandwich.png" name="Sandwich" />
          </div>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto py-2">
          <FilterChip label="All" active={true} />
          <FilterChip label="Fast Delivery" active={false} />
          <FilterChip label="Top Rated" active={false} />
          <FilterChip label="New Arrivals" active={false} />
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">ALL RESTAURANTS</h2>
          <div className="space-y-4">
            <RestaurantCard
              name="Pizza Paradise"
              cuisine="Italian"
              rating={4.8}
              deliveryTime="15-20 min"
              distance="1.5 min"
              price="$13"
              discount="30% OFF"
            />
            <RestaurantCard
              name="Pizza Paradise"
              cuisine="Italian"
              rating={4.8}
              deliveryTime="15-20 min"
              distance="1.5 min"
              price="$13"
              discount="30% OFF"
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className=" h-screen fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-start">
          <div className="bg-black w-full max-w-md border border-gray-800 rounded-t-lg  max-h-screen overflow-auto">
            <div className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-orange">Filters & Sort</h2>
                <button onClick={toggleFilters} className="text-orange">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-4">

              <div className="mb-6 bg-gradient-to-r  from-[#212121] to-[#878787]/25 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <span className="h-3 w-3 bg-orange rounded-full mr-2"></span>
                  SORT BY
                </h3>
                <div className="space-y-3">
                  <SortOption
                    label="Relevance"
                    value="relevance"
                    checked={sortBy === "relevance"}
                    onChange={handleSortChange}
                  />
                  <SortOption label="Rating" value="rating" checked={sortBy === "rating"} onChange={handleSortChange} />
                  <SortOption
                    label="Delivery Time"
                    value="deliveryTime"
                    checked={sortBy === "deliveryTime"}
                    onChange={handleSortChange}
                  />
                  <SortOption label="Price" value="price" checked={sortBy === "price"} onChange={handleSortChange} />
                </div>
              </div>

              <div className="mb-6 bg-gradient-to-r  from-[#212121] to-[#878787]/25 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
                  Cuisines
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <CuisineChip
                      label="All"
                      active={selectedCuisines.includes("All")}
                      onClick={() => handleCuisineToggle("All")}
                    />
                    <CuisineChip
                      label="Italian"
                      active={selectedCuisines.includes("Italian")}
                      onClick={() => handleCuisineToggle("Italian")}
                    />
                    <CuisineChip
                      label="Indian"
                      active={selectedCuisines.includes("Indian")}
                      onClick={() => handleCuisineToggle("Indian")}
                    />
                    <CuisineChip
                      label="American"
                      active={selectedCuisines.includes("American")}
                      onClick={() => handleCuisineToggle("American")}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CuisineChip
                      label="All"
                      active={selectedCuisines.includes("All")}
                      onClick={() => handleCuisineToggle("All")}
                    />
                    <CuisineChip
                      label="Italian"
                      active={selectedCuisines.includes("Italian")}
                      onClick={() => handleCuisineToggle("Italian")}
                    />
                    <CuisineChip
                      label="Indian"
                      active={selectedCuisines.includes("Indian")}
                      onClick={() => handleCuisineToggle("Indian")}
                    />
                    <CuisineChip
                      label="American"
                      active={selectedCuisines.includes("American")}
                      onClick={() => handleCuisineToggle("American")}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CuisineChip
                      label="All"
                      active={selectedCuisines.includes("All")}
                      onClick={() => handleCuisineToggle("All")}
                    />
                    <CuisineChip
                      label="Italian"
                      active={selectedCuisines.includes("Italian")}
                      onClick={() => handleCuisineToggle("Italian")}
                    />
                    <CuisineChip
                      label="Indian"
                      active={selectedCuisines.includes("Indian")}
                      onClick={() => handleCuisineToggle("Indian")}
                    />
                    <CuisineChip
                      label="American"
                      active={selectedCuisines.includes("American")}
                      onClick={() => handleCuisineToggle("American")}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-gradient-to-r  from-[#212121] to-[#878787]/25 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                  Price Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number.parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>0</span>
                    <span></span>
                  </div>
                </div>
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryItem({ icon, name }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 mb-1">
        <img src={icon || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs">{name}</span>
    </div>
  )
}

function FilterChip({ label, active }) {
  return (
    <div
      className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
        active ? "bg-yellow-500 text-black" : "bg-green-800 bg-opacity-50 text-white"
      }`}
    >
      {label}
    </div>
  )
}

function CuisineChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm border ${
        active ? "bg-gray-800 border-white text-white" : "bg-transparent border-gray-700 text-gray-400"
      }`}
    >
      {label}
    </button>
  )
}

function SortOption({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative flex items-center">
        <input type="radio" className="sr-only" value={value} checked={checked} onChange={() => onChange(value)} />
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checked ? "border-white" : "border-gray-500"}`}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
        </div>
      </div>
      <span className="ml-2">{label}</span>
    </label>
  )
}

function RestaurantCard({ name, cuisine, rating, deliveryTime, distance, price, discount }) {
  return (
    <div className="bg-[#2C2C2C]/20 rounded-lg overflow-hidden">
      <div className="relative">
        <img src="/restaurantcard.png" alt={name} className="w-full h-40 object-cover" />
        <div className="absolute top-2 left-2 bg-orange-500 px-2 py-1 text-sm font-bold">{discount}</div>
        <div className="absolute bottom-2 left-2 flex items-center space-x-4">
          <div className="flex items-center bg-gradient-to-r from-[#4D906E] to-[#50CB8C] bg-opacity-80 rounded-lg px-2 py-1">
            <Star className="h-4 w-4  mr-1" />
            <span className="text-sm">{rating}</span>
          </div>
          <div className="flex items-center bg-gray-800 bg-opacity-80 rounded px-2 py-1">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{deliveryTime}</span>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-400">{cuisine}</p>
            <div className="flex items-center mt-1 text-sm text-gray-400">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{distance}</span>
            </div>
            <button className="mt-2 bg-orange-600 text-white text-xs px-3 py-1 rounded-full">Quick Order</button>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-indigo-200 mt-2 bg-[#1D0F43]/56 border border-[#6B58A0] rounded-xl px-2">{price}</span>
            <button className="flex items-center mt-[90%] text-yellow-500 text-sm">
              Menu <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
