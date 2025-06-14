'use client';

import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

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
    console.log('ItemCards updated for id:', id, 'count:', count, 'total:', total.toFixed(2));
  }, [count, id, total]);

  const handleRemove = useCallback(async () => {
    try {
      console.log('Removing item with id:', id);
      await onRemove();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  }, [id, onRemove]);

  const handleIncrement = useCallback(async () => {
    try {
      console.log('Incrementing item with id:', id, 'current count:', count);
      await onIncrement();
      setInputValue((prev) => (Number(prev) + 1).toString());
    } catch (error) {
      console.error("Failed to increment item:", error);
      setInputValue(count.toString());
    }
  }, [id, count, onIncrement]);

  const handleDecrement = useCallback(async () => {
    if (count > 1) {
      try {
        console.log('Decrementing item with id:', id, 'current count:', count);
        await onDecrement();
        setInputValue((prev) => (Number(prev) - 1).toString());
      } catch (error) {
        console.error("Failed to decrement item:", error);
        setInputValue(count.toString());
      }
    } else {
      console.log('Count <= 1, removing item with id:', id);
      await handleRemove();
    }
  }, [id, count, onDecrement, handleRemove]);

  const handleInputChange = useCallback(
    async (e) => {
      const value = e.target.value;
      setInputValue(value);
      console.log('Input changed for id:', id, 'value:', value);

      const parsedValue = parseInt(value, 10);
      if (value === "" || isNaN(parsedValue) || parsedValue < 0) {
        return; // Defer to blur
      }

      try {
        if (parsedValue === 0) {
          console.log('Input set to 0, removing item with id:', id);
          await handleRemove();
        } else {
          console.log('Updating quantity for id:', id, 'to:', parsedValue);
          await onUpdateQuantity(parsedValue);
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
        setInputValue(count.toString());
      }
    },
    [id, count, onUpdateQuantity, handleRemove]
  );

  const handleBlur = useCallback(
    async () => {
      console.log('Input blur for id:', id, 'inputValue:', inputValue);
      const parsedValue = parseInt(inputValue, 10);

      if (inputValue === "" || isNaN(parsedValue) || parsedValue < 0) {
        console.log('Invalid or empty input, reverting to count:', count);
        setInputValue(count.toString());
        return;
      }

      if (parsedValue === 0) {
        console.log('Input set to 0 on blur, removing item with id:', id);
        await handleRemove();
      } else if (parsedValue !== count) {
        console.log('Input blur updating quantity for id:', id, 'to:', parsedValue);
        try {
          await onUpdateQuantity(parsedValue);
        } catch (error) {
          console.error("Failed to update quantity on blur:", error);
          setInputValue(count.toString());
        }
      }
    },
    [id, count, inputValue, onUpdateQuantity, handleRemove]
  );

  console.log(`Item ${name || "Unknown"}: count=${count}, total=₹${total.toFixed(2)}`);

  return (
    <div className="flex w-full gap-2">
      <div className="relative w-[25%] h-24 border border-gray-200">
        <Image src="/placeholder.jpg" alt={name || "Product"} fill className="object-cover object-contain" />
        <div className="absolute z-10 w-fit h-fit p-1 border border-green-700">
          <div className="rounded-full bg-green-700 h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-col w-[70%] gap-2">
        <h2 className="text-black text-xl font-bold">{name || "Unknown Product"}</h2>
        <span className="text-gray-700">{restaurantName || "Unknown Restaurant"}</span>
        <p className="text-gray-500 text-xs">{description || "No description"}</p>
        {customizations && (
          <span className="text-gray-500 text-sm font-medium">{customizations}</span>
        )}
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
            aria-label={`Increase quantity of ${name || "product"}`}
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
            aria-label={`Quantity of ${name || "product"}`}
          />
          <button
            className="w-fit h-fit rounded-full p-1 bg-red-50"
            onClick={handleDecrement}
            aria-label={`Decrease quantity of ${name || "product"}`}
          >
            <Minus color="red" size={20} />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <button
          className="w-fit h-fit bg-orange-100 flex items-center justify-center rounded-full p-1 transform translate-x-2"
          onClick={handleRemove}
          aria-label={`Remove ${name || "product"} from cart`}
        >
          <Trash2 color="orange" size={20} />
        </button>
        <span className="text-blue-600 font-bold text-sm">₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}