import React, { forwardRef } from "react";

const CustomButton = forwardRef(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-medium rounded-md transition-colors focus:outline-none";

    const variantStyles = {
      primary: "bg-orange-500 hover:bg-orange-600 text-white",
      secondary: "bg-gray-700 hover:bg-gray-600 text-white",
      outline: "bg-transparent border border-gray-600 hover:bg-gray-800 text-white",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton };
