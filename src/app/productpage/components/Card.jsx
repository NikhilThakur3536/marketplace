import React from "react";

const Card = ({ children, className = "" }) => {
  return <div className={`rounded-lg border shadow-sm ${className}`}>{children}</div>;
};

export default Card;
