import Image from 'next/image';
import { Star } from 'lucide-react';

// Translations object
const translations = {
  en: {
    topRestaurants: "TOP RESTAURANTS",
    restaurantName: "Dominos",
    cuisineType: "Fast Food",
    location: "Noida Sector 47",
    offerText: "Extra 10% off on First Order",
    rating: "4.5",
  },
  guj: {
    topRestaurants: "ટોપ રેસ્ટોરન્ટ્સ",
    restaurantName: "ડોમિનોસ",
    cuisineType: "ઝડપી ભોજન",
    location: "નોઇડા સેક્ટર ૪૭",
    offerText: "પ્રથમ ઓર્ડર પર વધારાનો ૧૦% છૂટ",
    rating: "૪.૫",
  },
  ar: {
    topRestaurants: "أفضل المطاعم",
    restaurantName: "دومينوز",
    cuisineType: "وجبات سريعة",
    location: "نويدا القطاع ٤٧",
    offerText: "خصم 10٪ إضافي على الطلب الأول",
    rating: "٤٫٥",
  }
};

function RestaurantCard({ bgColor, borderColor, starBgColor, language }) {
  const t = (key) => translations[language]?.[key] || translations.en[key];

  return (
    <div className={`relative ${bgColor} rounded-lg w-80 h-58 border-4 ${borderColor}`}>
      <div className="w-full h-[50%] relative">
        <Image src="/restaurantbg.png" alt={t("restaurantName")} fill className="object-fill ml-8" />
      </div>
      <p className="text-white font-semibold ml-2 text-sm">{t("restaurantName")}</p>
      <div>
        <p className="text-white font-semibold ml-2 text-[0.5rem]">{t("cuisineType")}</p>
        <p className="text-white font-semibold ml-2 text-[0.5rem]">{t("location")}</p>
      </div>
      <p className="bg-yellow text-green font-bold text-sm w-fit h-fit px-2 py-0.5 rounded-xl ml-8">{t("offerText")}</p>
      <div className={`flex justify-center items-center w-fit h-fit rounded-full ${starBgColor} absolute top-[51%] right-12 p-1`}>
        <Star color="white" size={10} />
      </div>
      <p className="text-white font-bold absolute top-[50%] right-6 transform -translate-y-0.5">{t("rating")}</p>
    </div>
  );
}

export default function RestaurantsSection({ language = 'en' }) {
  return (
    <>
      <div className="mt-12 flex gap-16">
        <p className="text-orange-500 text-2xl font-bold ml-4">{translations[language]?.topRestaurants || translations.en.topRestaurants}</p>
      </div>
      <div className="h-[100vh] flex flex-col items-center gap-2 mt-4">
        <RestaurantCard bgColor="bg-green" borderColor="border-[#037932]" starBgColor="bg-orange" language={language} />
        <RestaurantCard bgColor="bg-gradient-to-b from-[#4D906E] to-[#0BAE5B]" borderColor="border-[#004D26]" starBgColor="bg-orange" language={language} />
        <RestaurantCard bgColor="bg-[#FC603A]" borderColor="border-[#BC2F0C]" starBgColor="bg-orange" language={language} />
        <RestaurantCard bgColor="bg-[#FC603A]" borderColor="border-[#BC2F0C]" starBgColor="bg-yellow" language={language} />
      </div>
    </>
  );
}
