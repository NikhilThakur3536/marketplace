"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

export default function ItemTabs() {

  const [selected, setSelected] = useState(false)

  const selectionHandler = () => {
    setSelected(!selected)
  }

  return (
    <div className="w-full px-2 flex gap-2 items-center mt-1">
      <motion.div className="w-fit h-fit flex gap-1 px-4 py-1 rounded-4xl group cursor-pointer items-center"
        // initial={{background:"#D9D9D966"}}
        whileHover={{ background: "#FDAD38", boxShadow: "0px 6px 8px #FDAD3899" }}
        animate={{ background: selected ? "#FDAD38" : "#D9D9D966", boxShadow: selected ? "0px 4px 8px #FDAD3899" : "" }}
        onClick={selectionHandler}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        <div className="w-12 h-12 rounded-full bg-white transform -translate-x-2 p-[4px]">
          <div className="w-full h-full rouned-full relative transform ">
            <Image src={"/pizza.jpg"} fill className="object-cover object-center rounded-full" alt="image" />
          </div>
        </div>
        <motion.h3 className="text-black font-semibold text-xl group-hover:text-white transform -translate-y-0.5"
          animate={{ color: selected ? "#FFFFFF" : "" }}
        >
          Burger
        </motion.h3>
      </motion.div>
    </div>
  )
}
