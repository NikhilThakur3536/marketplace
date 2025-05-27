import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import OrderCard from "../../components/OrderCard";

function RestaurantCard({
  name,
  cuisine,
  rating,
  deliveryTime,
  distance,
  price,
  productVarientUomId,
  discount,
  productId,   
}) {
  const [isOrder, setIsOrder] = useState(false);
  const toggleOrderCard = () => setIsOrder(!isOrder);

  const foodItems = [
    {
      id: "pizza-1",
      name: "Pizza Paradise",
      description: "Italian Pizza",
      price: 13,
      imageUrl: "/restaurantcard.png",
      sizeOptions: ["Small", "Medium", "Large"],
      extrasCategories: [
        ["All", "Ittalian", "Indian", "American"],
        ["All", "Ittalian", "Indian", "American"],
        ["All", "Ittalian", "Indian", "American"],
      ],
    },
    {
      id: "burger-1",
      name: "Classic Burger",
      description: "American Style Burger",
      price: 9.99,
      imageUrl: "/restaurantcard.png",
      sizeOptions: ["Regular", "Double", "Triple"],
      extrasCategories: [
        ["None", "Cheese", "Bacon", "Avocado"],
        ["None", "Lettuce", "Tomato", "Onion"],
      ],
    },
    {
      id: "pasta-1",
      name: "Fettuccine Alfredo",
      description: "Creamy Italian Pasta",
      price: 11.5,
      imageUrl: "/restaurantcard.png",
      sizeOptions: ["Half", "Full"],
      extrasCategories: [
        ["None", "Chicken", "Shrimp", "Broccoli"],
        ["None", "Extra Cheese", "Garlic Bread"],
      ],
    },
  ]

  return (
    <div className="relative">
      <div className={`transition-all duration-300 ${isOrder ? "blur-sm" : ""}`}>
        <div className="bg-[#2C2C2C]/20 rounded-lg overflow-hidden">
          <div className="relative">
            <img
              src="/restaurantcard.png"
              alt={name}
              className="w-full h-40 object-cover"
            />
            <div className="absolute top-2 left-2 bg-orange-500 px-2 py-1 text-sm font-bold">
              {discount}
            </div>
            <div className="absolute bottom-2 left-2 flex items-center space-x-4">
              <div className="flex items-center bg-gradient-to-r from-[#4D906E] to-[#50CB8C] bg-opacity-80 rounded-lg px-2 py-1">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm">{rating}</span>
              </div>
              <div className="flex items-center bg-gray-800 bg-opacity-80 rounded px-2 py-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{deliveryTime}</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-sm text-gray-400">{cuisine}</p>
                <div className="flex items-center mt-1 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{distance}</span>
                </div>
                <button
                  className="mt-2 bg-orange-600 text-white text-xs px-3 py-1 rounded-full"
                  onClick={toggleOrderCard}
                >
                  Quick Order
                </button>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-indigo-200 mt-2 bg-[#1D0F43]/56 border border-[#6B58A0] rounded-xl px-2">
                  {price}
                </span>
                <button className="flex items-center mt-[90%] text-yellow-500 text-sm">
                  Menu <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOrder && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="z-20">
            <OrderCard item={foodItems[1]} productId={productId} productVarientUomId={productVarientUomId} onAddToCart={() => setIsOrder(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

RestaurantCard.propTypes = {
  name: PropTypes.string.isRequired,
  cuisine: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  deliveryTime: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  discount: PropTypes.string.isRequired,
};

export default RestaurantCard;
