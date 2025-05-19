"use client";
import { motion } from "framer-motion";

export const DashedCircle = ({ height, width }) => {
  return (
    <svg
      className="ml-2 mt-8"
      width={width}
      height={height}
      viewBox="0 0 160 155"
      fill="none"
    >
      {/* Solid Yellow Circle */}
      <circle cx="74" cy="74" r="72" fill="#FFCF54" />

      {/* Dashed Stroke Circle */}
      <circle
        cx="74"
        cy="74"
        r="64"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeDasharray="4 5"
      />

      {/* All arcs rotate together */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{  duration:0.8 , ease: "linear" }}
      >
        {/* Top-left arc */}
        <path
          d="M 4 36 A 72 72 0 0 1 32 6"
          stroke="#4D906E"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Top-right arc */}
        <path
          d="M 152 64 A 72 72 0 0 0 127 14"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Bottom arc */}
        <path
          d="M 50 148 A 72 72 0 0 0 98 148"
          stroke="#FF6B45"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </motion.g>
    </svg>
  );
};
