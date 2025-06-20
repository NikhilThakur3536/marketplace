"use client";

import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const DOMAINID = process.env.NEXT_PUBLIC_DOMAIN_ID;
  const router = useRouter();

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
      console.log(data);
      const token = data.data.token;
      const id = data.data.customer.id;
      console.log(token);
      localStorage.setItem("userToken", token);
      localStorage.setItem("customerId", id);
      router.push("/foodmarketplace");
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen flex justify-center h-screen">
      <div className="relative max-w-md w-full bg-gray-200 h-screen overflow-hidden">
        <svg
          width="400"
          height="198"
          viewBox="0 0 416 198"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -bottom-4 -right-24 z-10"
        >
          <circle cx="270.5" cy="270.5" r="270.5" fill="#202020" />
        </svg>
        <svg
          width="768"
          height="377"
          viewBox="0 0 768 377"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -bottom-32 right-0 z-5"
        >
          <ellipse cx="417.5" cy="423" rx="449.5" ry="423" fill="black" />
        </svg>
        <svg
          width="392"
          height="402"
          viewBox="0 0 392 402"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -bottom-24 -right-44 rotate-270 z-1"
        >
          <circle cx="121.5" cy="270.5" r="270.5" fill="#404040" />
        </svg>
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
        <div className="mt-[20%] ml-[5%] flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="text-xl font-semibold">Good to see you again!</p>
        </div>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="max-w-md w-full py-4 z-40 flex flex-col justify-center items-center px-8 gap-4 mt-[50%]"
        >
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
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded-4xl bg-white h-12 placeholder:text-gray-400 font-bold focus:outline-2 focus:outline-black pl-12"
              onChange={(e) => setIdentifier(e.target.value)}
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
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded-4xl bg-white h-12 placeholder:text-gray-400 font-bold focus:outline-2 focus:outline-black pl-12"
              onChange={(e) => setPassword(e.target.value)}
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            className="absolute w-[40%] bg-white rounded-2xl py-2 text-black font-bold bottom-20"
            whileHover={{ scale: 1.05, boxShadow: "0px 1px 12px #FFFFFF" }}
            whileInView={{ scale: 1 }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}