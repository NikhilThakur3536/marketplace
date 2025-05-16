import CategoryItem from "./CategoryItems";

const categories = [
  { icon: "/cpizza.png", name: "Pizza" },
  { icon: "/cburger.png", name: "Burger" },
  { icon: "/cshake.png", name: "Shakes" },
  { icon: "/cpasta.png", name: "Pasta" },
  { icon: "/csandwich.png", name: "Sandwich" },
];

export default function Categories() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3">CATEGORIES</h2>
      <div className="flex justify-between">
        {categories.map((category) => (
          <CategoryItem key={category.name} icon={category.icon} name={category.name} />
        ))}
      </div>
    </div>
  );
}