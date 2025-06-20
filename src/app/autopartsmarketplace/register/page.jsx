"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, UserRound, Lock, Contact } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TestSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const DOMAIN_ID = process.env.NEXT_PUBLIC_AUTODOMAIN_ID;
  const router = useRouter();

  const onSubmit = async (data) => {
    setApiError("");
    setIsLoading(true);

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      registeredWith: "EMAIL",
      domainId: DOMAIN_ID,
    };

    try {
      const response = await axios.post(`${BASE_URL}/user/auth/register`, payload);
      console.log("Registration successful:", response.data);
      localStorage.setItem("usertoken", response.data.data.token || "");
      localStorage.setItem("domainId", DOMAIN_ID);
      localStorage.setItem("email", data.email);
      localStorage.setItem("otp", response.data.data.otp || "");
      router.push("/autopartsmarketplace/verification");
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed");
      console.error("Registration failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen flex justify-center bg-white h-screen">
      <div className="relative max-w-md w-full bg-gray-100 h-screen overflow-hidden">
        <svg
          width="226"
          height="270"
          viewBox="0 0 226 270"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-28 -right-12 z-10"
        >
          <ellipse cx="174" cy="110.5" rx="174" ry="159.5" fill="black" />
        </svg>
        <svg
          width="116"
          height="180"
          viewBox="0 0 116 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-10 -right-8 z-20"
        >
          <ellipse cx="136.5" cy="115" rx="136.5" ry="115" fill="#D9D9D9" />
        </svg>
        <svg
          width="768"
          height="314"
          viewBox="0 0 768 314"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -bottom-36"
        >
          <ellipse cx="430.5" cy="404.5" rx="735.5" ry="404.5" fill="black" />
        </svg>
        <svg
          width="338"
          height="213"
          viewBox="0 0 338 213"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -bottom-24 -right-24"
        >
          <ellipse cx="211.5" cy="189" rx="211.5" ry="189" fill="#404040" />
        </svg>
        <svg
          width="658"
          height="351"
          viewBox="0 0 658 351"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-32 z-[1]"
        >
          <path
            d="M564.036 -220.131L657.178 34.6552C657.178 34.6552 468.409 181.679 329.752 244.723C198.714 304.304 -22.3287 350.153 -22.3287 350.153L-116.21 -16.4327L564.036 -220.131Z"
            fill="white"
          />
        </svg>
        <div className="absolute z-40 top-[7%] ml-8 flex flex-col gap-4">
          <h1 className="font-bold text-5xl text-black">Sign Up</h1>
          <p className="font-semibold text-xl text-gray-400">Hello Come Join Us!</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md w-full py-4 z-40 flex flex-col justify-center items-center px-8 gap-4 mt-[50%]"
        >
          <div className="w-[80%] relative">
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="Name"
              className="mt-1 block w-full px-2 py-1 border-2 border-gray-300 rounded-3xl bg-white h-12 placeholder:text-gray-400 font-bold focus:outline-2 focus:outline-black pl-12"
            />
            <UserRound
              color="gray"
              size={20}
              className="absolute top-4 left-4 transform translate-y-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="w-[80%] relative">
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Email"
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded-3xl bg-white h-12 placeholder:text-gray-400 font-bold focus:outline-2 focus:outline-black pl-12"
            />
            <Mail
              color="gray"
              size={20}
              className="absolute top-4 left-4 transform translate-y-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="w-[80%] relative">
            <input
              type="tel"
              id="phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              placeholder="Phone Number"
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded-3xl bg-white h-12 placeholder:text-gray-400 font-bold focus:outline-2 focus:outline-black pl-12"
            />
            <Contact
              color="gray"
              size={20}
              className="absolute top-4 left-4 transform translate-y-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="w-[80%] relative">
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Password"
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded-3xl bg-white h-12 placeholder:text-gray-400 font-bold focus:outline-2 focus:outline-black pl-12"
            />
            <Lock
              color="gray"
              size={20}
              className="absolute top-4 left-4 transform translate-y-1"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

          <motion.button
            type="submit"
            className="absolute w-[40%] bg-white rounded-2xl py-2 text-black font-bold bottom-20"
            whileHover={{ scale: 1.05, boxShadow: "0px 1px 12px #FFFFFF" }}
            whileInView={{ scale: 1 }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </motion.button>
          <div className="flex gap-2 z-40 absolute bottom-10">
            <p className="text-black">Already Have An Account?</p>
            <span className="text-black font-bold">Log In</span>
          </div>
        </form>
      </div>
    </div>
  );
}