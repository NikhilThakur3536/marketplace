import FilterChip from "./FilterChip";

const filters = [
  { label: "All", active: true },
  { label: "Fast Delivery", active: false },
  { label: "Top Rated", active: false },
  { label: "New Arrivals", active: false },
];

export default function FilterChips() {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto py-2">
      {filters.map((filter) => (
        <FilterChip key={filter.label} label={filter.label} active={filter.active} />
      ))}
    </div>
  );
}