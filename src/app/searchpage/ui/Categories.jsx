"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CategoryItem from "./CategoryItems";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("deviceToken");
        const response = await axios.post(
          `${BASE_URL}/user/category/list`,
          {
            limit: 20,
            offset: 0,
            languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) throw new Error("Failed to fetch categories");

        const data = response.data;
        console.log(data);
        setCategories(data.data?.rows || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [BASE_URL]);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3">CATEGORIES</h2>
      <div className="flex justify-between overflow-x-auto space-x-4">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            icon={category.icon || "/momos.png"}
            name={category.code || "Unnamed"}
          />
        ))}
      </div>
    </div>
  );
}