import Link from "next/link";
import Cards from "./components/Card"
import Header from "./components/Header"
import { Star, MoveRight, Search, Heart, Shield, Clock } from "lucide-react"

export default function Home() {

  const why = [{ Icon: Shield, tittle: "Authentic Parts", description: "Original OEM and certified aftermarket parts for guaranteed quality" }, { Icon: Clock, tittle: "Fast Delivery", description: "Quick shipping with real-time tracking for all your orders" }, { Icon: Heart, tittle: "Customer Satisfaction", description: "30-day returns and dedicated customer support" }]

  const brand = [{ imageSrc: "/laptop.png", tittle: "Authentic Parts" }, { imageSrc: "/laptop.png", tittle: "Fast Delivery" }, { imageSrc: "/laptop.png", tittle: "Customer Satisfaction" }, { imageSrc: "/laptop.png", tittle: "Customer Satisfaction" }, { imageSrc: "/laptop.png", tittle: "Customer Satisfaction" }, { imageSrc: "/laptop.png", tittle: "Customer Satisfaction" }]

  return (
    <div className="overflow-x-hidden">
      <Header />
      <section className="w-screen flex justify-center ">
        <div className="bg-[#1e40af] max-w-md w-full flex flex-col items-center">
          <div className="flex gap-2 mt-4">
            <Star color="yellow" size={30} />
            <span className="text-lg text-[#dbd1e1] mb-4">Trusted by 50,000+ Car Owners</span>
          </div>
          <h2 className="text-4xl text-white md:text-5xl font-bold mb-2">Find Auto Parts</h2>
          <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-6">Instantly</h2>

          <p className="text-xl text-center w-[75%] text-white mb-8">
            The largest marketplace for original and aftermarket auto parts. Search by brand, model, and part type with
            lightning speed.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/products" passHref>
              <button className="flex items-center gap-2 bg-[#f97316] px-4 py-2 rounded-lg cursor-pointer">
                <span className="text-white text-lg font-semibold">Start Shopping</span>
                <MoveRight size={20} color="white" />
              </button>
            </Link>
            <button className="flex gap-2 items-center bg-[#1e40af] border border-white rounded-lg px-4 py-2 mb-4" >
              <Search color="white" size={20} />
              <span className="text-white text-lg font-semibold">Browse Catalog</span>
            </button>
          </div>
        </div>
      </section>
      {/* Why Choose us Sections */}
      <section className="w-screen flex justify-center">
        <div className="max-w-md w-full flex flex-col gap-4 bg-gray-100 items-center">
          <div className="w-full flex flex-col gap-4 items-center">
            <h1 className="text-black text-4xl font-bold mt-8 w-[70%] text-center">Why Choose AutoParts Hub?</h1>
            <h3 className="text-gray-600 text-md text-center w-[70%]">We make finding and buying auto parts simple, fast, and reliable</h3>
          </div>
          <div className="flex flex-col gap-4 w-full px-10">
            {why.map((items, index) => (<Cards key={index} {...items} />))}
          </div>
        </div>
      </section>
      <section className="w-screen flex justify-center">
        <div className="max-w-md w-full flex flex-col gap-4 bg-gray-100 items-center">
          <div className="w-full flex flex-col gap-4 items-center">
            <h1 className="text-black text-4xl font-bold mt-12 w-[70%] text-center">Parts for All Major Brands</h1>
            <h3 className="text-gray-600 text-md text-center w-[70%]">From luxury to everyday vehicles, we've got you covered</h3>
          </div>
          <div className="grid grid-cols-2 grid-rows-3 gap-2 w-full px-10">
            {brand.map((items, index) => (<Cards key={index} {...items} />))}
          </div>
        </div>
      </section>
    </div>
  )
}
