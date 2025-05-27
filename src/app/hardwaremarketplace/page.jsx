"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { MapPin, Search, Send, ChevronRight, Star } from 'lucide-react';
import { DashedCircle } from '../components/DashedCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import HardwareBot from '../hardwarechatbot/page'

export default function MobileView() {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/searchpage');
  };

 const textSets = [
    { line1: "FAST PARTS", line2: "ORDER", line3: "DELIVERY" },
    { line1: "QUICK FIT", line2: "SPARE", line3: "PICKUP" },
    { line1: "SWIFT SHOP", line2: "PARTS", line3: "SERVICE" },
    { line1: "EASY BUY", line2: "AUTO", line3: "SUPPLY" },
];

  const [index, setIndex] = useState(0);
  const [chatCollapse, setChatCollapse] = useState(true);

  const chatCollapseHandler = () => {
    setChatCollapse(!chatCollapse);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % textSets.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentSet = textSets[index];

  return (
    <div className="bg-black w-screen h-screen relative overflow-y-auto  flex justify-center">
      {/* Constrain the content to a mobile-like width */}
      <div className=" max-w-md h-full relative ">
        <div
          className="z-50 fixed bottom-20  w-12 h-12 bg-red-200 rounded-full backdrop-blur-2xl flex items-center justify-center cursor-pointer"
          onClick={chatCollapseHandler}
        >
          <span className="text-white font-bold">{chatCollapse ? "💬" : "✕"}</span>
        </div>
        {!chatCollapse && <HardwareBot />}
        <Navbar />
        <div className="flex justify-between">
          <div className="fixed -top-8 left-10 w-24 h-24 z-50">
            <Image
              src="/infoware.png"
              alt="logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <input
            type="text"
            defaultValue="Dubai"
            className="fixed left-[55%] top-1 z-50 w-24 px-8 py-1 bg-orange-500 rounded-md text-white text-xs font-semibold shadow-lg transform -translate-y-0.5 placeholder:text-xs placeholder:-top-0.5"
            placeholder="Enter location"
          />
          <MapPin color="white" size={20} className="fixed left-[56%] z-60 top-2 transform -translate-y-1 -translate-x-4" />
        </div>
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
              <div className="bg-green-500 rounded-full w-8 h-8 mt-2">
                <Image src="/menprofile.png" alt="profile" height={32} width={32} className="object-cover" />
              </div>
              <p className="mt-2 transform translate-y-1 w-[52%] text-white text-[0.5rem]">
                When you are too lazy to cook we are a click away!!
              </p>
            </div>
          </div>
          <div className='absolute right-8 top-6'>
          <DashedCircle height={144} width={160} />
          <Image
            src="/automobileparts.png"
            alt="girl"
            width={120}
            height={120}
            className="absolute z-10 right-6 top-10"
          />
          </div>
        </div>
        <hr className="absolute left-6 mt-4 w-[85%] h-[1px] border border-dashed border-white" />
        <div className="flex justify-center items-center gap-2">
          <div className="bg-orange-500 rounded-xl w-[80%] h-8 mt-8">
            <div className="flex gap-1">
              <Search size={20} className="text-white mt-2 -translate-y-0.5 ml-1" />
              <input
                className="text-white text-xs mt-1.5 underline underline-offset-2 placeholder:text-white"
                type="text"
                placeholder="Enter Item or Part Name"
                onClick={handleSearchClick}
              />
            </div>
          </div>
        </div>
        <svg
          className="ml-1 mt-8 overflow-hidden"
          width="100%"
          height="141"
          viewBox="0 0 392 141"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 45.9485C0 39.7463 4.72636 34.5659 10.9026 33.9987L378.903 0.202825C385.934 -0.442896 392 5.09177 392 12.1525V129C392 135.627 386.627 141 380 141H12C5.37258 141 0 135.627 0 129V45.9485Z"
            fill="#FC603A"
          />
        </svg>
        <motion.div
          className="absolute bg-white h-[18%] w-[23%] rounded-t-xl bottom-[32.3%] left-[9%] flex flex-col items-center md:bottom-[41%] "
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 116, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-orange-500 font-bold text-sm mt-2">BUY NOW</h3>
          <h4 className="text-[#8B8B8B] text-[0.6rem] font-semibold">From Vendors</h4>
          <p className="text-white bg-orange-500 mt-1 py-0.5 px-1 rounded-lg w-fit h-fit text-[0.4rem]">
            Parts Shop
          </p>
          <motion.div
            className="absolute right-0 bottom-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Image src="/auto1.png" alt="biryani" width={50} height={50} />
          </motion.div>
          <motion.div
            className="bg-green w-fit h-fit rounded-full p-1 absolute bottom-1 left-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Send color="white" size={15} />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bg-white h-[20%] w-[23%] rounded-t-xl bottom-[32.3%] left-[38%] flex flex-col items-center md:bottom-[41%]"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 130, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeIn" }}
        >
          <h3 className="text-orange-500 font-bold text-sm mt-2">FIND DEALS</h3>
          <h4 className="text-[#8B8B8B] text-[0.6rem] font-semibold">From Nearby</h4>
          <p className="text-white bg-orange-500 mt-1 py-0.5 px-1 rounded-lg w-fit h-fit text-[0.4rem]">
            Parts Shop
          </p>
          <motion.div
            className="absolute right-0 bottom-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Image src="/auto2.png" alt="burger" width={60} height={60} />
          </motion.div>
          <motion.div
            className="bg-green w-fit h-fit rounded-full p-1 absolute bottom-1 left-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Send color="white" size={15} />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bg-white h-[22%] w-[23%] rounded-t-xl bottom-[32%.3] left-[70%] flex flex-col items-center md:bottom-[41%]"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 145, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeIn" }}
        >
          <h3 className="text-orange-500 font-bold text-sm mt-2">SHOP ONLINE</h3>
          <h4 className="text-[#8B8B8B] text-[0.6rem] font-semibold">From Nearby</h4>
          <p className="text-white bg-orange-500 mt-1 py-0.5 px-1 rounded-lg w-fit h-fit text-[0.4rem]">
            Parts Shop  
          </p>
          <motion.div
            className="absolute -right-4 bottom-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Image src="/auto3.png" alt="breads" width={90} height={90} />
          </motion.div>
          <motion.div
            className="bg-green w-fit h-fit rounded-full p-1 absolute bottom-1 left-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
          >
            <Send color="white" size={15} />
          </motion.div>
        </motion.div>
        <div className="flex gap-6">
          <div className="w-[40%]">
            <div className="ml-2 w-full h-6 mt-8">
              <span className="text-white text-sm font-bold pr-1">Our</span>
              <span className="text-orange-500 text-sm font-bold pr-4">Best Delivered</span>
            </div>
            <div className="ml-2">
              <span className="text-white text-sm font-bold">Categories</span>
            </div>
          </div>
          <div className="w-[50%]">
            <p className="mt-6 w-fit h-fit px-0.5 py-1 text-center text-white rounded-xl border border-dashed border-white text-xs">
              It’s not just delivering food, it’s about delivering happiness !!
            </p>
          </div>
        </div>
        <div className="flex gap-20 ml-12  relative ">
          <DashedCircle height={120} width={120} />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute top-[38%] left-4"
          >
            <Image
              src="/auto1.png"
              alt="chillipaneer"
              width={100}
              height={100}
            />
          </motion.div>
          <p className="absolute -bottom-6 left-4 text-white font-bold text-lg">Gear Box</p>
          <div className="absolute -bottom-10 flex gap-1 left-[10%]">
            <p className="text-orange-500 text-xs">Order now</p>
            <ChevronRight className="text-orange-500" size={20} />
          </div>
          <DashedCircle height={120} width={120} />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute top-[28%] left-56 transform translate-x-1"
          >
            <Image
              src="/auto2.png"
              alt="chowmein"
              width={90}
              height={90}
            />
          </motion.div>
          <p className="absolute -bottom-6 left-[61%] text-white font-bold text-lg">Cluth Plate</p>
          <div className="absolute -bottom-10 flex gap-1 left-[65%]">
            <p className="text-orange-500 text-xs">Order now</p>
            <ChevronRight className="text-orange-500" size={20}/>
          </div>
        </div>
        <div className="flex w-full justify-center -ml-2 mt-6 relative">
          <DashedCircle height={120} width={120} />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute top-[25%]"
          >
            <Image
              src="/auto3.png"
              alt="momos"
              width={100}
              height={100}
              className=""
            />
          </motion.div>
          <p className="absolute -bottom-6 left-[41%] text-white font-bold text-lg">Brake</p>
          <div className="absolute -bottom-10 flex gap-1 left-[41%]">
            <p className="text-orange-500 text-xs">Order now</p>
            <ChevronRight className="text-orange-500" size={20} />
          </div>
        </div>
        <div className="mt-12 flex gap-16">
          <p className="text-orange-500 text-2xl font-bold ml-4">OFFERS</p>
          <p className="w-fit h-fit px-2 py-1 text-center text-white rounded-xl border-2 border-dashed border-white text-lg">
            Grab the best deals !!
          </p>
        </div>
        <div className="w-full h-[80vh] px-2 flex flex-col items-center gap-2 mt-4">
          <div className="relative bg-gradient-to-b from-[#FFCF54] to-[#C28E07] rounded-lg w-[80%] h-[50%] border-2 border-[#E4A80F] flex flex-col px-2">
            <p className="font-bold text-lg mt-2 ml-2">Buy 2</p>
            <p className="font-bold text-lg ml-2">Get 1 Free</p>
            <p className="font-bold text-4xl mt-1 bg-gradient-to-r from-[#E55B2A] to-[#E98562] bg-clip-text text-transparent ml-2">Order</p>
            <p className="font-bold text-4xl bg-gradient-to-r from-[#E55B2A] to-[#E98562] bg-clip-text text-transparent ml-2">Now</p>
            <Image src="/auto1.png" alt="burger" width={180} height={180} className="absolute right-1 top-16" />
            <Image src="/star.png" alt="star" width={150} height={150} className="absolute right-1 -top-12 transform -translate-y-2" />
            <p className="text-white text-[0.5rem] font-bold absolute right-16 top-4 transform translate-y-1.5 -translate-x-0.5">Rs 1800</p>
          </div>
          <div className="bg-gradient-to-b from-[#4D906E] to-[#0BAE5B] rounded-lg w-[80%] h-[50%] border-2 border-[#004D26] relative">
            <Image src="/auto2.png" width={130} height={130} alt="chicken biryani" className=" absolute bottom-2 left-28" />
            <p className="text-yellow-400 text-4xl font-bold ml-[65%] mt-2">Save</p>
            <p className="text-yellow-400 text-xl font-bold ml-[75%]">30%</p>
            <p className="bg-yellow-400 w-fit p-1 rounded-lg font-bold text-white -rotate-30 ml-2 -mt-12 text-2xl">Rs.250000</p>
          </div>
          <div className="bg-[#FC603A] rounded-lg w-[80%] h-[50%] border-4 border-[#BC2F0C] relative">
            <Image src="/auto3.png" width={120} height={120} alt="veg chowmein" className="absolute bottom-0 left-24" />
            <p className="text-white font-bold text-2xl ml-2">Mobile Phone</p>
            <p className="text-white ml-2 text-sm">Get Your Latest Phone</p>
            <div className="rounded-full w-16 h-16 bg-green border-4 border-[#117D47] absolute right-2 top-2 text-white font-bold flex justify-center items-center text-center text-sm">Rs 23000</div>
          </div>
        </div>
        <div className="mt-12 flex gap-16">
          <p className="text-orange-500 text-2xl font-bold ml-4">TOP RESTAURANTS</p>
        </div>
        <div className="w-full h-[100vh] px-2 flex flex-col items-center gap-2 mt-4">
          <div className="relative bg-green rounded-lg w-[80%] h-[50%] border-4 border-[#037932]">
            <div className="w-full h-[50%] relative">
              <Image src="/auto1.png" alt="restaurant cover" fill className="object-fill ml-2" />
            </div>
            <p className="text-white font-semibold ml-2 text-sm">Dominos</p>
            <div>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Fast Food</p>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Noida Sector 47</p>
            </div>
            <p className="bg-yellow-400 text-green-500 font-bold text-sm w-fit h-fit px-2 py-0.5 rounded-xl ml-2">Extra 10% off on First Order</p>
            <div className="flex justify-center items-center w-fit h-fit rounded-full bg-orange-500 absolute top-[51%] right-12 p-1">
              <Star color="white" size={10} />
            </div>
            <p className="text-white font-bold absolute top-[50%] right-6 transform -translate-y-0.5">4.5</p>
          </div>
          <div className="bg-gradient-to-b from-[#4D906E] to-[#0BAE5B] rounded-lg w-[80%] h-[50%] border-2 border-[#004D26] relative">
            <div className="w-full h-[50%] relative">
              <Image src="/auto2.png" alt="restaurant cover" fill className="object-fill ml-2" />
            </div>
            <p className="text-white font-semibold ml-2 text-sm">Dominos</p>
            <div>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Fast Food</p>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Noida Sector 47</p>
            </div>
            <p className="bg-yellow-400 text-green-500 font-bold text-sm w-fit h-fit px-2 py-0.5 rounded-xl ml-2">Extra 10% off on First Order</p>
            <div className="flex justify-center items-center w-fit h-fit rounded-full bg-orange-500 absolute top-[51%] right-12 p-1">
              <Star color="white" size={10} />
            </div>
            <p className="text-white font-bold absolute top-[50%] right-6 transform -translate-y-0.5">4.5</p>
          </div>
          <div className="bg-[#FC603A] rounded-lg w-[80%] h-[50%] border-2 border-[#BC2F0C] relative">
            <div className="w-full h-[50%] relative">
              <Image src="/auto2.png" alt="restaurant cover" fill className="object-fill ml-2" />
            </div>
            <p className="text-white font-semibold ml-2 text-sm">Dominos</p>
            <div>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Fast Food</p>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Noida Sector 47</p>
            </div>
            <p className="bg-yellow-400 text-green-500 font-bold text-sm w-fit h-fit px-2 py-0.5 rounded-xl ml-2">Extra 10% off on First Order</p>
            <div className="flex justify-center items-center w-fit h-fit rounded-full bg-orange-500 absolute top-[51%] right-12 p-1">
              <Star color="white" size={10} />
            </div>
            <p className="text-white font-bold absolute top-[50%] right-6 transform -translate-y-0.5">4.5</p>
          </div>
          <div className="bg-[#FC603A] rounded-lg w-[80%] h-[50%] border-2 border-[#BC2F0C] relative">
            <div className="w-full h-[50%] relative">
              <Image src="/auto1.png" alt="restaurant cover" fill className="object-fill ml-2" />
            </div>
            <p className="text-white font-semibold ml-2 text-sm">Dominos</p>
            <div>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Fast Food</p>
              <p className="text-white font-semibold ml-2 text-[0.5rem]">Noida Sector 47</p>
            </div>
            <p className="bg-yellow-400 text-green-500 font-bold text-sm w-fit h-fit px-2 py-0.5 rounded-xl ml-2">Extra 10% off on First Order</p>
            <div className="flex justify-center items-center w-fit h-fit rounded-full bg-yellow-400 absolute top-[51%] right-12 p-1">
              <Star color="white" size={10} />
            </div>
            <p className="text-white font-bold absolute top-[50%] right-6 transform -translate-y-0.5">4.5</p>
          </div>
        </div>
        <div className="w-full h-[30vh] mt-12 bg-gradient-to-r from-[#4D906E] to-[#162A20] relative">
          <Image src="/starbucks.png" width={100} height={100} alt="starbucks" className="absolute left-[37%] -top-[25%]" />
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[20%] mt-[5%]">
            <Image src="/starbuckslogo.png" alt="starbucks logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[13%] mt-[20%]">
            <Image src="/rollsking.png" alt="rollsking logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[20%] mt-[35%]">
            <Image src="/pizzahut.png" alt="pizzahut logo" width={20} height={20} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[73%] mt-[5%]">
            <Image src="/taccobell.png" alt="tacobell logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[80%] mt-[20%]">
            <Image src="/starbuckslogo.png" alt="starbucks logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[73%] mt-[35%]">
            <Image src="/burgerking.png" alt="burgerking logo" width={40} height={40} />
          </div>
          <p className="absolute w-[63%] top-[36%] left-[20%] text-sm font-semibold text-white text-center">
            {`Enjoy 3000+ Food > Items From 400+ Restaurants `}
          </p>  
        </div>
      </div>
    </div>
  );
}