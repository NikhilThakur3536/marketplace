import React from "react";

const Badge = ({ children, variant = "secondary", className = "" }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variantClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-600 text-white",
    success: "bg-green-600 text-white",
    danger: "bg-red-600 text-white",
    warning: "bg-yellow-600 text-white",
  };

  return <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</span>;
};

export default Badge;
