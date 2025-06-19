"use client"

import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
  const DOMAINID=process.env.NEXT_PUBLIC_DOMAIN_ID
  const router=useRouter();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    const payload = {
      domainId: DOMAINID,
      identifier: identifier,
      password: password,
    };

    try {
      const response = await fetch(`${BASE_URL}/user/auth/customer-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log(data)
      const token= data.data.token
      const id= data.data.customer.id
      console.log(token)
      localStorage.setItem('userToken',token)
      localStorage.setItem("customerId",id)
      router.push("/foodmarketplace")

    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen flex justify-center min-h-screen">
      <div className="w-full max-w-md overflow-hidden bg-gray-100 relative flex flex-col items-center justify-center gap-5">
        <div className="absolute -inset-1 w-full bg-[radial-gradient(circle,_#9ca3af_1px,_transparent_1px)] bg-[size:10px_10px] opacity-30"></div>
        <svg width="111" height="102" viewBox="0 0 111 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-0">
          <g filter="url(#filter0_d_612_71)">
            <path d="M93.5 0C93.5 0 95.1867 62.4809 67 69.5C50.778 73.5396 42.0473 56.6209 25.5 59C14.8401 60.5326 0 69.5 0 69.5V0H93.5Z" fill="url(#paint0_linear_612_71)" />
          </g>
          <defs>
            <filter id="filter0_d_612_71" x="-17" y="-3" width="127.52" height="104.126" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="14" />
              <feGaussianBlur stdDeviation="8.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_612_71" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_612_71" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_612_71" x1="46.7596" y1="0" x2="46.7596" y2="70.1262" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F98C37" />
              <stop offset="1" stopColor="#EE6416" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="83" height="71" viewBox="0 0 83 71" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-0">
          <g filter="url(#filter0_d_612_74)">
            <path d="M46.5 34C33.6127 26.3848 30.1421 7.18477 17.2548 -0.430453L83.2548 -0.430451L83.2548 38.5695C83.2548 38.5695 59.3873 41.6152 46.5 34Z" fill="url(#paint0_linear_612_74)" />
          </g>
          <defs>
            <filter id="filter0_d_612_74" x="0.253906" y="-3.43048" width="100" height="73.6016" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="14" />
              <feGaussianBlur stdDeviation="8.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_612_74" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_612_74" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_612_74" x1="67.3359" y1="-9.83704" x2="42.7438" y2="31.7804" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F98C37" />
              <stop offset="1" stopColor="#EE6416" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="338" height="212" viewBox="0 0 338 212" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0">
          <g filter="url(#filter0_d_613_79)">
            <path d="M338.478 219.085L15.4776 219.085C15.4776 219.085 38.6963 160.259 67.2207 133.656C95.5138 107.269 109.64 100.035 148.221 97.1561C215.221 92.1561 237.193 98.7041 280.721 75.6561C307.216 61.6271 338.478 25.0847 338.478 25.0847L338.478 219.085Z" fill="url(#paint0_linear_613_79)" />
          </g>
          <defs>
            <filter id="filter0_d_613_79" x="0.477539" y="0.0847168" width="357.001" height="228" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="2" dy="-8" />
              <feGaussianBlur stdDeviation="8.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_613_79" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_613_79" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_613_79" x1="150.5" y1="78" x2="262.607" y2="264.654" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F98C37" />
              <stop offset="1" stopColor="#EE6416" />
            </linearGradient>
          </defs>
        </svg>
        <h1 className="text-4xl font-bold w-[70%] text-center">Hello Welcome Back!</h1>
        <div className="max-w-md w-full p-4 z-30 flex flex-col justify-center items-center px-12 gap-5">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="w-[80%] relative">
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-2xl bg-white h-12 focus:outline-2 focus:outline-[#F98C37] pl-12"
              placeholder="Enter Identifier (Email/Phone/Employee Code)"
              required
            />
            <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-[#F98C37] to-[#EE6416] absolute top-2.5 left-1">
              <Mail color="white" size={20} />
            </div>
          </div>
          <div className="w-[80%] relative">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-2xl bg-white h-12 focus:outline-2 focus:outline-[#F98C37] pl-12"
              placeholder="Enter your Password"
              required
            />
            <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-[#F98C37] to-[#EE6416] absolute top-2.5 left-1">
              <Lock color="white" size={20} />
            </div>
          </div>
          <motion.button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-[40%] bg-gradient-to-r from-[#F98C37] to-[#EE6416] rounded-2xl py-2 text-white font-semibold ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={{ scale: 1.05, boxShadow: "0px 1px 12px #F98C37" }}
            whileInView={{ scale: 1 }}
          >
            {isLoading ? "Logging in..." : "Submit"}
          </motion.button>
        </div>
      </div>
    </div>  
  );
}