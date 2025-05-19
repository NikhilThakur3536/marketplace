"use client"

import React from "react";

const CustomRadio = React.forwardRef(({ id, children, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      ref={ref}
      className="h-4 w-4 border border-gray-700 text-orange-500 focus:ring-orange-500"
      {...props}
    />
    <label htmlFor={id} className="text-white cursor-pointer">
      {children}
    </label>
  </div>
));

export default CustomRadio