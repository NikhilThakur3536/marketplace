"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Flame, Heart } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function Cards() {
  const cardRef = useRef(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const handleMouseMove = (e) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const xVal = (e.clientX - bounds.left) / bounds.width;
    const yVal = (e.clientY - bounds.top) / bounds.height;

    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    animate(x, 0.5, { type: "spring", stiffness: 200, damping: 20 });
    animate(y, 0.5, { type: "spring", stiffness: 200, damping: 20 });
  };

  return (
    <div className="w-full mt-10 flex justify-center perspective-[1000px]">
      <motion.div
        ref={cardRef}
        className="relative w-[90vw] max-w-md h-auto cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          viewBox="0 0 386 244"
          fill="#FDAD38"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto rounded-xl"
        >
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#FDAD38" floodOpacity="0.4" />
            </filter>
          </defs>
          <motion.path d="M20 40.22C20 33.9052 24.8941 28.6708 31.1947 28.2471L302.5 10L352.391 6.04039C359.429 5.48183 365.426 11.0897 365.34 18.1491L363.145 198.146C363.064 204.716 357.716 210 351.145 210H32C25.3726 210 20 204.627 20 198V40.22Z"
            filter="url(#shadow)"
          />
        </svg>

        <div className="rounded-full w-24 h-24 sm:w-[25vh] sm:h-[25vh] bg-yellow-50 absolute -top-8 right-10 shadow-2xl shadow-black/20 ">
          <Image
            src="/placeholder.jpg"
            alt="items-image"
            fill
            className="absolute object-cover rounded-full"
          />
        </div>
        <div className="bg-gray-100/40 rounded-lg absolute left-12 top-16 w-fit h-fit p-2 flex items-center justify-center">
          <Heart size={30} color="white" />
        </div>
        <p className="font-bold text-xl text-white absolute bottom-24 left-12">Items Name</p>
        <div className=" mt-2 absolute">
          <Flame color="red" size={20} fill="red" className="absolute bottom-20 left-12" />
          <Flame color="red" size={15} fill="yellow" className="z-10 absolute bottom-20 left-13 transform -translate-x-0.5 -translate-y-0.5" />
        </div>
      </motion.div>
    </div>
  );
}
