"use client";
import { useState } from "react";

const CategoryTabs = ({ categories = [], onCategoryChange, activeTab }) => {

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.length > 0 ? (
        categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id, category.name)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === category.id
                ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
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