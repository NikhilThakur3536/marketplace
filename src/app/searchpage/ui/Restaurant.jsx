

import RestaurantCard from "./RestaurantCard";

const restaurants = [
  {
    name: "Pizza Paradise",
    cuisine: "Italian",
    rating: 4.8,
    deliveryTime: "15-20 min",
    distance: "1.5 min",
    price: "$13",
    discount: "30% OFF",
  },
  {
    name: "Burger Town",
    cuisine: "American",
    rating: 4.5,
    deliveryTime: "10-15 min",
    distance: "1.2 min",
    price: "$9.99",
    discount: "20% OFF",
  },
  {
    name: "Pasta Palace",
    cuisine: "Italian",
    rating: 4.6,
    deliveryTime: "12-18 min",
    distance: "1.7 min",
    price: "$11.5",
    discount: "15% OFF",
  },
];

export default function Restaurants({ searchQuery }) {
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">ALL RESTAURANTS</h2>
      <div className="space-y-4">
        {filteredRestaurants.map((restaurant, index) => (
          <RestaurantCard key={`${restaurant.name}-${index}`} {...restaurant} />
        ))}
      </div>
    </div>
  );
}
