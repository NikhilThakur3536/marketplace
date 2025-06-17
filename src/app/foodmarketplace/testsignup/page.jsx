"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Mail, UserRound } from "lucide-react";

export default function TestSignup () {
    return(
        <div className="max-w-screen flex justify-center min-h-screen">
            <div className="w-full max-w-md relative bg-[#E6E6E6] overflow-hidden flex flex-col justify-center items-center gap-5">
                <Image src={"/foodbg.png"} fill alt=" bgimage" className="absolute object-center opacity-65"/>
                <svg width="424" height="195" viewBox="0 0 424 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-20 absolute -right-6 -top-2">
                    <g filter="url(#filter0_d_601_54)">
                    <path d="M406.495 163.579C406.495 163.579 306.779 91.8225 233 69.5787C169.741 50.5068 119.873 86.3799 64.9989 49.5788C43.3725 35.075 17.1767 3.11295 17.1767 3.11295L406.495 3.11294L406.495 163.579Z" fill="url(#paint0_linear_601_54)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_601_54" x="0.176758" y="0.112915" width="423.318" height="194.466" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="14"/>
                    <feGaussianBlur stdDeviation="8.5"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_601_54"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_601_54" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_601_54" x1="264.911" y1="-52.2897" x2="202.89" y2="106.208" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F98C37"/>
                    <stop offset="1" stopColor="#EE6416"/>
                    </linearGradient>
                    </defs>
                </svg>
                <svg width="355" height="164" viewBox="0 0 355 164" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-4 -left-4">
                    <g filter="url(#filter0_d_601_56)">
                    <path d="M335.168 154.53C335.168 154.53 298.785 48.3001 240.5 28.5001C176.587 6.78826 140.763 109.538 77.5006 86C48.8235 75.33 15.1675 38.53 15.1675 38.53L15.1675 154.53L335.168 154.53Z" fill="url(#paint0_linear_601_56)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_601_56" x="0.0679684" y="0.366186" width="354.2" height="163.264" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="2" dy="-8"/>
                    <feGaussianBlur stdDeviation="8.55"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_601_56"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_601_56" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_601_56" x1="204.557" y1="15.4565" x2="138.001" y2="199.057" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F98C37"/>
                    <stop offset="1" stopColor="#EE6416"/>
                    </linearGradient>
                    </defs>
                </svg>
                <h1 className="text-4xl font-bold ">Get On Board !</h1>
                <form  className="max-w-md w-full p-4 z-30 flex flex-col justify-center items-center px-12 gap-5">
                    <div className="w-[80%] relative h-fit">
                        <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-2xl bg-white h-12  focus:outline-2 focus:outline-[#F98C37]"
                        required
                        />
                        <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-[#F98C37]  to-[#EE6416] absolute top-2.5 left-1 ">
                            <UserRound color="white" size={20} />
                        </div>
                    </div>

                    <div className="w-[80%] relative">
                        <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-2xl bg-white h-12 focus:outline-2 focus:outline-[#F98C37]"
                        required
                        />
                        <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-[#F98C37]  to-[#EE6416] absolute top-2.5 left-1 ">
                            <Mail color="white" size={20} />
                        </div>
                    </div>

                     <div className="w-[80%] relative ">
                        <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-2xl bg-white h-12  focus:outline-2 focus:outline-[#F98C37]"
                        required
                        />
                        <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-[#F98C37]  to-[#EE6416] absolute top-2.5 left-1 ">
                            <Lock color="white" size={20} />
                        </div>
                    </div>

                    <motion.button
                        // type="submit"
                        className="w-[40%] bg-gradient-to-r from-[#F98C37]  to-[#EE6416] rounded-2xl py-2 text-white font-semibold"
                        whileHover={{scale:1.05, boxShadow:" 0px 1px 12px #F98C37"}}
                        whileInView={{scale:1}}
                    >
                        Submit
                    </motion.button>
                </form>
            </div>
        </div>
    )
}