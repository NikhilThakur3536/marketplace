import PropTypes from "prop-types";

function CuisineChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm border ${
        active ? "bg-gray-800 border-white text-white" : "bg-transparent border-gray-700 text-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

CuisineChip.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CuisineChip;