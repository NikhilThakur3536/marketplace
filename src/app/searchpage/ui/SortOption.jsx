import PropTypes from "prop-types";

function SortOption({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative flex items-center">
        <input
          type="radio"
          className="sr-only"
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
        />
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            checked ? "border-white" : "border-gray-500"
          }`}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
        </div>
      </div>
      <span className="ml-2">{label}</span>
    </label>
  );
}

SortOption.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SortOption;