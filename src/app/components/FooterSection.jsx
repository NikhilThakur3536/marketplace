import Image from 'next/image';

export default function FooterSection() {
  return (
    <div className="w-[360px] h-[30vh] mt-12 bg-gradient-to-r from-[#4D906E] to-[#162A20] relative">
      <Image src="/starbucks.png" width={100} height={100} alt="starbucks" className="absolute left-[37%] -top-[25%]" />
      <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[20%] mt-[5%]">
        <Image src="/starbuckslogo.png" alt="starbucks logo" width={40} height={40} />
      </div>
      <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[13%] mt-[20%]">
        <Image src="/rollsking.png" alt="rolls king logo" width={40} height={40} />
      </div>
      <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[20%] mt-[35%]">
        <Image src="/pizzahut.png" alt="pizza hut logo" width={20} height={20} />
      </div>
      <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[73%] mt-[5%]">
        <Image src="/taccobell.png" alt="taco bell logo" width={40} height={40} />
      </div>
      <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[80%] mt-[20%]">
        <Image src="/starbuckslogo.png" alt="starbucks logo" width={40} height={40} />
      </div>
      <div className="absolute bg-[#D9D9D9] w-8 h-8 rounded-full flex items-center justify-center ml-[73%] mt-[35%]">
        <Image src="/burgerking.png" alt="burger king logo" width={40} height={40} />
      </div>
      <p className="absolute w-[63%] top-[36%] left-[20%] text-sm font-semibold text-white text-center">
        Enjoy 3000+ Food Items From 400+ Restaurants
      </p>
    </div>
  );
}