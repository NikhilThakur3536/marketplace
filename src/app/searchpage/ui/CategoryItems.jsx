import PropTypes from "prop-types";

function CategoryItem({ icon, name }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 mb-1">
        <img src={icon || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs">{name}</span>
    </div>
  );
}

CategoryItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default CategoryItem;