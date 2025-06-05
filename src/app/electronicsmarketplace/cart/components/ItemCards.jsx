"use client";

import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";

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
}) {
  const handleRemove = async () => {
    try {
      await onRemove(id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="flex w-full gap-2">
      <div className="relative w-[25%] h-24 border border-gray-200">
        <Image
          src={"/placeholder.jpg"}
          alt="pizza"
          fill
          className=" object-contain"
        />
        <div className="absolute z-60 w-fit h-fit p-1 border border-green-700">
          <div className="rounded-full bg-green-700 h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-col w-[70%] gap-2">
        <h2 className="text-black text-xl font-bold">{name}</h2>
        <span className="text-gray-700">{restaurantName}</span>
        <p className="text-gray-500 text-xs">{description}</p>
        <span className="text-gray-500 text-sm font-medium">{customizations}</span>
        {/* Fixed addOns rendering */}
        <div className="flex flex-wrap gap-2">
          {Array.isArray(addOns) && addOns.length > 0 ? (
            addOns.map((addOn, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {addOn}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500"></span>
          )}
        </div>
        <div className="flex gap-2 mt-1">
          <button className="w-fit h-fit rounded-full p-1 bg-green-50">
            <Plus color="green" size={20} />
          </button>
          <span className="text-sm font-bold text-black">{count}</span>
          <button className="w-fit h-fit rounded-full p-1 bg-red-50">
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
        <span className="text-black font-bold text-lg">{total}</span>
      </div>
    </div>
  );
}