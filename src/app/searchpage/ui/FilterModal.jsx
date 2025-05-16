import { X } from "lucide-react";
import SortOption from "./SortOption";
import CuisineChip from "./CuisineChip";
import PropTypes from "prop-types";

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Rating", value: "rating" },
  { label: "Delivery Time", value: "deliveryTime" },
  { label: "Price", value: "price" },
];

const cuisines = ["All", "Italian", "Indian", "American"];

function FilterModal({
  sortBy,
  selectedCuisines,
  priceRange,
  onSortChange,
  onCuisineToggle,
  onPriceRangeChange,
  onApplyFilters,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-start">
      <div className="bg-black w-full max-w-md border border-gray-800 rounded-t-lg max-h-screen overflow-auto">
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-orange">Filters & Sort</h2>
            <button onClick={onClose} className="text-orange">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-6 bg-gradient-to-r from-[#212121] to-[#878787]/25 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <span className="h-3 w-3 bg-orange rounded-full mr-2"></span>
              SORT BY
            </h3>
            <div className="space-y-3">
              {sortOptions.map((option) => (
                <SortOption
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={onSortChange}
                />
              ))}
            </div>
          </div>
          <div className="mb-6 bg-gradient-to-r from-[#212121] to-[#878787]/25 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
              Cuisines
            </h3>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <CuisineChip
                  key={cuisine}
                  label={cuisine}
                  active={selectedCuisines.includes(cuisine)}
                  onClick={() => onCuisineToggle(cuisine)}
                />
              ))}
            </div>
          </div>
          <div className="mb-6 bg-gradient-to-r from-[#212121] to-[#878787]/25 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
              Price Range
            </h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange}
                onChange={(e) => onPriceRangeChange(Number.parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>0</span>
                <span>{priceRange}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onApplyFilters}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

FilterModal.propTypes = {
  sortBy: PropTypes.string.isRequired,
  selectedCuisines: PropTypes.arrayOf(PropTypes.string).isRequired,
  priceRange: PropTypes.number.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onCuisineToggle: PropTypes.func.isRequired,
  onPriceRangeChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterModal;