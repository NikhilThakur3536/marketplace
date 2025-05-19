"use client"

import { useState } from "react";
import Header from "./ui/Header";
import Categories from "./ui/Categories";
import FilterChips from "./ui/FilterChips";
import Restaurants from "./ui/Restaurant";
import FilterModal from "./ui/FilterModal";

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCuisines, setSelectedCuisines] = useState(["All"]);
  const [priceRange, setPriceRange] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleSortChange = (value) => setSortBy(value);

  const handleCuisineToggle = (cuisine) => {
    if (cuisine === "All") {
      setSelectedCuisines(["All"]);
      return;
    }
    const newSelected = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter((c) => c !== cuisine)
      : [...selectedCuisines.filter((c) => c !== "All"), cuisine];
    setSelectedCuisines(newSelected.length ? newSelected : ["All"]);
  };

  const applyFilters = () => {
    console.log("Applying filters:", { sortBy, selectedCuisines, priceRange });
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-md px-4 py-6">
        <Header toggleFilters={toggleFilters} onSearch={setSearchQuery} />
        <Categories />
        <FilterChips />
        <Restaurants searchQuery={searchQuery} /> 
      </div>
      {showFilters && (
        <FilterModal
          sortBy={sortBy}
          selectedCuisines={selectedCuisines}
          priceRange={priceRange}
          onSortChange={handleSortChange}
          onCuisineToggle={handleCuisineToggle}
          onPriceRangeChange={setPriceRange}
          onApplyFilters={applyFilters}
          onClose={toggleFilters}
        />
      )}
    </div>
  );
}
