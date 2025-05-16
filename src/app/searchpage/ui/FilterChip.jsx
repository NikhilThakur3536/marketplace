import PropTypes from "prop-types";

function FilterChip({ label, active }) {
  return (
    <div
      className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
        active ? "bg-yellow-500 text-black" : "bg-green-800 bg-opacity-50 text-white"
      }`}
    >
      {label}
    </div>
  );
}

FilterChip.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

export default FilterChip;