"use client"

import { useState } from "react"
import Image from "next/image"
import { CustomButton } from "./CustomButton"
import { CustomTextarea } from "./CustomTextArea"

export default function OrderCard({ item, onAddToCart }) {
  const { name, description, price, imageUrl, sizeOptions, extrasCategories } = item

  const [selectedSize, setSelectedSize] = useState(sizeOptions[1] || sizeOptions[0])
  const [selectedExtras, setSelectedExtras] = useState(
    extrasCategories.reduce((acc, _, index) => ({ ...acc, [index]: "All" }), {})
  )
  const [instructions, setInstructions] = useState("")

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
  }

  const handleExtraSelect = (rowIndex, option) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [rowIndex]: option,
    }))
  }

  const handleAddToCart = () => {
    const orderDetails = {
      item: name,
      size: selectedSize,
      extras: selectedExtras,
      instructions,
      price,
    }

    console.log(orderDetails)
    if (onAddToCart) {
      onAddToCart(orderDetails)
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-black text-white rounded-lg overflow-hidden">
      <div className="relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          width={400}
          height={250}
          className="w-full h-[200px] object-cover"
        />
        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/90 to-transparent w-full">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-300">{description}</p>
          <p className="text-lg font-bold mt-1">$ {price}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {sizeOptions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Size</h3>
            <div className="flex gap-2 flex-wrap">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-1.5 rounded-full border border-gray-600 text-sm ${
                    selectedSize === size ? "bg-white text-black" : "bg-transparent text-white"
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {extrasCategories.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Extras</h3>
            <div className="space-y-2">
              {extrasCategories.map((options, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 flex-wrap">
                  {options.map((option) => (
                    <button
                      key={`${rowIndex}-${option}`}
                      className={`px-3 py-1.5 rounded-full border border-gray-600 text-xs ${
                        selectedExtras[rowIndex] === option
                          ? "bg-white text-black"
                          : "bg-transparent text-white"
                      }`}
                      onClick={() => handleExtraSelect(rowIndex, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-2">Special Instructions</h3>
          <CustomTextarea
            placeholder="Type instructions here"
            className="bg-transparent border-gray-600 text-white resize-none"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <CustomButton
          className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md"
          onClick={handleAddToCart}
        >
          Add to Cart
        </CustomButton>
      </div>
    </div>
  )
}
