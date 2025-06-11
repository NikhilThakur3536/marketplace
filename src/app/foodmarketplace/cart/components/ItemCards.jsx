"use client";
import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ItemCards({
  id,
  name,
  restaurantName,
  description,
  count,
  customizations,
  total,
  addOns,
  onRemove,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
  isIncrementDisabled,
}) {
  const [inputValue, setInputValue] = useState(count.toString());

  // Sync inputValue with count prop
  useEffect(() => {
    setInputValue(count.toString());
  }, [count]);

  const handleRemove = async () => {
    try {
      await onRemove();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleIncrement = async () => {
    try {
      await onIncrement();
    } catch (error) {
      console.error("Failed to increment item:", error);
      setInputValue(count.toString());
    }
  };

  const handleDecrement = async () => {
    if (count > 1) {
      try {
        await onDecrement();
      } catch (error) {
        console.error("Failed to decrement item:", error);
        setInputValue(count.toString());
      }
    } else {
      await handleRemove();
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || parsedValue < 0) {
      console.warn("Invalid input, reverting to current count:", count);
      setInputValue(count.toString());
      return;
    }

    if (parsedValue === 0) {
      await handleRemove();
      return;
    }

    try {
      await onUpdateQuantity(parsedValue);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setInputValue(count.toString());
    }
  };

  const handleBlur = () => {
    if (inputValue === "") {
      handleRemove();
      return;
    }

    const parsedValue = parseInt(inputValue, 10);
    if (isNaN(parsedValue) || parsedValue < 0) {
      setInputValue(count.toString());
    }
  };

  // Debug total prop
  console.log(`Item ${name}: count=${count}, total=₹${total.toFixed(2)}`);

  return (
    <div className="flex w-full gap-2">
      <div className="relative w-[25%] h-24 border border-gray-200">
        <Image src="/placeholder.jpg" alt={name} fill className="object-cover object-contain" />
        <div className="absolute z-60 w-fit h-fit p-1 border border-green-700">
          <div className="rounded-full bg-green-700 h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-col w-[70%] gap-2">
        <h2 className="text-black text-xl font-bold">{name}</h2>
        <span className="text-gray-700">{restaurantName}</span>
        <p className="text-gray-500 text-xs">{description}</p>
        <span className="text-gray-500 text-sm font-medium">{customizations}</span>
        {addOns !== "No add-ons" && (
          <div className="flex gap-2 bg-white rounded-lg border border-gray-200 items-center justify-center w-fit h-fit p-1">
            <span className="text-sm">{addOns}</span>
          </div>
        )}
        <div className="flex gap-2 mt-1 items-center">
          <button
            className={`w-fit h-fit rounded-full p-1 ${isIncrementDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-green-50"}`}
            onClick={handleIncrement}
            disabled={isIncrementDisabled}
            aria-label={`Increase quantity of ${name}`}
          >
            <Plus color={isIncrementDisabled ? "gray" : "green"} size={20} />
          </button>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min="0"
            className="w-12 text-center text-sm font-bold text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`Quantity of ${name}`}
          />
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
        <span className="text-blue-600 font-bold text-sm">₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}