"use client"

import React from "react";

const CustomSelect = React.forwardRef(
  ({ children, value, onChange, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }
);

export default CustomSelect;