"use client"

const CustomButton = ({ className = "", children, ...props }) => (
  <button
    className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default CustomButton