"use client";
import { useState } from "react";

const CategoryTabs = ({ categories = [], onCategoryChange, activeTab }) => {
  console.log("CategoryTabs received categories:", categories);
  console.log("Is categories valid?:", categories.length > 0);
  categories.forEach((category, index) => {
    console.log(`Category ${index}: id=${category.id}, name=${category.name}`);
  });

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.length > 0 ? (
        categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id, category.name)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === category.id
                ? "bg-gradient-to-r from-[#9FD770] to-[#64C058] text-white"
                : "bg-white text-gray-600 hover:bg-green-200"
            }`}
          >
            {category.name}
          </button>
        ))
      ) : (
        ""
      )}
    </div>
  );
};

export default CategoryTabs;