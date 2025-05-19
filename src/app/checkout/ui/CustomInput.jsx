"user client"

import React from "react";

const CustomInput = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    className={`w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
    ref={ref}
    {...props}
  />
));
export default CustomInput;