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
    name: "Pizza Paradise",
    cuisine: "Italian",
    rating: 4.8,
    deliveryTime: "15-20 min",
    distance: "1.5 min",
    price: "$13",
    discount: "30% OFF",
  },
];

export default function Restaurants() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">ALL RESTAURANTS</h2>
      <div className="space-y-4">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={`${restaurant.name}-${index}`} {...restaurant} />
        ))}
      </div>
    </div>
  );
}