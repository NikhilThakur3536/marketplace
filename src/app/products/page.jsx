import ProductCard from "./components/ProductCard";

const ProductsPage = () => {
  const products = [
    {
      id: "1",
      name: "Toyota Camry Air Filter",
      image: "/toyotaairfilter.png",
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.6,
      reviewCount: 89,
      type: "Aftermarket Premium",
      inStock: true,
      freeShipping: false,
    },
    {
      id: "2",
      name: "Honda Civic Headlight Assembly",
      image: "/toyotaairfilter.png",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.9,
      reviewCount: 156,
      badge: "OEM",
      type: "Original (OEM)",
      inStock: false,
      freeShipping: true,
    },
    {
      id: "3",
      name: "Ford F-150 Brake Pads",
      image: "/toyotaairfilter.png",
      price: 89.99,
      originalPrice: 109.99,
      rating: 4.7,
      reviewCount: 203,
      type: "Aftermarket Premium",
      inStock: true,
      freeShipping: true,
    },
    {
      id: "4",
      name: "BMW 3 Series Oil Filter",
      image: "/toyotaairfilter.png",
      price: 19.99,
      originalPrice: 24.99,
      rating: 4.8,
      reviewCount: 67,
      badge: "OEM",
      type: "Original (OEM)",
      inStock: true,
      freeShipping: false,
    },
    {
      id: "5",
      name: "Audi A4 Spark Plugs (Set of 4)",
      image: "/toyotaairfilter.png",
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.5,
      reviewCount: 112,
      type: "Aftermarket Standard",
      inStock: true,
      freeShipping: false,
    },
    {
      id: "6",
      name: "Mercedes C-Class Cabin Air Filter",
      image: "/toyotaairfilter.png",
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.4,
      reviewCount: 78,
      badge: "OEM",
      type: "Original (OEM)",
      inStock: true,
      freeShipping: true,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Auto Parts</h1>
          <p className="text-gray-600">{products.length} products found</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <button className="inline-flex items-center justify-center rounded-md bg-transparent border border-gray-200 font-medium px-6 py-2 hover:bg-gray-50 transition-colors">
              Filters
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-medium ml-2">
                3
              </span>
            </button>
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-10 w-full">
              <option>Sort by: Best Match</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
              <option>Newest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            reviewCount={product.reviewCount}
            badge={product.badge}
            type={product.type}
            inStock={product.inStock}
            freeShipping={product.freeShipping}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
