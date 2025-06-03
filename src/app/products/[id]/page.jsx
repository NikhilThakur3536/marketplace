"use client";

import { use, useState } from "react";
import Image from "next/image";

export default function ProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise); // ✅ unwrap the params
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = {
    id: params.id,
    name: params.id === "1" ? "Toyota Camry Air Filter" : "Honda Civic Headlight Assembly",
    description:
      "High-quality replacement part designed specifically for your vehicle. Ensures optimal performance and longevity.",
    price: params.id === "1" ? 24.99 : 299.99,
    originalPrice: params.id === "1" ? 34.99 : 399.99,
    rating: params.id === "1" ? 4.6 : 4.9,
    reviewCount: params.id === "1" ? 89 : 156,
    type: params.id === "1" ? "Aftermarket Premium" : "Original (OEM)",
    inStock: params.id === "1",
    freeShipping: params.id !== "1",
    images: Array(4).fill("/toyotaairfilter.png"),
    features: [
      "Direct replacement - this air filter matches the fit and function of the original filter on specified vehicles",
      "Improves performance - designed to increase airflow for better acceleration and horsepower",
      "Easy installation - built to OE specifications for a trouble-free installation",
      "Long-lasting - high-quality materials ensure durability and extended service life",
    ],
    specifications: {
      "Part Number": params.id === "1" ? "AF-1234" : "HL-5678",
      Brand: "AutoParts Hub",
      Fitment: params.id === "1" ? "Toyota Camry 2018-2023" : "Honda Civic 2016-2022",
      Material: params.id === "1" ? "Synthetic Fiber" : "Polycarbonate/Aluminum",
      Warranty: "1 Year Limited",
    },
    compatibleVehicles: [
      params.id === "1" ? "Toyota Camry 2018-2023" : "Honda Civic 2016-2022",
      params.id === "1" ? "Toyota Avalon 2019-2023" : "Honda Accord 2018-2022",
      params.id === "1" ? "Lexus ES 2019-2023" : "Acura ILX 2019-2022",
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const increment = () => quantity < 10 && setQuantity(quantity + 1);
  const decrement = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="mb-4">
            <Image
              src={selectedImage}
              alt={product.name}
              width={600}
              height={600}
              className="w-full rounded-lg"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 border-2 rounded-md overflow-hidden ${
                  selectedImage === img ? "border-blue-600" : "border-gray-200"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={100}
                  height={100}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            <span className="text-xl text-gray-500 line-through ml-3">${product.originalPrice.toFixed(2)}</span>
            <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
              {discount}% off
            </span>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <span className="font-medium">Type:</span>
            <span className="text-gray-700">{product.type}</span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Quantity:</span>
              <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {product.inStock && (
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button className="w-10 h-10 border-r" onClick={decrement}>−</button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-12 text-center"
                />
                <button className="w-10 h-10 border-l" onClick={increment}>＋</button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {product.inStock ? (
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-md flex-1">
                Add to Cart
              </button>
            ) : (
              <button disabled className="bg-orange-500 opacity-50 text-white font-medium px-6 py-3 rounded-md flex-1 cursor-not-allowed">
                Out of Stock
              </button>
            )}

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex-1 px-6 py-3 rounded-md font-medium border transition-colors ${
                isFavorite
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {isFavorite ? "Favorited" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
