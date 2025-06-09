"use client"

import { Search, SlidersVertical } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar () {
    return(
        <div className="w-full flex justify-center px-2 mt-4 relative"> 
            <input type="text" placeholder="Search Food or Restaurant..." className="rounded-4xl bg-white placeholder:text-[#A3A3A3] placeholder:text-lg placeholder:font-bold border border-[#A3A3A3] w-full py-4 pl-12" />
            <div className="absolute w-fit h-fit p-2 rounded-full bg-[#FDAD38] right-4 transform translate-y-1.5">
                <SlidersVertical color="black" size={30} />
            </div>
            <div className="absolute left-4 transform translate-y-3.5">
                <Search color="gray" size={30}/>
            </div>
        </div>
    )
}