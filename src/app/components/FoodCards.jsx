import Image from 'next/image';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

function FoodCard({ imageSrc, alt, height, delay, left, texts }) {
  // texts = { takeAway, fromNearby, restaurants }
  return (
    <motion.div
      className={`absolute bg-white w-24 rounded-t-xl flex flex-col items-center bottom-80 ${left}`}
      style={{ height: `${height}px` }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height, opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeIn" }}
    >
      <h3 className="text-orange-500 font-bold text-sm mt-2">{texts.takeAway}</h3>
      <h4 className="text-[#8B8B8B] text-[0.6rem] font-semibold">{texts.fromNearby}</h4>
      <p className="text-white bg-orange-500 mt-1 py-0.5 px-1 rounded-lg w-fit h-fit text-[0.4rem]">
        {texts.restaurants}
      </p>
      <motion.div
        className="absolute right-0 -bottom-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      >
        <Image src={imageSrc} alt={alt} width={60} height={60} />
      </motion.div>
      <motion.div
        className="bg-green w-fit h-fit rounded-full p-1 absolute bottom-1 left-1"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.3 }}
      >
        <Send color="white" size={15} />
      </motion.div>
    </motion.div>
  );
}

const translations = {
  en: {
    takeAway: "TAKE AWAY",
    fromNearby: "From Nearby",
    restaurants: "Restaurants",
  },
  guj: {
    takeAway: "ટેક અવે",
    fromNearby: "આસપાસથી",
    restaurants: "રેસ્ટોરન્ટ્સ",
  },
};

export default function FoodCards({ language = 'en' }) {
  // fallback to 'en' if language not available
  const texts = translations[language] || translations.en;

  return (
    <>
      <FoodCard
        imageSrc="/biryani.png"
        alt="biryani"
        height={116}
        delay={0}
        left={"left-4"}
        texts={texts}
      />
      <FoodCard
        imageSrc="/burger.png"
        alt="burger"
        height={130}
        delay={0.2}
        left={"left-32"}
        texts={texts}
      />
      <FoodCard
        imageSrc="/breads.png"
        alt="breads"
        height={145}
        delay={0.4}
        left={"left-62"}
        texts={texts}
      />
    </>
  );
}
