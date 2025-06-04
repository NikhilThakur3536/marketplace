import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function ItemCards({ productId, varientId, name, price, quantity, image, category, onRemove, onUpdateQuantity }) {
    const handleRemove = async () => {
        try {
            await onRemove(productId, varientId);
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const handleUpdateQuantity = async (change) => {
        const newQuantity = Math.max(1, quantity + change); // Ensure quantity doesn't go below 1
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token not found.");

            const payload = {
                productId,
                varientId,
                quantity: newQuantity,
            };

            console.log("Updating cart quantity:", payload);

            const response = await axios.post(`${BASE_URL}/api/user/cart/update`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Update Quantity API Response:", response.data);

            onUpdateQuantity(productId, varientId, newQuantity);
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };
    console.log(price)
    const total = (price * quantity).toLocaleString();

    return (
        <div className="flex w-full gap-2">
            <div className="relative w-[25%] h-24 border border-gray-200">
                <Image
                    src={image || "/placeholder.png"}
                    alt={name}
                    fill
                    className=" object-contain"
                />
            </div>
            <div className="flex flex-col w-[70%] gap-2">
                <h2 className="text-black text-xl font-bold">{name}</h2>
                <p className="text-gray-500 text-xs">{category || "N/A"}</p>
                <div className="flex gap-2 mt-1">
                    <button
                        className="w-fit h-fit rounded-full p-1 bg-green-50"
                        onClick={() => handleUpdateQuantity(1)}
                        aria-label={`Increase quantity of ${name}`}
                    >
                        <Plus color="green" size={20} />
                    </button>
                    <span className="text-sm font-bold text-black">{quantity}</span>
                    <button
                        className="w-fit h-fit rounded-full p-1 bg-red-50"
                        onClick={() => handleUpdateQuantity(-1)}
                        aria-label={`Decrease quantity of ${name}`}
                    >
                        <Minus color="red" size={20} />
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-between">
                <button
                    className="w-fit h-fit bg-orange-100 flex items-center justify-center rounded-full p-1 transform translate-x-2"
                    onClick={handleRemove}
                    aria-label={`Remove ${name} from cart`}
                >
                    <Trash2 color="orange" size={20} />
                </button>
                <span className="text-black font-bold text-lg">${total}</span>
            </div>
        </div>
    );
}