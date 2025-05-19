"use client"

const CustomFormMessage = ({ children }) => {
  if (!children) return null;
  return <p className="text-sm font-medium text-red-500 mt-1">{children}</p>;
};

export default CustomFormMessage;