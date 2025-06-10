"use client";
import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";

export default function ItemCards({ id, name, restaurantName, description, count, customizations, total, addOns, onRemove, onIncrement, onDecrement, isIncrementDisabled }) {
    
    const handleRemove = async () => {
        try {
            await onRemove(id);
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const handleIncrement = async () => {
        try {
            console.log("Incrementing item with id:", id);
            await onIncrement(id, count + 1);
        } catch (error) {
            console.error("Failed to increment item:", error);
        }
    };

    const handleDecrement = async () => {
        if (count > 1) {
            try {
                console.log("Decrementing item with id:", id);
                await onDecrement(id, count - 1);
            } catch (error) {
                console.error("Failed to decrement item:", error);
            }
        } else {
            await handleRemove();
        }
    };

    return (
        <div className="flex w-full gap-2">
            <div className="relative w-[25%] h-24 border border-gray-200">
                <Image src={"/Margherita.jpg"} alt="pizza" fill className="object-cover object-contain" />
                <div className="absolute z-60 w-fit h-fit p-1 border border-green-700">
                    <div className="rounded-full bg-green-700 h-4 w-4" />
                </div>
            </div>
            <div className="flex flex-col w-[70%] gap-2">
                <h2 className="text-black text-xl font-bold">{name}</h2>
                <span className="text-gray-700">{restaurantName}</span>
                <p className="text-gray-500 text-xs">{description}</p>
                <span className="text-gray-500 text-sm font-medium">{customizations}</span>
                {addOns !== "No Add-ons" && (
                    <div className="flex gap-2 bg-white rounded-lg border border-gray-200 items-center justify-center w-fit h-fit p-1">
                        <span className="text-sm">{addOns}</span>
                    </div>
                )}
                <div className="flex gap-2 mt-1">
                    <button 
                        className={`w-fit h-fit rounded-full p-1 ${isIncrementDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-green-50'}`}
                        onClick={handleIncrement}
                        disabled={isIncrementDisabled}
                        aria-label={`Increase quantity of ${name}`}
                    >
                        <Plus color={isIncrementDisabled ? "gray" : "green"} size={20} />
                    </button>
                    <span className="text-sm font-bold text-black">{Math.floor(count)}</span>
                    <button 
                        className="w-fit h-fit rounded-full p-1 bg-red-50"
                        onClick={handleDecrement}
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
                <span className="text-black font-bold text-lg">${total.toFixed(2)}</span>
            </div>
        </div>
    );
}