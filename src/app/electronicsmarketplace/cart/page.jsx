"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ItemCards from "./components/ItemCards";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");
                if (!token) throw new Error("Authentication token not found.");

                const payload = {
                    languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
                };

                console.log("Fetching cart items with payload:", payload);

                const response = await axios.post(`${BASE_URL}/user/cart/listv2`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("Cart API Response:", response.data);

                const fetchedItems = response.data?.data?.rows || [];
                if (!fetchedItems.length) {
                    setCartItems([]);
                    return;
                }

                // Format the cart items for ItemCards
                const formattedItems = fetchedItems.map((item) => ({
                    productId: item.productId,
                    varientId: item.varientId,
                    name: item.product?.productLanguages?.[0]?.name || "Unknown Product",
                    price: item.priceInfo?.price || 0,
                    quantity: parseFloat(item.quantity) || 1, // Parse string to number
                    image: item.product?.productImages?.[0]?.url || null,
                    category: item.product?.category?.categoryLanguages?.[0]?.name || null,
                }));

                console.log("Formatted Cart Items:", formattedItems);
                setCartItems(formattedItems);
            } catch (err) {
                console.error("Error fetching cart items:", err);
                setError(err.message || "Failed to load cart items. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemove = async (productId, varientId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token not found.");

            const payload = {
                productId,
                varientId,
            };

            console.log("Removing cart item:", payload);

            const response = await axios.post(`${BASE_URL}/api/user/cart/remove`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Remove Cart Item API Response:", response.data);

            // Update cart state
            setCartItems(cartItems.filter(item => item.productId !== productId || item.varientId !== varientId));
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const handleUpdateQuantity = (productId, varientId, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.productId === productId && item.varientId === varientId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    if (loading) {
        return <div className="text-center text-gray-500 py-4">Loading cart...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    if (!cartItems.length) {
        return <div className="text-center text-gray-500 py-4">Your cart is empty.</div>;
    }

    return (
        <div className="w-screen flex justify-center bg-[#f9fafb] h-screen overflow-y-auto">
            <div className="max-w-md w-full flex flex-col p-4 gap-4">
                <h1 className="text-2xl font-bold text-black">Your Cart</h1>
                {cartItems.map((item) => (
                    <ItemCards
                        key={`${item.productId}-${item.varientId}`}
                        productId={item.productId}
                        varientId={item.varientId}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        image={item.image}
                        category={item.category}
                        onRemove={handleRemove}
                        onUpdateQuantity={handleUpdateQuantity}
                    />
                ))}
            </div>
        </div>
    );
}