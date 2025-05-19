"use client"

import React from "react";

const CustomTextarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    className={`w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${className}`}
    ref={ref}
    {...props}
  />
));

export default CustomTextarea;