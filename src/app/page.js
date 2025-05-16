"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Search, Send, ChevronRight } from 'lucide-react';
import {DashedCircle} from './components/DashedCircle'; 

export default function MobileView() {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/searchpage');
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-black">
      <div className="bg-black w-[375px] h-screen relative overflow-y-scroll">
        <div className="flex gap-4 w-full px-2">
          <div className="flex flex-col mt-[10%] ml-4">
            <p className="text-white text-2xl font-bold">FASTEST</p>
            <div className="flex gap-1">
              <p className="text-orange text-2xl font-bold">DELIVERY</p>
              <span className="text-white text-3xl font-bold">&</span>
            </div>
            <div className="flex gap-1">
              <p className="text-2xl font-bold text-white">EASY</p>
              <p className="text-2xl font-bold text-orange">PICKUP</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-green rounded-full w-8 h-8 mt-2">
                <Image src="/menprofile.png" alt="profile" height={32} width={32} className="object-cover" />
              </div>
              <p className="mt-2 transform translate-y-1 w-[52%] text-white text-[0.5rem]">
                When you are too lazy to cook we are a click away !!
              </p>
            </div>
          </div>
          <DashedCircle height={144} width={144} />
          <Image
            src="/girleating.png"
            alt="girl"
            width={150}
            height={150}
            className="absolute z-10 right-0 top-10"
          />
        </div>

        <hr className="absolute left-6 mt-4 w-[85%] h-[1px] border border-dashed border-white" />

        <div className="flex gap-2">
          <div className="flex gap-1 mt-8 ml-4 bg-green rounded-xl w-36 h-8">
            <MapPin size={20} className="text-white ml-1 mt-2 transform -translate-y-0.5" />
            <p className="text-white text-xs mt-1.5 underline underline-offset-2">Enter Your Location</p>
          </div>
          <div
            className="bg-orange rounded-xl w-44 h-8 mt-8 cursor-pointer"
            onClick={handleSearchClick}
          >
            <div className="flex gap-1">
              <Search size={20} className="text-white mt-2 -translate-y-0.5 ml-1" />
              <input className="text-white text-xs mt-1.5 underline underline-offset-2" type='text' placeholder='Enter item or restaurant'/>
            </div>
          </div>
        </div>

        <svg
          className="ml-1 mt-8"
          width="350"
          height="141"
          viewBox="0 0 392 141"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 45.9485C0 39.7463 4.72636 34.5659 10.9026 33.9987L378.903 0.202825C385.934 -0.442896 392 5.09177 392 12.1525V129C392 135.627 386.627 141 380 141H12C5.37258 141 0 135.627 0 129V45.9485Z"
            fill="#FC603A"
          />
        </svg>

        <div className="absolute bg-white h-[18%] w-[25%] rounded-t-xl top-[45%] left-[5%] flex flex-col items-center">
          <h3 className="text-orange font-bold text-sm mt-2">TAKE AWAY</h3>
          <h4 className="text-[#8B8B8B] text-[0.6rem] font-semibold">From Nearby</h4>
          <p className="text-white bg-orange mt-1 py-0.5 px-1 rounded-lg w-fit h-fit text-[0.4rem]">
            Restaurants
          </p>
          <Image src="/biryani.png" alt="biryani" width={50} height={50} className="absolute right-0 -bottom-2" />
          <div className="bg-green w-fit h-fit rounded-full p-1 absolute bottom-1 left-1">
            <Send color="white" size={15} />
          </div>
        </div>

        <div className="absolute bg-white h-[20%] w-[25%] rounded-t-xl top-[43%] left-[38%] flex flex-col items-center">
          <h3 className="text-orange font-bold text-sm mt-2">TAKE AWAY</h3>
          <h4 className="text-[#8B8B8B] text-[0.6rem] font-semibold">From Nearby</h4>
          <p className="text-white bg-orange mt-1 py-0.5 px-1 rounded-lg w-fit h-fit text-[0.4rem]">
            Restaurants
          </p>
          <Image src="/burger.png" alt="burger" width={60} height={60} className="absolute right-0 -bottom-2" />
          <div className="bg-green w-fit h-fit rounded-full p-1 absolute bottom-1 left-1">
            <Send color="white" size={15} />
          </div>
        </div>

        <div className="absolute bg-white h-[22%] w-[25%] rounded-t-xl top-[41%] left-[70%] flex flex-col items-center">
          <h3 className="text-orange font-bold text-sm mt-2">TAKE AWAY</h3>
          <h4 className="text-[#8B8B8B] text-[0.6rem] font-semibold">From Nearby</h4>
          <p className="text-white bg-orange mt-1 py-0.5 px-1 rounded-lg w-fit h-fit text-[0.4rem]">
            Restaurants
          </p>
          <Image src="/breads.png" alt="breads" width={60} height={60} className="absolute right-0 -bottom-2" />
          <div className="bg-green w-fit h-fit rounded-full p-1 absolute bottom-1 left-1">
            <Send color="white" size={15} />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-[40%]">
            <div className="ml-2 w-full h-6 mt-4">
              <span className="text-white text-sm font-bold pr-1">Our</span>
              <span className="text-orange text-sm font-bold pr-4">Best Delivered</span>
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

        <div className="flex gap-16 ml-4 relative">
          <DashedCircle height={120} width={120} />
          <Image
            src="/chillipaneer.png"
            alt="chillipaneer"
            width={150}
            height={150}
            className="absolute top-[25%] -left-2"
          />
          <p className="absolute -bottom-6 left-4 text-white font-bold text-lg">Chilli Panner</p>
          <div className="absolute -bottom-10 flex gap-1 left-[10%]">
            <p className="text-orange text-xs">Order now</p>
            <ChevronRight className="text-orange" size={20} />
          </div>
          <DashedCircle height={120} width={120} />
          <Image
            src="/chowmein.png"
            alt="chowmein"
            width={85}
            height={85}
            className="absolute top-[12%] left-[62%]"
          />
          <p className="absolute -bottom-6 left-[61%] text-white font-bold text-lg">Chowmein</p>
          <div className="absolute -bottom-10 flex gap-1 left-[65%]">
            <p className="text-orange text-xs">Order now</p>
            <ChevronRight className="text-orange" size={20} />
          </div>
        </div>

        <div className="flex w-[375px] justify-center -ml-2 mt-6 relative">
          <DashedCircle height={120} width={120} />
          <Image
            src="/momos.png"
            alt="momos"
            width={100}
            height={100}
            className="absolute top-[25%]"
          />
          <p className="absolute -bottom-6 left-[41%] text-white font-bold text-lg">Momos</p>
          <div className="absolute -bottom-10 flex gap-1 left-[41%]">
            <p className="text-orange text-xs">Order now</p>
            <ChevronRight className="text-orange" size={20} />
          </div>
        </div>

        <div className="mt-12 flex gap-16">
          <p className="text-orange text-2xl font-bold ml-4">OFFERS</p>
          <p className="w-fit h-fit px-2 py-1 text-center text-white rounded-xl border-2 border-dashed border-white text-lg">
            Grab the best deals !!
          </p>
        </div>

        <div className="w-[375px] h-[80vh] px-2 flex flex-col items-center gap-2 mt-4">
          <div className="bg-gradient-to-b from-[#FFCF54] to-[#C28E07] rounded-lg w-[80%] h-[50%] border-2 border-[#E4A80F]"></div>
          <div className="bg-gradient-to-b from-[#4D906E] to-[#0BAE5B] rounded-lg w-[80%] h-[50%] border-2 border-[#004D26]"></div>
          <div className="bg-[#FC603A] rounded-lg w-[80%] h-[50%] border-2 border-[#BC2F0C]"></div>
        </div>

        <div className="mt-12 flex gap-16">
          <p className="text-orange text-2xl font-bold ml-4">TOP RESTAURANTS</p>
        </div>

        <div className="w-[375px] h-[100vh] px-2 flex flex-col items-center gap-2 mt-4">
          <div className="bg-gradient-to-b from-[#FFCF54] to-[#C28E07] rounded-lg w-[80%] h-[50%] border-2 border-[#E4A80F]"></div>
          <div className="bg-gradient-to-b from-[#4D906E] to-[#0BAE5B] rounded-lg w-[80%] h-[50%] border-2 border-[#004D26]"></div>
          <div className="bg-[#FC603A] rounded-lg w-[80%] h-[50%] border-2 border-[#BC2F0C]"></div>
          <div className="bg-[#FC603A] rounded-lg w-[80%] h-[50%] border-2 border-[#BC2F0C]"></div>
        </div>
        <div className="w-[375px] h-[30vh] mt-12 bg-gradient-to-r from-[#4D906E] to-[#162A20] relative">
          <Image src="/starbucks.png" width={100} height={100} alt="starbucks" className="absolute left-[37%] -top-[25%]" />
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[20%] mt-[5%]">
            <Image src="/starbuckslogo.png" alt="starbucks logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[13%] mt-[20%]">
            <Image src="/rollsking.png" alt="starbucks logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[20%] mt-[35%]">
            <Image src="/pizzahut.png" alt="starbucks logo" width={20} height={20} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[73%] mt-[5%]">
            <Image src="/taccobell.png" alt="starbucks logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[80%] mt-[20%]">
            <Image src="/starbuckslogo.png" alt="starbucks logo" width={40} height={40} />
          </div>
          <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[73%] mt-[35%]">
            <Image src="/burgerking.png" alt="starbucks logo" width={40} height={40} />
          </div>
          <p className="absolute w-[63%] top-[36%] left-[20%] text-sm font-semibold text-white text-center">
            Enjoy 3000+ Food Items From 400+ Restaurants
          </p>
        </div>
      </div>
    </div>
  );
}