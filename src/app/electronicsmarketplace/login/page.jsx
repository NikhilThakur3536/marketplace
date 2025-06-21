"use client";

import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function TestLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const DOMAIN_ID = process.env.NEXT_PUBLIC_ELECDOMAIN_ID; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/user/auth/customer-login`, {
        domainId: DOMAIN_ID,
        identifier,
        password,
      });

      const token = response.data.data.token;
      const customerId = response.data.data.customer.id;

      if (typeof window !== "undefined") {
        localStorage.setItem("userToken", token);
        localStorage.setItem("domainId", DOMAIN_ID);
        localStorage.setItem("customerId", customerId);
      }
      router.push("/electronicsmarketplace");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center">
      <div className="max-w-md w-full bg-white relative overflow-hidden flex">
        <svg width="768" height="590" viewBox="0 0 768 590" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-10">
          <path d="M105.141 329.704C-27.6104 348.599 -0.12354 568.554 -0.12354 568.554L-155.873 -321.602L817.933 -179.112L952.447 589.679C952.447 589.679 538.465 423.307 293.693 357.293C219.51 337.286 170.597 320.387 105.141 329.704Z" fill="#4ADE80"/>
        </svg>
        <motion.div initial={{x:-50}} animate={{x:0}} transition={{duration:1}}>
          <svg width="112" height="269" viewBox="0 0 112 269" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -left-8 top-16">
            <path d="M112 104C112 91 0.469068 -0.000202355 0.469068 -0.000202355L0.467714 268.5C0.467714 268.5 112 117 112 104Z" fill="#22C55E" fillOpacity="0.49"/>
          </svg>
        </motion.div>    
        <motion.div initial={{x:800}} animate={{x:450}} transition={{duration:1}}>
          <svg width="156" height="280" viewBox="0 0 156 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0">
            <path d="M0.362705 108.345C5.224 81.6902 103.363 0.345037 103.363 0.345037L155.501 0.345036L155.501 280C155.501 280 -4.49859 135 0.362705 108.345Z" fill="#22C55E" fillOpacity="0.34"/>
          </svg>
        </motion.div> 
        <motion.div initial={{x:800}} animate={{x:450}} transition={{duration:1, delay:0.5}}>   
          <svg width="225" height="360" viewBox="0 0 225 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0">
            <path d="M0.282342 101.174C7.59675 62.5142 151.584 -51.367 151.584 -51.367L227.732 -48.8004L225.482 359.318C225.482 359.318 -7.03209 139.834 0.282342 101.174Z" fill="#22C55E" fillOpacity="0.26"/>
          </svg>
        </motion.div>    
        <h2 className="text-white text-4xl font-bold absolute top-34 w-full flex justify-center">Hello Welcome Back !</h2>
        <form onSubmit={handleSubmit} className="max-w-md w-full z-30 flex flex-col justify-center items-center gap-5 mt-36">
          {error && (
            <div className="w-[80%] bg-red-500 text-white p-2 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="w-[80%] relative">
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 w-full p-2 rounded-2xl h-12 pl-12 focus:outline-none"
              placeholder="Enter Identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-green-400 to-green-500 absolute top-2.5 left-1">
              <Mail color="white" size={20} />
            </div>
            <hr className="h-[1px] bg-green-400 border-none mt-2"/>
          </div>
          <div className="w-[80%] relative">
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full p-2 rounded-2xl pl-12 focus:outline-none"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-green-400 to-green-500 absolute top-2.5 left-1">
              <Lock color="white" size={20} />
            </div>
            <hr className="h-[1px] bg-green-400 border-none mt-2"/>
          </div>
          <motion.button
            type="submit"
            className="w-[40%] bg-gradient-to-r from-green-400 to-green-500 rounded-2xl py-2 text-white font-semibold text-xl absolute bottom-32"
            whileHover={{ scale: 1.05, boxShadow: "0px 1px 12px #4ADE80" }}
            whileInView={{ scale: 1 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Submit"}
          </motion.button>
        </form>
        <div className="z-40 flex gap-1 absolute bottom-12 w-full justify-center">
          <p>Don't have an account?</p>
          <button className="text-green-400 font-bold cursor-pointer w-fit h-fit" onClick={() => { console.log("buttonclicked"); router.push("/electronicsmarketplace/register")}}>
            Sign Up
          </button>
        </div>    
      </div>
    </div>
  );
}