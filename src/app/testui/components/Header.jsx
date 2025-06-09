"use client"

import { Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Header () {
    return(
        <div className="w-full  relative">
            <div className="flex w-full justify-between">
                <svg width="35" height="35" viewBox="0 0 30 30" fill="none" >
                    <rect x="0.5" y="0.5" width="12.5" height="12.5" rx="1.5" fill="white" stroke="black"/>
                    <rect x="0.5" y="17.1667" width="12.5" height="12.5" rx="1.5" fill="white" stroke="black"/>
                    <rect x="17.167" y="0.5" width="12.5" height="12.5" rx="1.5" fill="white" stroke="black"/>
                    <rect x="17.167" y="17.1667" width="12.5" height="12.5" rx="1.5" fill="white" stroke="black"/>
                </svg>
                <div className="bg-[#FDAD38] roudnded-lg w-10 h-10">
                </div>
                <motion.div className="absolute"
                    initial={{left:"0% ", opacity:[0] }}
                    animate={{left:["0%","12%","12%", "0%"], opacity:[0,1,1,0]}}
                    transition={{duration:1.5, ease:"easeInOut"}}
                >
                    <MapPin color="black" size={30}/>
                </motion.div>
                <motion.div className="absolute"
                    initial={{left:"0% ", opacity:[0,] }}
                    animate={{left:["0%","20%","20%", "0%"], opacity:[0,1,1,0]}}
                    transition={{duration:1.5, ease:"easeInOut", delay:0.2}}
                >
                    <Globe color="black" size={30} />
                </motion.div>    
            </div>
        </div>
    )
}