import { Search, Filter, ShoppingCart } from "lucide-react";
import PropTypes from "prop-types";
import { useRouter } from 'next/navigation';


function Header({ toggleFilters,onSearch }) {
  
   const router = useRouter();

  const handleCartClick = () => {
    router.push('/checkout');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="relative flex-1 mr-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white" />
        </div>
        <input
          type="text"
          placeholder="Enter item/restaurant to search"
          className="w-full bg-orange bg-opacity-90 text-white placeholder-white placeholder-opacity-90 rounded-full py-2 pl-10 pr-4 focus:outline-none"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex space-x-3">
        <button className="bg-gray-800 rounded-full p-2" onClick={toggleFilters}>
          <Filter className="h-5 w-5" />
        </button>
        <button className="bg-gray-800 rounded-full p-2">
          <ShoppingCart className="h-5 w-5" onClick={handleCartClick}/>
        </button>
      </div>
    </div>
  );
}

Header.propTypes = {
  toggleFilters: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,

};

export default Header;