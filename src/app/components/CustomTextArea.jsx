import React, { forwardRef } from "react";

const CustomTextarea = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      className={`w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${className}`}
      ref={ref}
      rows={3}
      {...props}
    />
  );
});

CustomTextarea.displayName = "CustomTextarea";

export { CustomTextarea };
