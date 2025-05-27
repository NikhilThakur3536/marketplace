  "use client";

  import { useEffect, useState } from "react";
  import RestaurantCard from "./RestaurantCard";

  export default function Restaurants({ searchQuery }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const token = localStorage.getItem("deviceToken");
          if (!token) {
            console.error("No token found");
            setLoading(false);
            return;
          }

          const response = await fetch(`${BASE_URL}/user/product/list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              limit: 4,
              offset: 0,
              categoryId: "174ed5cd-a20a-42f1-a0a6-2e7f1cb00ad5",
              subCategoryId: "750aa2be-59db-4299-988b-2f0b028d9f24",
              languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }

          const data = await response.json();
          console.log(data.data.rows)
          setProducts(data.data?.rows || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, [BASE_URL]);
  
  const filteredProducts = products.filter((product) => {
      const search = (searchQuery || "").toLowerCase();
      const categoryCode = product.category?.code?.toLowerCase() || "";
      const subCategoryCode = product.subCategory?.code?.toLowerCase() || "";
      console.log(product.productLanguages[0].name)
      return categoryCode.includes(search) || subCategoryCode.includes(search);
      
    });
    if (loading) return <p>Loading...</p>;
    if (filteredProducts.length === 0)
      return <p>No products found matching your search.</p>;

    return (
      <div>
        <h2 className="text-lg font-bold mb-3">ALL PRODUCTS</h2>
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <RestaurantCard
                key={product.id}
                productId={product.id}
                name={product.category?.code || "Unnamed"} 
                cuisine={product.productLanguages?.[0]?.name || "Unknown"} 
                rating={product.rating || 0} 
                deliveryTime={product.deliveryTime || "-"}  
                distance={product.distance || "-"} 
                price={product.price || "-"} 
                discount={product.discount || "-"}
                productVarientUomId={product.varients?.[0]?.productVarientUoms?.[0]?.id}
            />
          ))}
        </div>
      </div>
    );
  }
