    import Image from 'next/image';
    import { DashedCircle } from '../components/DashedCircle';
    import { motion } from 'framer-motion';
    import { ChevronRight } from 'lucide-react';

    const translations = {
    en: {
        Our: "Our",
        bestDelivered: "Best Delivered",
        categories: "Categories",
        slogan: "It’s not just delivering food, it’s about delivering happiness !!",
        item1: "Chilli Paneer",
        item2: "Chowmein",
        item3: "Momos",
        orderNow: "Order now",
        offersTitle: "OFFERS",
        grabDeals: "Grab the best deals !!",
        buy2Get1FreeLine1: "Buy 2",
        buy2Get1FreeLine2: "Get 1 Free",
        order: "Order",
        now: "Now",
        priceRs180: "Rs 180",
        save: "Save",
        savePercent: "30%",
        priceRs250: "Rs.250",
        vegChowmein: "Veg Chowmein",
        chowmeinHot: "Get Your Chowmein Hot",
        priceRs230: "Rs 230"
    },
    guj: {
        Our: "અમારા",
        bestDelivered: "સૌથી શ્રેષ્ઠ વિતરણ",
        categories: "શ્રેણીઓ",
        slogan: "કેવળ ખોરાક પહોંચાડવાનું નથી, ખુશી પહોંચાડવાનો મામલો છે !!",
        item1: "મરચા પનીર",
        item2: "ચોમેઇન",
        item3: "મોમોસ",
        orderNow: "હવે ઓર્ડર કરો",
        offersTitle: "ઑફર્સ",
        grabDeals: "શ્રેષ્ઠ ડીલ મેળવો !!",
        buy2Get1FreeLine1: "2 ખરીદો",
        buy2Get1FreeLine2: "1 મફત મેળવો",
        order: "ઓર્ડર",
        now: "હવે",
        priceRs180: "રૂ 180",
        save: "સેવ કરો",
        savePercent: "30%",
        priceRs250: "રૂ.250",
        vegChowmein: "વેજ ચોમેઇન",
        chowmeinHot: "તમારા ચોમેઇનને ગરમ રાખો",
        priceRs230: "રૂ 230"
    },
    ar: {
        Our: "لدينا",
        bestDelivered: "أفضل توصيل",
        categories: "الفئات",
        slogan: "ليس مجرد توصيل الطعام، بل توصيل السعادة !!",
        item1: "تشيللي بانير",
        item2: "تشاو مين",
        item3: "موموس",
        orderNow: "اطلب الآن",
        offersTitle: "العروض",
        grabDeals: "احصل على أفضل الصفقات !!",
        buy2Get1FreeLine1: "اشتر 2",
        buy2Get1FreeLine2: "واحصل على 1 مجانًا",
        order: "اطلب",
        now: "الآن",
        priceRs180: "ر.س 180",
        save: "وفر",
        savePercent: "30%",
        priceRs250: "ر.س.250",
        vegChowmein: "تشاو مين نباتي",
        chowmeinHot: "احصل على تشاو مين ساخن",
        priceRs230: "ر.س 230"
    }
    };

    export default function OffersSection( {language}) {
          const t = (key) => translations[language]?.[key] || translations.en[key];

    return (
        <>
        <div className="flex gap-6">
            <div className="w-34">
            <div className="ml-2 w-full h-6 mt-4">
                <span className="text-white text-sm font-bold pr-1">{t("Our")}</span>
                <span className="text-orange-500 text-sm font-bold pr-4">{t("bestDelivered")}</span>
            </div>
            <div className="ml-2">
                <span className="text-white text-sm font-bold">{t("categories")}</span>
            </div>
            </div>
            <div className="w-[50%]">
            <p className="mt-6 w-fit h-fit px-0.5 py-1 text-center text-white rounded-xl border border-dashed border-white text-xs">
                {t("slogan")}
            </p>
            </div>
        </div>
        <div className="flex justify-center gap-16 relative">
            <DashedCircle height={120} width={120} />
            <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute top-[25%] left-2 transform translate-x-1"
            >
            <Image src="/chillipaneer.png" alt="chillipaneer" width={150} height={150} />
            </motion.div>
            <p className="absolute -bottom-6 left-4 text-white font-bold text-lg">{t("item1")}</p>
            <div className="absolute -bottom-10 flex gap-1 left-[10%]">
            <p className="text-orange text-xs">{t("orderNow")}</p>
            <ChevronRight className="text-orange" size={20} />
            </div>
            <DashedCircle height={120} width={120} />
            <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute top-[12%] left-56 transform translate-x-2"
            >
            <Image src="/chowmein.png" alt="chowmein" width={85} height={85} />
            </motion.div>
            <p className="absolute -bottom-6 left-[61%] text-white font-bold text-lg">{t("item2")}</p>
            <div className="absolute -bottom-10 flex gap-1 left-[65%]">
            <p className="text-orange text-xs">{t("orderNow")}</p>
            <ChevronRight className="text-orange" size={20} />
            </div>
        </div>
        <div className="flex w-[360px] justify-center -ml-2 mt-6 relative">
            <DashedCircle height={120} width={120} />
            <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute top-[25%]"
            >
            <Image src="/momos.png" alt="momos" width={100} height={100} />
            </motion.div>
            <p className="absolute -bottom-6 left-[41%] text-white font-bold text-lg">{t("item3")}</p>
            <div className="absolute -bottom-10 flex gap-1 left-[41%]">
            <p className="text-orange text-xs">{t("orderNow")}</p>
            <ChevronRight className="text-orange" size={20} />
            </div>
        </div>
        <div className="mt-12 flex gap-16">
            <p className="text-orange-500 text-2xl font-bold ml-4">{t("offersTitle")}</p>
            <p className="w-fit h-fit px-2 py-1 text-center text-white rounded-xl border-2 border-dashed border-white text-lg">
            {t("grabDeals")}
            </p>
        </div>
        <div className="w-[360px] h-[80vh] px-2 ml-4 flex flex-col items-center gap-2 mt-4">
            <div className="relative bg-gradient-to-b from-[#FFCF54] to-[#C28E07] rounded-lg w-[80%] h-[50%] border-2 border-[#E4A80F] flex flex-col px-2">
            <p className="font-bold text-lg mt-2 ml-2">{t("buy2Get1FreeLine1")}</p>
            <p className="font-bold text-lg ml-2">{t("buy2Get1FreeLine")}</p>
            <p className="font-bold text-4xl mt-1 bg-gradient-to-r from-[#E55B2A] to-[#E98562] bg-clip-text text-transparent ml-2">{t("order")}</p>
            <p className="font-bold text-4xl bg-gradient-to-r from-[#E55B2A] to-[#E98562] bg-clip-text text-transparent ml-2">{t("now")}</p>
            <Image src="/bigburger.png" alt="burger" width={160} height={160} className="absolute right-1 top-6" />
            <Image src="/star.png" alt="star" width={150} height={150} className="absolute right-1 -top-12 transform -translate-y-2" />
            <p className="text-white text-[0.5rem] font-bold absolute right-16 top-4 transform translate-y-1.5 -translate-x-0.5">{t("priceRs180")}</p>
            </div>
            <div className="bg-gradient-to-b from-[#4D906E] to-[#0BAE5B] rounded-lg w-[80%] h-[50%] border-2 border-[#004D26] relative">
            <Image src="/chickenbiryani.png" width={230} height={230} alt="chicken biryani" className="absolute bottom-0 left-6" />
            <p className="text-yellow text-4xl font-bold ml-[65%] mt-2">{t("save")}</p>
            <p className="text-yellow text-xl font-bold ml-[75%]">{t("savePercent")}</p>
            <p className="bg-yellow w-fit p-1 rounded-lg font-bold text-white -rotate-30 ml-4 -mt-12 text-2xl">{t("priceRs250")}</p>
            </div>
            <div className="bg-[#FC603A] rounded-lg w-[80%] h-[50%] border-4 border-[#BC2F0C] relative">
            <Image src="/vegchowmein.png" width={280} height={280} alt="veg chowmein" className="absolute bottom-0 left-2" />
            <p className="text-white font-bold text-2xl ml-2">{t("vegChowmein")}</p>
            <p className="text-white ml-2 text-sm"> {t("chowmeinHot")}</p>
            <div className="rounded-full w-16 h-16 bg-green border-4 border-[#117D47] absolute right-2 top-2 text-white font-bold flex justify-center items-center">{t("priceRs230")}</div>
            </div>
        </div>
        </>
    )
    }