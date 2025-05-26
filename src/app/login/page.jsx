
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const DOMAIN_ID = process.env.NEXT_PUBLIC_DOMAIN_ID
  const DEVICE_ID = process.env.NEXT_PUBLIC_DEVICE_ID
  const DEVICE_TOKEN = process.env.NEXT_PUBLIC_DEVICE_TOKEN

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/user/auth/guest-login`, {
        domainId: DOMAIN_ID,
        deviceId: DEVICE_ID,
        deviceToken: DEVICE_TOKEN,
      });

      console.log("Login successful:", response.data);
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('deviceToken', response.data.data.token);
        localStorage.setItem('deviceId', DEVICE_ID);
        localStorage.setItem('domainId', DOMAIN_ID);
        console.log("Stored in localStorage:", {
          deviceToken: response.data.data.token,
          deviceId: DEVICE_ID,
          domainId: DOMAIN_ID,
        });
      }

      alert("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Guest Login</h2>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login as Guest"}
        </button>

        <p className="mt-4">
          Want a full account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
