"use client"

const CustomLabel = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none text-white mb-2 block ${className}`}
  >
    {children}
  </label>
);

export default CustomLabel;