import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

function RestaurantCard({ name, cuisine, rating, deliveryTime, distance, price, discount }) {
  return (
    <div className="bg-[#2C2C2C]/20 rounded-lg overflow-hidden">
      <div className="relative">
        <img src="/restaurantcard.png" alt={name} className="w-full h-40 object-cover" />
        <div className="absolute top-2 left-2 bg-orange-500 px-2 py-1 text-sm font-bold">{discount}</div>
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
            <button className="mt-2 bg-orange-600 text-white text-xs px-3 py-1 rounded-full">Quick Order</button>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-indigo-200 mt-2 bg-[#1D0F43]/56 border border-[#6B58A0] rounded-xl px-2">{price}</span>
            <button className="flex items-center mt-[90%] text-yellow-500 text-sm">
              Menu <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
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