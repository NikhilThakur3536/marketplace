import Link from "next/link"; 
import { Heart, Star } from "lucide-react";

const ProductCard = ({
  id, 
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  type,
  inStock,
//   freeShipping,
}) => {
  const discountPercent = Math.round(
    ((originalPrice - price) / originalPrice) * 100
  );

  return (
    <div className="w-full md:w-[20rem] mx-auto rounded-xl overflow-hidden border bg-white shadow-sm">
      <div className="relative bg-gray-100">
        <Link href={`/products/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-contain cursor-pointer"
          />
        </Link>
        <button className="absolute top-2 right-2 p-1 rounded-full bg-white shadow hover:bg-gray-100 transition">
          <Heart className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h2 className="text-sm font-medium text-gray-900 mb-1 hover:underline cursor-pointer">
            {name}
          </h2>
        </Link>

        <div className="flex items-center text-sm gap-1 mb-1">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.round(rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-semibold text-black">
            ${price.toFixed(2)}
          </span>
          <span className="line-through text-sm text-gray-400">
            ${originalPrice.toFixed(2)}
          </span>
          <span className="text-sm text-green-600 font-medium">
            {discountPercent}% off
          </span>
        </div>

        <p className="text-sm text-gray-500">{type}</p>

        <button
          disabled={!inStock}
          className={`w-full mt-3 text-sm font-semibold py-2 rounded-md transition ${
            inStock
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
