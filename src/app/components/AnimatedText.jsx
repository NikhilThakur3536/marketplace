import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { DashedCircle } from '../components/DashedCircle';

export default function AnimatedText() {
  const textSets = [
    { line1: "FASTEST", line2: "DELIVERY", line3: "PICKUP" },
    { line1: "QUICKEST", line2: "DISPATCH", line3: "DROPOFF" },
    { line1: "SHARPEST", line2: "SERVICE", line3: "PICKUP" },
    { line1: "SMARTEST", line2: "DELIVERY", line3: "COLLECT" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % textSets.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentSet = textSets[index];

  return (
    <div className="flex gap-4 w-full px-2">
      <div className="flex flex-col mt-[12%] ml-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSet.line1}
            className="text-white text-2xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {currentSet.line1}
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSet.line2}
              className="text-orange-500 text-2xl font-bold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {currentSet.line2}
            </motion.p>
          </AnimatePresence>
          <span className="text-white text-3xl font-bold">&</span>
        </div>
        <div className="flex gap-1">
          <p className="text-2xl font-bold text-white">EASY</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSet.line3}
              className="text-2xl font-bold text-orange-500"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {currentSet.line3}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          <div className="bg-green rounded-full w-8 h-8 mt-2">
            <Image src="/menprofile.png" alt="profile" height={32} width={32} className="object-cover" />
          </div>
          <p className="mt-2 transform translate-y-1 w-[52%] text-white text-[0.5rem]">
            When you are too lazy to cook we are a click away!!
          </p>
        </div>
      </div>
      <DashedCircle height={144} width={160} />
      <Image
        src="/girleating.png"
        alt="girl"
        width={150}
        height={150}
        className="absolute z-10 right-0 top-10"
      />
    </div>
  );
}