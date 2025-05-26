import React from "react";

const Avatar = ({ src, alt, fallback, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gray-600 flex items-center justify-center overflow-hidden ${className}`}
    >
      {src ? (
        <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-white">{fallback}</span>
      )}
    </div>
  );
};

export default Avatar;
